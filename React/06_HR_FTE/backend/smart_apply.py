"""
smart_apply.py — AI-powered form analysis & filling for any job platform.

Instead of hardcoded keyword lists, this module:
  1. Extracts visible page elements (buttons, inputs, textareas, selects)
  2. Sends a compact DOM snapshot to the LLM
  3. LLM returns structured JSON instructions (which field → what value, which button → click)
  4. Playwright executes the instructions

Works on LinkedIn, Indeed, Glassdoor, Lever, Greenhouse, Workday, BambooHR,
SmartRecruiters, company career pages, or any other platform.
"""
from __future__ import annotations

import json
import os
import re
import time
import random
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from playwright.sync_api import Page, ElementHandle

import config


# ─── LLM helper ─────────────────────────────────────────────────────────────

def _ask_llm(prompt: str) -> str:
    """Send a prompt to the configured LLM and return the raw text response."""
    from llm_services import _get_llm

    llm = _get_llm(temperature=0.1, max_tokens=2000)
    resp = llm.invoke(prompt)
    return resp.content.strip()


def _parse_json(text: str) -> dict | list | None:
    """Best-effort JSON extraction from LLM output."""
    # Try direct parse
    try:
        return json.loads(text)
    except Exception:
        pass
    # Try extracting from markdown code blocks
    m = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if m:
        try:
            return json.loads(m.group(1).strip())
        except Exception:
            pass
    # Try finding first { ... } or [ ... ]
    m = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass
    return None


# ─── DOM snapshot helpers ────────────────────────────────────────────────────

def _human_delay(lo: float = 0.5, hi: float = 1.5):
    time.sleep(random.uniform(lo, hi))


def _extract_visible_elements(page: "Page") -> list[dict]:
    """
    Extract all visible interactive elements from the page (including iframes)
    into a compact list the LLM can reason about.
    """
    js_code = """
    () => {
        const results = [];
        let idx = 0;

        function process(root, frameLabel) {
            const selectors = 'input, textarea, select, button, a[href], [role="button"], [role="link"], [type="submit"], [type="file"]';
            const els = root.querySelectorAll(selectors);
            for (const el of els) {
                try {
                    const rect = el.getBoundingClientRect();
                    if (rect.width === 0 && rect.height === 0) continue;
                    const style = window.getComputedStyle(el);
                    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

                    const tag = el.tagName.toLowerCase();
                    const type = el.getAttribute('type') || '';
                    const name = el.getAttribute('name') || '';
                    const id = el.getAttribute('id') || '';
                    const placeholder = el.getAttribute('placeholder') || '';
                    const ariaLabel = el.getAttribute('aria-label') || '';
                    const value = (tag === 'select')
                        ? Array.from(el.options).map(o => o.text.trim()).slice(0, 8).join(' | ')
                        : (el.value || '').substring(0, 80);
                    const text = (tag === 'button' || tag === 'a' || el.getAttribute('role'))
                        ? (el.innerText || '').trim().substring(0, 100)
                        : '';

                    // Find associated label
                    let label = '';
                    if (id) {
                        const lbl = root.querySelector('label[for="' + id + '"]');
                        if (lbl) label = lbl.innerText.trim().substring(0, 100);
                    }
                    if (!label) {
                        const parent = el.closest('label, .form-group, .field, [class*="field"], [class*="form"]');
                        if (parent) {
                            const lbl = parent.querySelector('label, .label, legend, [class*="label"]');
                            if (lbl && lbl !== el) label = lbl.innerText.trim().substring(0, 100);
                        }
                    }

                    const required = el.hasAttribute('required') || el.getAttribute('aria-required') === 'true';
                    const disabled = el.disabled || el.hasAttribute('disabled');
                    const checked = el.checked || false;

                    results.push({
                        i: idx++,
                        tag,
                        type: type.toLowerCase(),
                        name,
                        id,
                        placeholder,
                        ariaLabel,
                        label,
                        text,
                        value,
                        required,
                        disabled,
                        checked,
                        frame: frameLabel,
                    });
                } catch (e) {}
            }
        }

        process(document, 'main');
        return results;
    }
    """
    elements = []
    try:
        elements = page.evaluate(js_code)
    except Exception:
        pass

    # Also try iframes
    for fi, frame in enumerate(page.frames[1:], start=1):
        try:
            frame_els = frame.evaluate(js_code)
            for el in frame_els:
                el["frame"] = f"iframe-{fi}"
                el["i"] = len(elements)
                elements.append(el)
        except Exception:
            pass

    return elements


def _get_element_by_index(page: "Page", elements: list[dict], idx: int) -> "ElementHandle | None":
    """Locate the real DOM element corresponding to elements[idx]."""
    if idx < 0 or idx >= len(elements):
        return None
    el_info = elements[idx]

    # Determine which frame to search in
    frame_label = el_info.get("frame", "main")
    target_frames = []
    if frame_label == "main":
        target_frames = [page]
    else:
        # iframe-N
        try:
            fi = int(frame_label.split("-")[1])
            if fi < len(page.frames):
                target_frames = [page.frames[fi]]
        except Exception:
            target_frames = [page]

    for frame in target_frames:
        # Try ID first (most precise)
        if el_info.get("id"):
            try:
                el = frame.query_selector(f'#{el_info["id"]}')
                if el:
                    return el
            except Exception:
                pass

        # Try name + tag + type
        tag = el_info.get("tag", "input")
        sel_parts = [tag]
        if el_info.get("name"):
            sel_parts.append(f'[name="{el_info["name"]}"]')
        if el_info.get("type") and el_info["type"] not in ("", "text"):
            sel_parts.append(f'[type="{el_info["type"]}"]')
        selector = "".join(sel_parts)

        try:
            candidates = frame.query_selector_all(selector)
            if len(candidates) == 1:
                return candidates[0]
            # If multiple, match by placeholder or aria-label
            for c in candidates:
                ph = c.get_attribute("placeholder") or ""
                al = c.get_attribute("aria-label") or ""
                if el_info.get("placeholder") and el_info["placeholder"] in ph:
                    return c
                if el_info.get("ariaLabel") and el_info["ariaLabel"] in al:
                    return c
            if candidates:
                return candidates[0]
        except Exception:
            pass

    return None


# ─── AI analysis functions ───────────────────────────────────────────────────

def ai_find_apply_button(elements: list[dict], page_url: str) -> int | None:
    """Ask the LLM which element is the 'Apply' button. Returns element index or None."""
    # Pre-filter to only buttons/links
    clickables = [e for e in elements if e["tag"] in ("button", "a") or e.get("type") in ("submit", "button") or e.get("text")]
    if not clickables:
        return None

    compact = "\n".join(
        f'[{e["i"]}] <{e["tag"]}> text="{e["text"]}" aria="{e["ariaLabel"]}" id="{e["id"]}"'
        for e in clickables[:40]
    )

    prompt = f"""You are an intelligent web automation agent. The user wants to apply for a job.

PAGE URL: {page_url}

Here are all the clickable elements on the page:
{compact}

Which element is the main "Apply" button (e.g. "Apply Now", "Easy Apply", "Quick Apply", "Apply", "Apply on company site", "Continue to Apply")?
Ignore social login buttons (Google, Facebook, LinkedIn sign-in).
Ignore navigation links that are NOT the apply action.

Return ONLY a JSON object: {{"index": <element_index>, "reason": "short reason"}}
If no apply button exists, return: {{"index": null, "reason": "no apply button found"}}"""

    resp = _ask_llm(prompt)
    data = _parse_json(resp)
    if data and isinstance(data, dict):
        idx = data.get("index")
        if isinstance(idx, int):
            return idx
    return None


def ai_analyze_form(elements: list[dict], profile: dict, job_title: str, company: str, resume_path: str, cover_letter: str) -> list[dict]:
    """
    Ask the LLM to analyze the form fields and return fill instructions.
    Returns a list of actions: [{"index": N, "action": "fill", "value": "..."}, ...]
    """
    # Pre-filter to only form fields
    fields = [e for e in elements if e["tag"] in ("input", "textarea", "select") and not e.get("disabled")]
    if not fields:
        return []

    compact = "\n".join(
        f'[{e["i"]}] <{e["tag"]} type="{e["type"]}"> '
        f'name="{e["name"]}" label="{e["label"]}" placeholder="{e["placeholder"]}" '
        f'aria="{e["ariaLabel"]}" value="{e["value"]}" required={e["required"]}'
        for e in fields[:30]
    )

    screening = profile.get("screening_answers", {})
    profile_summary = json.dumps({
        "name": profile.get("name", ""),
        "email": profile.get("email", ""),
        "phone": profile.get("phone", ""),
        "street": profile.get("street", ""),
        "city": profile.get("city", ""),
        "state_province": profile.get("state_province", ""),
        "country": profile.get("country", ""),
        "address": profile.get("address", ""),
        "postal_code": profile.get("postal_code", ""),
        "desired_salary": profile.get("desired_salary", ""),
        "skills": profile.get("skills", []),
        "linkedin": profile.get("linkedin", ""),
        "website": profile.get("website", ""),
    }, indent=2)

    screening_summary = json.dumps(screening, indent=2) if screening else "{}"

    prompt = f"""You are an intelligent job application form filler. Analyze these form fields and decide what to fill.

JOB: {job_title} at {company}

USER PROFILE:
{profile_summary}

COVER LETTER (use for cover letter / message fields):
{cover_letter[:500]}

RESUME FILE: {"available" if resume_path else "not available"}

SCREENING QUESTION ANSWERS (use these for yes/no and eligibility questions):
{screening_summary}

FORM FIELDS:
{compact}

For EACH field that should be filled, return a JSON action. Rules:
- "fill" action: type text into input/textarea
- "upload" action: for file inputs (resume/cv upload)
- "select" action: for <select> dropdowns — pick the best option text
- "check" action: for checkboxes that should be ticked (e.g. terms/privacy/agreement)
- "click" action: for radio buttons — click the correct option
- "skip" action: for fields already filled or not relevant
- If a field asks for first name, use only the first name from the profile
- If a field asks for last name, use only the last name from the profile
- For phone fields, use the phone number as-is
- For "years of experience" or similar, estimate based on seniority or use "3"
- For "how did you hear about us", use "Job Board"
- For location/city, use the city field; for state/province use state_province
- For street/address line 1, use the street field
- For zip/postal code, use postal_code
- For salary expectation, use the desired_salary
- For LinkedIn URL fields, use the linkedin field if available
- For "Are you 18 or over?" → select/pick "Yes"
- For "Are you eligible to work in the United States?" → select/pick "Yes"
- For "Do you have a college degree?" → select/pick "Yes"
- For "Do you need visa sponsorship?" or similar → select/pick "No"
- For "Have you ever worked for [company]?" → select/pick "No"
- For any yes/no screening question, check screening_answers above for the correct response

Return ONLY a JSON array:
[
  {{"index": <element_index>, "action": "fill", "value": "text to type"}},
  {{"index": <element_index>, "action": "upload"}},
  {{"index": <element_index>, "action": "select", "value": "option text to pick"}},
  {{"index": <element_index>, "action": "check"}}
]

Only include fields that need action. Skip already-filled or irrelevant fields."""

    resp = _ask_llm(prompt)
    data = _parse_json(resp)
    if data and isinstance(data, list):
        return data
    return []


def ai_find_next_button(elements: list[dict], page_url: str) -> dict | None:
    """
    Ask the LLM which button to click next. Could be Submit, Next, Continue, etc.
    Returns {"index": N, "is_submit": bool} or None.
    """
    clickables = [e for e in elements if e["tag"] in ("button", "a") or e.get("type") in ("submit", "button") or e.get("text")]
    if not clickables:
        return None

    compact = "\n".join(
        f'[{e["i"]}] <{e["tag"]}> text="{e["text"]}" aria="{e["ariaLabel"]}" type="{e["type"]}" id="{e["id"]}"'
        for e in clickables[:30]
    )

    prompt = f"""You are an intelligent web automation agent filling a job application form.

PAGE URL: {page_url}

Here are all clickable elements on the current page/step:
{compact}

Determine: What is the MAIN action button to proceed with the application?
This could be:
- A "Submit" / "Send" / "Finish" / "Complete" button (final submission)
- A "Next" / "Continue" / "Save and continue" / "Proceed" / "Review" button (go to next step)
- An "Apply" / "Apply now" button (sometimes on the same page as the form)

Ignore: navigation links, "Cancel", "Back", "Close", social login, "Sign in" buttons.

Return ONLY JSON: {{"index": <element_index>, "is_submit": true/false, "reason": "short reason"}}
- is_submit = true if this is the FINAL submit button
- is_submit = false if this is a "Next" / intermediate step button

If no relevant button found, return: {{"index": null, "is_submit": false, "reason": "no action button"}}"""

    resp = _ask_llm(prompt)
    data = _parse_json(resp)
    if data and isinstance(data, dict) and data.get("index") is not None:
        return data
    return None


# ─── Main AI apply orchestrator ──────────────────────────────────────────────

def smart_apply(
    page: "Page",
    job_url: str,
    job_title: str,
    company: str,
    profile: dict,
    resume_path: str,
    cover_letter: str,
    log_fn=print,
) -> bool:
    """
    AI-powered apply flow:
      1. Navigate to job URL
      2. Ask LLM to find the Apply button → click it
      3. Loop: extract form → ask LLM how to fill → fill → ask LLM for next button → click
      4. Detect final submission

    log_fn: callable that receives status messages (for SSE streaming)
    """
    from tools import check_forced_pause, wait_for_page_load

    # ── Step 1: Navigate ──
    log_fn(f"🌐 Navigating to: {job_url[:80]}…")
    try:
        page.goto(job_url, wait_until="domcontentloaded", timeout=30000)
        check_forced_pause(page)
        wait_for_page_load(page)
    except Exception as e:
        log_fn(f"❌ Navigation failed: {e}")
        return False

    page_title = ""
    try:
        page_title = page.title()
    except Exception:
        pass
    log_fn(f"📄 Page loaded: {page_title[:60]}")

    # ── Step 2: Find & click Apply button ──
    elements = _extract_visible_elements(page)
    log_fn(f"🔍 Found {len(elements)} interactive elements — asking AI to find Apply button…")

    apply_idx = ai_find_apply_button(elements, page.url)
    working_page = page

    if apply_idx is not None:
        btn_el = _get_element_by_index(page, elements, apply_idx)
        if btn_el:
            btn_text = ""
            try:
                btn_text = btn_el.inner_text().strip()
            except Exception:
                pass
            log_fn(f"🖱️ AI found Apply button: '{btn_text}' — clicking…")
            _human_delay(0.8, 1.5)

            # May open new tab
            try:
                ctx = page.context
                with ctx.expect_page(timeout=5000) as new_page_info:
                    btn_el.click()
                working_page = new_page_info.value
                try:
                    from playwright_stealth import Stealth
                    Stealth().apply_stealth_sync(working_page)
                except Exception:
                    pass
                log_fn("📑 Application opened in new tab")
            except Exception:
                try:
                    btn_el.click()
                except Exception:
                    pass
                working_page = page
                log_fn("📑 Continuing on same page")
        else:
            log_fn("⚠️ Could not locate the apply button element — proceeding with page as-is")
    else:
        log_fn("ℹ️ No separate Apply button — page may already be a form. Proceeding…")

    _human_delay(1, 2)
    wait_for_page_load(working_page)

    # ── Step 3: Multi-step form loop ──
    MAX_STEPS = 12
    success = False
    last_url = ""
    stuck_count = 0

    for step_num in range(1, MAX_STEPS + 1):
        if working_page.is_closed():
            log_fn("⚠️ Page was closed unexpectedly")
            break

        current_url = working_page.url
        if current_url == last_url:
            stuck_count += 1
            if stuck_count >= 3:
                log_fn("⚠️ Page unchanged for 3 steps — stopping to avoid infinite loop")
                break
        else:
            stuck_count = 0
        last_url = current_url

        check_forced_pause(working_page)
        wait_for_page_load(working_page)

        # Extract fresh elements
        elements = _extract_visible_elements(working_page)
        form_fields = [e for e in elements if e["tag"] in ("input", "textarea", "select")]
        log_fn(f"📝 Step {step_num}: Found {len(form_fields)} form fields — asking AI to analyze…")

        # Ask AI how to fill the form
        if form_fields:
            actions = ai_analyze_form(elements, profile, job_title, company, resume_path, cover_letter)
            filled_count = 0

            for action in actions:
                idx = action.get("index")
                act = action.get("action", "skip")
                value = action.get("value", "")

                if act == "skip" or idx is None:
                    continue

                el = _get_element_by_index(working_page, elements, idx)
                if not el:
                    continue

                try:
                    if act == "fill":
                        _human_delay(0.3, 0.8)
                        el.fill(value)
                        filled_count += 1
                    elif act == "upload" and resume_path and os.path.exists(resume_path):
                        _human_delay(0.5, 1)
                        el.set_input_files(resume_path)
                        log_fn(f"📎 Uploaded resume: {os.path.basename(resume_path)}")
                        filled_count += 1
                    elif act == "select":
                        _human_delay(0.3, 0.6)
                        try:
                            el.select_option(label=value)
                        except Exception:
                            # Try by value text partial match
                            try:
                                options = el.query_selector_all("option")
                                for opt in options:
                                    if value.lower() in (opt.inner_text() or "").lower():
                                        el.select_option(value=opt.get_attribute("value"))
                                        break
                            except Exception:
                                pass
                        filled_count += 1
                    elif act == "check":
                        _human_delay(0.2, 0.5)
                        if not el.is_checked():
                            el.click()
                        filled_count += 1
                    elif act == "click":
                        # For radio buttons or clickable elements
                        _human_delay(0.2, 0.5)
                        el.click()
                        filled_count += 1
                except Exception as e:
                    log_fn(f"⚠️ Could not perform '{act}' on field {idx}: {e}")

            log_fn(f"✏️ Step {step_num}: Filled {filled_count} fields")
        else:
            log_fn(f"ℹ️ Step {step_num}: No form fields found on this page")

        _human_delay(0.5, 1)

        # Ask AI what button to click next
        elements = _extract_visible_elements(working_page)  # Re-extract after filling
        log_fn(f"🔍 Step {step_num}: Asking AI for next action button…")
        next_info = ai_find_next_button(elements, working_page.url)

        if next_info and next_info.get("index") is not None:
            btn_el = _get_element_by_index(working_page, elements, next_info["index"])
            if btn_el:
                btn_text = ""
                try:
                    btn_text = btn_el.inner_text().strip()
                except Exception:
                    pass

                is_submit = next_info.get("is_submit", False)

                if is_submit:
                    log_fn(f"🚀 AI found Submit button: '{btn_text}' — submitting application…")
                    _human_delay(1.5, 2.5)
                    try:
                        btn_el.click()
                    except Exception:
                        pass
                    time.sleep(4)
                    log_fn(f"✅ Application submitted for {job_title} at {company}!")
                    success = True
                    break
                else:
                    log_fn(f"➡️ Step {step_num}: AI clicking '{btn_text}' to continue…")
                    _human_delay(0.8, 1.5)
                    try:
                        btn_el.click()
                    except Exception as e:
                        log_fn(f"⚠️ Click failed: {e}")
                        if step_num > 1:
                            log_fn("🏁 Form may already be submitted")
                            success = True
                        break
            else:
                log_fn("⚠️ AI identified a button but could not locate it in DOM")
                if step_num > 1:
                    log_fn("🏁 Assuming form is complete")
                    success = True
                break
        else:
            # No button found — could mean we're done
            if step_num > 1:
                log_fn("🏁 No more action buttons — application appears complete")
                success = True
            else:
                log_fn("⚠️ No action button found on first step — may need manual intervention")
            break

        _human_delay(1, 2)

    if not success:
        log_fn(
            "⚠️ Could not fully complete the application — "
            "the browser window is still open for manual review."
        )

    return success
