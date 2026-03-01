"""
browser_manager.py — Manages a DEDICATED Chrome instance for job automation.

Instead of Playwright's bundled Chromium (which gets flagged as a bot), this
module launches the user's actual Google Chrome binary but with its OWN
separate profile directory (--user-data-dir), then Playwright connects via CDP.

Why a dedicated profile?
  - The user's normal Chrome stays COMPLETELY UNTOUCHED — no killing, no conflicts.
  - Chrome allows multiple instances as long as each uses a different --user-data-dir.
  - The automation profile persists logins across sessions (log in once, reuse forever).
  - No "navigator.webdriver" flag, no automation markers — it's a real Chrome binary.
  - CAPTCHAs and bot detection are bypassed because it's a genuine Chrome instance.

Architecture:
  1. Backend launches:  google-chrome --remote-debugging-port=9222 --user-data-dir=<automation profile>
  2. Playwright connects:  chromium.connect_over_cdp("http://localhost:9222")
  3. Playwright controls a new tab in the dedicated Chrome — user's normal Chrome is untouched
  4. When done, Playwright disconnects (automation Chrome stays open with saved sessions)
"""
from __future__ import annotations

import asyncio
import json
import os
import platform
import queue
import subprocess
import threading
import time
from pathlib import Path
from typing import AsyncGenerator

import config

# ── Constants ────────────────────────────────────────────────────────────────

CDP_PORT = 9222
CDP_ENDPOINT = f"http://localhost:{CDP_PORT}"

# Dedicated Chrome profile directory for job automation (separate from user's
# normal Chrome profile).  Lives inside the project — gitignored via browser_session/.
_AUTOMATION_PROFILE_DIR = str(
    Path(__file__).resolve().parent / "browser_session" / "automation_profile"
)

# Quick reference URLs for popular job sites
LOGIN_URLS = {
    "indeed": "https://www.indeed.com/account/login",
    "linkedin": "https://www.linkedin.com/login",
    "glassdoor": "https://www.glassdoor.com/profile/login_input.htm",
    "dice": "https://www.dice.com/dashboard/login",
    "ziprecruiter": "https://www.ziprecruiter.com/login",
    "monster": "https://www.monster.com/profile/detail",
    "wellfound": "https://wellfound.com/login",
    "lever": "https://jobs.lever.co/",
    "greenhouse": "https://boards.greenhouse.io/",
    "workday": "https://www.myworkday.com/",
}

# ── Detect Chrome ────────────────────────────────────────────────────────────


def _find_chrome_binary() -> str | None:
    """Find the real Chrome/Chromium binary on the system."""
    # Allow override via env var
    env_path = os.environ.get("CHROME_PATH")
    if env_path and os.path.isfile(env_path):
        return env_path

    system = platform.system()

    if system == "Linux":
        candidates = [
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium",
            "/snap/bin/chromium",
            "/opt/google/chrome/google-chrome",
        ]
    elif system == "Darwin":  # macOS
        candidates = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
        ]
    elif system == "Windows":
        local = os.environ.get("LOCALAPPDATA", "")
        pf = os.environ.get("PROGRAMFILES", "C:\\Program Files")
        pf86 = os.environ.get("PROGRAMFILES(X86)", "C:\\Program Files (x86)")
        candidates = [
            os.path.join(local, "Google", "Chrome", "Application", "chrome.exe"),
            os.path.join(pf, "Google", "Chrome", "Application", "chrome.exe"),
            os.path.join(pf86, "Google", "Chrome", "Application", "chrome.exe"),
        ]
    else:
        candidates = []

    for path in candidates:
        if os.path.isfile(path):
            return path
    return None


# ── State ────────────────────────────────────────────────────────────────────

_chrome_process: subprocess.Popen | None = None
_chrome_lock = threading.Lock()
_login_browser_active = False


def is_login_active() -> bool:
    """Check if a login browser interaction is currently in progress."""
    return _login_browser_active


def is_chrome_running_with_debug() -> bool:
    """Check if Chrome is already running with remote debugging on our port."""
    import urllib.request
    try:
        resp = urllib.request.urlopen(f"{CDP_ENDPOINT}/json/version", timeout=2)
        data = json.loads(resp.read())
        return "webSocketDebuggerUrl" in data
    except Exception:
        return False


def has_saved_session() -> bool:
    """Check if the automation Chrome profile has login data."""
    cookies_path = os.path.join(_AUTOMATION_PROFILE_DIR, "Default", "Cookies")
    login_data_path = os.path.join(_AUTOMATION_PROFILE_DIR, "Default", "Login Data")
    return os.path.exists(cookies_path) or os.path.exists(login_data_path)


def get_saved_sites() -> list[str]:
    """Return info about the session state."""
    result = []
    if has_saved_session():
        result.append("chrome_profile_found")
    if is_chrome_running_with_debug():
        result.append("chrome_debug_active")
    return result


def get_chrome_info() -> dict:
    """Return information about Chrome installation and automation profile."""
    chrome_bin = _find_chrome_binary()
    debug_active = is_chrome_running_with_debug()

    return {
        "chrome_found": chrome_bin is not None,
        "chrome_path": chrome_bin or "not found",
        "profile_dir": _AUTOMATION_PROFILE_DIR,
        "profile_exists": os.path.isdir(_AUTOMATION_PROFILE_DIR),
        "debug_port": CDP_PORT,
        "debug_active": debug_active,
        "has_cookies": has_saved_session(),
    }


def clear_session() -> bool:
    """
    Clear the automation Chrome profile (delete cookies/login data).
    Since this is a separate profile, we can safely wipe it.
    """
    default_dir = os.path.join(_AUTOMATION_PROFILE_DIR, "Default")
    if os.path.isdir(default_dir):
        for name in ("Cookies", "Cookies-journal", "Login Data", "Login Data-journal"):
            fpath = os.path.join(default_dir, name)
            if os.path.exists(fpath):
                try:
                    os.remove(fpath)
                except OSError:
                    pass
    return True


# ── Launch Chrome with debugging ─────────────────────────────────────────────


def _kill_automation_chrome() -> None:
    """
    Kill only the automation Chrome instance (the one we spawned).
    This does NOT touch the user's normal Chrome browser.
    """
    global _chrome_process
    if _chrome_process:
        try:
            _chrome_process.terminate()
            _chrome_process.wait(timeout=5)
        except Exception:
            try:
                _chrome_process.kill()
            except Exception:
                pass
        _chrome_process = None
        time.sleep(1)  # Let the profile lock release


def launch_chrome_with_debugging(url: str = "about:blank") -> tuple[bool, str]:
    """
    Launch a DEDICATED Chrome instance with --remote-debugging-port.

    Uses a separate --user-data-dir so the user's normal Chrome is
    completely untouched.  Chrome allows multiple instances when each
    one has its own profile directory.

    Returns (success, message).
    """
    global _chrome_process

    # Already running with debug?
    if is_chrome_running_with_debug():
        return True, "Automation Chrome is already running with remote debugging enabled."

    chrome_bin = _find_chrome_binary()
    if not chrome_bin:
        return False, (
            "Could not find Google Chrome installed on this system. "
            "Please install Chrome or set the CHROME_PATH environment variable."
        )

    # Kill our own previous automation instance if it's lingering
    _kill_automation_chrome()

    # Ensure the dedicated profile directory exists
    os.makedirs(_AUTOMATION_PROFILE_DIR, exist_ok=True)

    args = [
        chrome_bin,
        f"--remote-debugging-port={CDP_PORT}",
        f"--user-data-dir={_AUTOMATION_PROFILE_DIR}",
        "--no-first-run",
        "--no-default-browser-check",
        url,
    ]

    try:
        _chrome_process = subprocess.Popen(
            args,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        # Wait for Chrome to start and the debug port to become available
        for _ in range(30):  # up to ~15 seconds
            time.sleep(0.5)
            if is_chrome_running_with_debug():
                return True, (
                    f"Automation Chrome launched on port {CDP_PORT} "
                    f"(dedicated profile — your normal Chrome is untouched)."
                )

        return False, (
            "Chrome started but debugging port is not responding. "
            "If another automation Chrome is lingering, stop it first and retry."
        )

    except FileNotFoundError:
        return False, f"Chrome binary not found at: {chrome_bin}"
    except Exception as e:
        return False, f"Failed to launch Chrome: {e}"


def stop_chrome_debugging() -> tuple[bool, str]:
    """Stop the automation Chrome instance we launched (if any)."""
    global _chrome_process
    if _chrome_process:
        try:
            _chrome_process.terminate()
            _chrome_process.wait(timeout=5)
            _chrome_process = None
            return True, "Automation Chrome session ended. Your normal Chrome is unaffected."
        except Exception as e:
            return False, f"Could not stop automation Chrome: {e}"
    return True, "No automation Chrome process to stop."


# ── Connect Playwright to automation Chrome ──────────────────────────────────


def connect_to_real_chrome():
    """
    Connect Playwright to the automation Chrome via CDP.
    Returns (pw, browser, context, page).

    The caller MUST call browser.close() when done — this only DISCONNECTS
    Playwright from Chrome, it does NOT close the automation Chrome browser.
    """
    from playwright.sync_api import sync_playwright

    pw = sync_playwright().start()
    browser = pw.chromium.connect_over_cdp(CDP_ENDPOINT)

    # Get the default context (the automation browser context with saved cookies)
    context = browser.contexts[0] if browser.contexts else browser.new_context()
    # Open a new tab for automation (don't disturb existing tabs)
    page = context.new_page()

    return pw, browser, context, page


# ── Login flow (runs in a thread) ────────────────────────────────────────────


def _run_login_browser(
    target_url: str,
    sq: queue.Queue,
    timeout_minutes: int = 5,
) -> None:
    """
    Opens the automation Chrome to a login page via CDP.
    The user logs in manually in the automation browser, then we disconnect.
    """
    global _login_browser_active

    with _chrome_lock:
        if _login_browser_active:
            sq.put({"step": "error", "message": "A login session is already in progress."})
            sq.put(None)
            return
        _login_browser_active = True

    pw = None
    browser = None

    try:
        # Step 1: Launch automation Chrome with debugging
        sq.put({"step": "start", "message": "Launching automation Chrome browser…"})

        success, msg = launch_chrome_with_debugging(target_url)
        if not success:
            sq.put({"step": "error", "message": msg})
            return

        sq.put({"step": "info", "message": msg})

        # Step 2: Connect Playwright to verify the connection
        sq.put({"step": "info", "message": "Connecting to Chrome via DevTools Protocol…"})

        try:
            from playwright.sync_api import sync_playwright as sync_pw
            pw = sync_pw().start()
            browser = pw.chromium.connect_over_cdp(CDP_ENDPOINT)
            ctx = browser.contexts[0] if browser.contexts else None

            if ctx and ctx.pages:
                current_url = ctx.pages[-1].url
                sq.put({"step": "info", "message": f"Connected! Current tab: {current_url[:80]}"})
            else:
                sq.put({"step": "info", "message": "Connected to automation Chrome."})

        except Exception as e:
            sq.put({"step": "warning", "message": f"CDP connection check: {e}"})

        sq.put({
            "step": "ready",
            "message": (
                f"Automation Chrome is open at {target_url}. "
                "Log in normally — this is a dedicated Chrome instance with its own "
                "profile. Your normal Chrome is completely untouched. "
                "Login sessions are saved and reused for future automation. "
                f"Click 'Done' when finished, or auto-saves after {timeout_minutes} min."
            ),
        })

        # Step 3: Wait for timeout or Chrome to close
        deadline = time.time() + (timeout_minutes * 60)
        while time.time() < deadline:
            time.sleep(5)
            if not is_chrome_running_with_debug():
                sq.put({"step": "info", "message": "Chrome debugging port closed."})
                break

        sq.put({
            "step": "success",
            "message": (
                "Done! Your login sessions are saved in the automation Chrome profile. "
                "When applying to jobs, the app uses this dedicated profile — you'll "
                "already be logged in. Your normal Chrome is never touched."
            ),
        })

    except Exception as e:
        sq.put({"step": "error", "message": f"Error: {e}"})
    finally:
        # Disconnect Playwright (does NOT close Chrome)
        if browser:
            try:
                browser.close()
            except Exception:
                pass
        if pw:
            try:
                pw.stop()
            except Exception:
                pass
        _login_browser_active = False
        sq.put(None)  # sentinel


# ── Public async SSE generator ───────────────────────────────────────────────


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, default=str)}\n\n"


async def stream_login_session(
    site: str = "indeed",
    timeout_minutes: int = 5,
) -> AsyncGenerator[str, None]:
    """
    Async generator that:
      1. Launches the automation Chrome with debugging
      2. Yields SSE events as they proceed
    """
    target_url = LOGIN_URLS.get(site.lower(), site)
    if site.startswith("http"):
        target_url = site

    sq: queue.Queue = queue.Queue()

    loop = asyncio.get_event_loop()
    future = loop.run_in_executor(
        None, _run_login_browser, target_url, sq, timeout_minutes
    )

    yield _sse("login_start", {"site": site, "url": target_url})

    while True:
        msg = await asyncio.to_thread(sq.get)
        if msg is None:
            break
        step = msg.get("step", "progress")
        text = msg.get("message", "")

        if step == "success":
            yield _sse("login_complete", {"success": True, "message": text})
        elif step == "error":
            yield _sse("login_error", {"success": False, "message": text})
        elif step == "ready":
            yield _sse("login_ready", {"message": text})
        else:
            yield _sse("login_progress", {"message": text, "step": step})

    try:
        await future
    except Exception as e:
        yield _sse("login_error", {"success": False, "message": str(e)})
