"""
apply_worker.py — Async wrapper around the AI-powered Playwright apply logic.

Connects to the user's REAL Chrome browser via CDP (Chrome DevTools Protocol)
so that:
  - The user's existing login sessions (Indeed, LinkedIn, etc.) are available
  - No bot detection / CAPTCHA — it IS the real Chrome, not an automated browser
  - Playwright only controls a new tab, the rest of Chrome stays untouched

Runs the synchronous Playwright code in a thread so it does not block
FastAPI's event loop. Yields SSE-compatible status strings.
"""
from __future__ import annotations

import asyncio
import json
import os
import queue
import threading
from pathlib import Path
from typing import AsyncGenerator

from playwright.sync_api import sync_playwright, TimeoutError as PwTimeout

import config
from browser_manager import (
    launch_chrome_with_debugging,
    is_chrome_running_with_debug,
    CDP_ENDPOINT,
)

# ── Helper ───────────────────────────────────────────────────────────────────

def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, default=str)}\n\n"


# ── Status logger passed into the apply thread ────────────────────────────────

class _StatusQueue:
    """Thread-safe status queue used by the apply thread to emit log lines."""

    def __init__(self) -> None:
        self._q: "queue.Queue[dict | None]" = queue.Queue()

    def emit(self, message: str, step: str = "progress") -> None:
        self._q.put({"step": step, "message": message})

    def done(self) -> None:
        self._q.put(None)  # sentinel

    def get(self) -> "dict | None":
        return self._q.get()


# ── Profile builder ───────────────────────────────────────────────────────────

def _build_profile(resume_profile: dict | None) -> dict:
    """
    Merge (in priority order):
      1. Resume-parsed data (name, email, phone from uploaded CV)
      2. user_profile.json (address, salary, cover_letter, etc.)
      3. Hardcoded safe defaults
    """
    defaults = {
        "name": "Candidate",
        "email": "candidate@example.com",
        "phone": "0000000000",
        "street": "",
        "city": "",
        "state_province": "",
        "country": "Pakistan",
        "address": "Pakistan",
        "postal_code": "00000",
        "desired_salary": "50000",
        "cover_letter": (
            "I am very interested in this position and confident that my skills "
            "and experience make me an excellent candidate. I look forward to "
            "contributing to your team."
        ),
        "screening_answers": {
            "age_18_or_over": "Yes",
            "eligible_to_work_in_us": "Yes",
            "college_degree": "Yes",
            "need_visa_sponsorship": "No",
            "worked_for_gray_tv": "No",
            "willing_to_relocate": "Yes",
            "how_did_you_hear": "Job Board",
        },
    }

    # Layer 2: user_profile.json (optional extras like address, salary)
    json_profile: dict = {}
    profile_path = os.path.join(config.BASE_DIR, "user_profile.json")
    if os.path.exists(profile_path):
        try:
            with open(profile_path) as f:
                json_profile = json.load(f)
        except Exception:
            pass

    # Layer 3 (highest priority): resume-parsed data
    resume_data = resume_profile or {}

    # Merge: defaults ← json_profile ← resume_data
    merged = {**defaults, **json_profile, **resume_data}
    return merged


# ── Playwright runner (runs in a thread) ─────────────────────────────────────

def _run_apply(
    job_url: str,
    job_title: str,
    company: str,
    sq: _StatusQueue,
    resume_profile: dict | None = None,
) -> bool:
    """
    Launches a Playwright browser and uses the AI-powered smart_apply agent
    to dynamically analyze the page, fill forms, and submit the application.
    Works on any job platform (LinkedIn, Indeed, Glassdoor, Lever, Greenhouse, etc.).
    """
    try:
        sq.emit(f"Launching AI agent for '{job_title}' at {company}…", "start")

        # Build the merged profile — resume data has highest priority
        profile = _build_profile(resume_profile)

        sq.emit(
            f"📋 Profile: {profile.get('name', '?')} "
            f"<{profile.get('email', '?')}> | Phone: {profile.get('phone', '?')}",
            "info",
        )

        # Locate resume file - prefer the uploaded session file
        resume_path = ""
        uploads = config.UPLOAD_DIR
        pdf_files = sorted(uploads.glob("*.pdf"), key=lambda f: f.stat().st_mtime, reverse=True)
        docx_files = sorted(uploads.glob("*.docx"), key=lambda f: f.stat().st_mtime, reverse=True)
        doc_files = sorted(uploads.glob("*.doc"), key=lambda f: f.stat().st_mtime, reverse=True)

        for candidates in [pdf_files, docx_files, doc_files]:
            if candidates:
                resume_path = str(candidates[0])
                sq.emit(f"📎 Resume file: {candidates[0].name}", "info")
                break

        if not resume_path:
            for candidate in [
                os.path.join(config.BASE_DIR, "templates", "resume.pdf"),
                os.path.join(config.BASE_DIR, "templates", "resume.docx"),
            ]:
                if os.path.exists(candidate):
                    resume_path = candidate
                    break

        if not resume_path:
            sq.emit("⚠️  No resume file found — file upload fields will be skipped", "warning")

        cover_letter = profile.get(
            "cover_letter",
            f"I am very interested in the {job_title} position at {company}. "
            f"My skills and experience make me an excellent candidate for this role.",
        )

        # ── Connect to the dedicated automation Chrome via CDP ──
        # This launches a separate Chrome instance with its own profile dir,
        # leaving the user's normal Chrome completely untouched.
        with sync_playwright() as pw:
            # Ensure automation Chrome is running with debugging
            if not is_chrome_running_with_debug():
                sq.emit("🚀 Starting automation Chrome browser (your normal Chrome stays open)…", "info")
                success, msg = launch_chrome_with_debugging()
                if not success:
                    sq.emit(f"❌ {msg}", "error")
                    sq.emit(
                        "💡 Tip: If another automation Chrome is lingering, stop it first "
                        "and retry. Your normal Chrome is not affected.",
                        "info",
                    )
                    return False
                sq.emit(f"✅ {msg}", "info")
            else:
                sq.emit("🔗 Connecting to automation Chrome browser…", "info")

            # Connect via CDP — this attaches to the real Chrome
            browser = pw.chromium.connect_over_cdp(CDP_ENDPOINT)
            sq.emit(
                "🟢 Connected to real Chrome — using your actual login sessions, "
                "no bot detection possible",
                "info",
            )

            # Use the first (default) context — has all the user's cookies
            context = browser.contexts[0] if browser.contexts else browser.new_context()
            # Open a NEW tab for automation (don't disturb existing tabs)
            page = context.new_page()

            try:
                # Use the AI-powered smart apply agent
                from smart_apply import smart_apply

                def log_fn(msg: str):
                    sq.emit(msg, "progress")

                sq.emit("🤖 AI agent initialized — analyzing job page dynamically…", "progress")

                success = smart_apply(
                    page=page,
                    job_url=job_url,
                    job_title=job_title,
                    company=company,
                    profile=profile,
                    resume_path=resume_path,
                    cover_letter=cover_letter,
                    log_fn=log_fn,
                )

                return success

            except PwTimeout as e:
                sq.emit(f"❌ Page timed out: {e}", "error")
                return False
            except Exception as e:
                sq.emit(f"❌ Error during apply: {e}", "error")
                return False
            finally:
                try:
                    page.wait_for_timeout(3000)
                    # Close only the tab we opened, NOT the whole browser
                    if not page.is_closed():
                        page.close()
                    # Disconnect Playwright (does NOT close Chrome)
                    browser.close()
                except Exception:
                    pass

    except Exception as e:
        sq.emit(f"❌ Fatal error: {e}", "error")
        return False
    finally:
        sq.done()


# ── Public async generator ────────────────────────────────────────────────────

async def stream_apply(
    job_url: str,
    job_title: str,
    company: str,
    profile: dict | None = None,
) -> AsyncGenerator[str, None]:
    """
    Async generator that:
      1. Starts the Playwright apply in a background thread, passing the
         resume-parsed profile so form fields are auto-filled from the CV.
      2. Yields SSE events as they arrive from the status queue.
    """
    sq = _StatusQueue()

    loop = asyncio.get_event_loop()
    future = loop.run_in_executor(
        None, _run_apply, job_url, job_title, company, sq, profile
    )

    yield _sse("apply_start", {"job_title": job_title, "company": company, "url": job_url})

    # Drain messages from the queue until thread signals done (None sentinel)
    while True:
        msg = await asyncio.to_thread(sq.get)
        if msg is None:
            break
        step = msg.get("step", "progress")
        text = msg.get("message", "")

        if step == "success":
            yield _sse("apply_complete", {"success": True, "message": text})
        elif step == "error":
            yield _sse("apply_error", {"success": False, "message": text})
        else:
            yield _sse("apply_progress", {"message": text, "step": step})

    # Await the thread result for final completion event
    try:
        success = await future
    except Exception as e:
        success = False
        yield _sse("apply_error", {"success": False, "message": str(e)})

    if success:
        yield _sse("apply_complete", {
            "success": True,
            "message": f"Application for '{job_title}' at {company} submitted!",
        })
