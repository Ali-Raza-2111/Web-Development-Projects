"""
CareerOS Backend — FastAPI application.

Endpoints:
  POST /api/upload                       — Upload resume, get session_id + parsed profile
  GET  /api/pipeline/{id}                — SSE stream: runs the full pipeline with real-time events
  GET  /api/status/{id}                  — Get final pipeline results (poll-based alternative)
  POST /api/command                      — Parse natural language command, return execution plan
  GET  /api/apply/{session_id}/{job_idx} — SSE stream: run Playwright to apply to a matched job
  GET  /health                           — Health check
"""
from __future__ import annotations

import asyncio
import json
import os
import re
import time
import uuid
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

import config
from graph import pipeline, PipelineState
from apply_worker import stream_apply
from browser_manager import (
    stream_login_session,
    has_saved_session,
    get_saved_sites,
    is_login_active,
    clear_session,
    get_chrome_info,
    launch_chrome_with_debugging,
    stop_chrome_debugging,
    is_chrome_running_with_debug,
    LOGIN_URLS,
)


# ── App Setup ───────────────────────────────────────────────────────────────────

app = FastAPI(
    title="CareerOS Backend",
    description="AI-powered job application pipeline with LangGraph",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── File-backed session store (persists across server restarts for 24 h) ──────

def _session_path(session_id: str) -> Path:
    """Return the JSON file path for a session."""
    return config.SESSION_DIR / f"{session_id}.json"


def _save_session(session_id: str, data: dict) -> None:
    """Persist a session dict to disk."""
    data["_updated_at"] = time.time()
    if "_created_at" not in data:
        data["_created_at"] = time.time()
    with open(_session_path(session_id), "w") as f:
        json.dump(data, f, default=str)


def _load_session(session_id: str) -> dict | None:
    """Load a session from disk. Returns None if missing or expired."""
    p = _session_path(session_id)
    if not p.exists():
        return None
    try:
        with open(p) as f:
            data = json.load(f)
        # Check 24-hour expiry
        created = data.get("_created_at", 0)
        if time.time() - created > config.SESSION_TTL_HOURS * 3600:
            p.unlink(missing_ok=True)
            return None
        return data
    except Exception:
        return None


def _list_sessions() -> list[dict]:
    """Return metadata for all non-expired sessions (most recent first)."""
    results = []
    now = time.time()
    for p in config.SESSION_DIR.glob("*.json"):
        try:
            with open(p) as f:
                data = json.load(f)
            created = data.get("_created_at", 0)
            if now - created > config.SESSION_TTL_HOURS * 3600:
                p.unlink(missing_ok=True)
                continue
            results.append({
                "session_id": p.stem,
                "status": data.get("status", "unknown"),
                "profile": data.get("profile"),
                "created_at": created,
                "has_result": data.get("result") is not None,
            })
        except Exception:
            continue
    results.sort(key=lambda x: x["created_at"], reverse=True)
    return results


def _cleanup_expired_sessions() -> None:
    """Delete session files older than SESSION_TTL_HOURS."""
    now = time.time()
    for p in config.SESSION_DIR.glob("*.json"):
        try:
            with open(p) as f:
                data = json.load(f)
            if now - data.get("_created_at", 0) > config.SESSION_TTL_HOURS * 3600:
                p.unlink(missing_ok=True)
        except Exception:
            pass


# ── Endpoints ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "demo_mode": config.DEMO_MODE,
        "langsmith_enabled": config.LANGCHAIN_TRACING_V2.lower() == "true",
    }


@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload a resume file (PDF/DOCX). Returns session_id and basic info."""
    # Validate file type
    ext = Path(file.filename or "").suffix.lower()
    if ext not in (".pdf", ".docx", ".doc"):
        raise HTTPException(400, "Only PDF and DOCX files are supported")

    # Save file
    session_id = str(uuid.uuid4())
    file_path = config.UPLOAD_DIR / f"{session_id}{ext}"

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Quick parse to return immediate feedback
    from resume_parser import parse_resume
    try:
        profile = parse_resume(str(file_path))
    except Exception as e:
        raise HTTPException(422, f"Could not parse resume: {str(e)}")

    # Store session (persisted to disk)
    _save_session(session_id, {
        "file_path": str(file_path),
        "profile": {k: v for k, v in profile.items() if k != "raw_text"},
        "status": "uploaded",
        "result": None,
    })

    return {
        "session_id": session_id,
        "filename": file.filename,
        "profile": {
            "name": profile["name"],
            "email": profile["email"],
            "phone": profile["phone"],
            "skills": profile["skills"],
            "skill_count": len(profile["skills"]),
        },
    }


@app.get("/api/pipeline/{session_id}")
async def run_pipeline_sse(session_id: str):
    """
    Run the full LangGraph pipeline and stream events via SSE.
    The frontend connects to this with EventSource.
    """
    session = _load_session(session_id)
    if not session:
        raise HTTPException(404, "Session not found. Upload a resume first.")

    file_path = session["file_path"]

    async def event_stream():
        """Generator that runs the pipeline and yields SSE events."""
        steps = [
            ("parse_resume", "Resume Parser", "Parsing resume and extracting profile..."),
            ("detect_role", "Role Detector", "Detecting best-fit job role..."),
            ("search_jobs", "Job Intelligence", "Searching for matching jobs..."),
            ("score_matches", "Matching Engine", "Scoring job matches..."),
            ("generate_applications", "Application Generator", "Generating tailored applications..."),
        ]

        # Send initial event
        yield _sse_event("pipeline_start", {
            "total_steps": len(steps),
            "steps": [{"name": s[1], "status": "waiting"} for s in steps],
        })

        # Run the pipeline step by step using LangGraph stream
        initial_state: PipelineState = {
            "session_id": session_id,
            "file_path": file_path,
            "logs": [],
        }

        step_index = 0
        final_state = {}

        try:
            # Use stream to get incremental updates from each node
            for event in pipeline.stream(initial_state, stream_mode="updates"):
                for node_name, node_output in event.items():
                    # Find step info
                    step_info = next(
                        (s for s in steps if s[0] == node_name),
                        (node_name, node_name, "Processing..."),
                    )

                    # Merge into final state
                    final_state.update(node_output)

                    # Get the latest log entry
                    logs = node_output.get("logs", [])
                    latest_log = logs[-1] if logs else None

                    # Send step_start event
                    yield _sse_event("step_start", {
                        "step_index": step_index,
                        "step_name": step_info[1],
                        "description": step_info[2],
                    })

                    # Small delay to make the UI feel natural
                    await asyncio.sleep(0.5)

                    # Build step result
                    step_result: dict = {
                        "step_index": step_index,
                        "step_name": step_info[1],
                        "status": "completed",
                    }

                    # Add node-specific data to the event
                    if node_name == "parse_resume":
                        step_result["data"] = {
                            "name": node_output.get("name", ""),
                            "email": node_output.get("email", ""),
                            "skills": node_output.get("skills", []),
                            "skill_count": len(node_output.get("skills", [])),
                        }
                    elif node_name == "detect_role":
                        step_result["data"] = {
                            "primary_role": node_output.get("primary_role", ""),
                            "secondary_roles": node_output.get("secondary_roles", []),
                            "seniority": node_output.get("seniority", ""),
                            "location": node_output.get("preferred_location", ""),
                        }
                    elif node_name == "search_jobs":
                        jobs = node_output.get("jobs", [])
                        step_result["data"] = {
                            "job_count": len(jobs),
                            "jobs": [{
                                "title": j["title"],
                                "company": j["company"],
                                "location": j["location"],
                            } for j in jobs],
                        }
                    elif node_name == "score_matches":
                        matched = node_output.get("matched_jobs", [])
                        step_result["data"] = {
                            "matched_count": len(matched),
                            "top_matches": [{
                                "title": j["title"],
                                "company": j["company"],
                                "match_score": j["match_score"],
                            } for j in matched[:5]],
                        }
                    elif node_name == "generate_applications":
                        apps = node_output.get("applications", [])
                        step_result["data"] = {
                            "application_count": len(apps),
                            "applications": [{
                                "title": a["title"],
                                "company": a["company"],
                                "match_score": a["match_score"],
                                "status": a["status"],
                            } for a in apps],
                        }

                    if latest_log:
                        step_result["log"] = latest_log

                    # Check for errors
                    if node_output.get("error"):
                        step_result["status"] = "error"
                        step_result["error"] = node_output["error"]

                    yield _sse_event("step_complete", step_result)
                    step_index += 1
                    await asyncio.sleep(0.3)

            # Send pipeline_complete
            result = {
                "profile": {
                    "name": final_state.get("name", ""),
                    "email": final_state.get("email", ""),
                    "phone": final_state.get("phone", ""),
                    "skills": final_state.get("skills", []),
                },
                "detected_role": {
                    "primary_role": final_state.get("primary_role", ""),
                    "secondary_roles": final_state.get("secondary_roles", []),
                    "seniority": final_state.get("seniority", ""),
                    "location": final_state.get("preferred_location", ""),
                },
                "matched_jobs": [
                    {
                        "job_id": j.get("job_id", ""),
                        "title": j["title"],
                        "company": j["company"],
                        "location": j["location"],
                        "match_score": j["match_score"],
                        "url": j.get("url", ""),
                        "salary": j.get("salary", ""),
                    }
                    for j in final_state.get("matched_jobs", [])
                ],
                "applications": [
                    {
                        "title": a["title"],
                        "company": a["company"],
                        "match_score": a["match_score"],
                        "cover_letter": a["cover_letter"],
                        "status": a["status"],
                        "url": a.get("url", ""),
                    }
                    for a in final_state.get("applications", [])
                ],
                "logs": final_state.get("logs", []),
            }

            # Save to session (persist to disk)
            session_data = _load_session(session_id) or {}
            session_data["result"] = result
            session_data["status"] = "completed"
            _save_session(session_id, session_data)

            yield _sse_event("pipeline_complete", result)

        except Exception as e:
            yield _sse_event("pipeline_error", {"error": str(e)})
            session_data = _load_session(session_id) or {}
            session_data["status"] = "error"
            _save_session(session_id, session_data)

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/status/{session_id}")
def get_status(session_id: str):
    """Get the current status and results for a session (poll-based)."""
    session = _load_session(session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    return {
        "session_id": session_id,
        "status": session["status"],
        "profile": session.get("profile"),
        "result": session.get("result"),
    }


@app.get("/api/sessions")
def list_sessions():
    """List all active sessions (within 24 h). Frontend uses this to restore on refresh."""
    _cleanup_expired_sessions()
    return {"sessions": _list_sessions()}


@app.get("/api/sessions/latest")
def get_latest_session():
    """
    Return the most recent session with full result data.
    The frontend calls this on mount to restore state after a page refresh.
    """
    _cleanup_expired_sessions()
    all_sessions = _list_sessions()
    if not all_sessions:
        raise HTTPException(404, "No active sessions")

    latest = all_sessions[0]  # already sorted most-recent-first
    session = _load_session(latest["session_id"])
    if not session:
        raise HTTPException(404, "Session expired")

    return {
        "session_id": latest["session_id"],
        "status": session.get("status", "unknown"),
        "profile": session.get("profile"),
        "result": session.get("result"),
    }


# ── Command Endpoint ─────────────────────────────────────────────────────────────

class CommandRequest(BaseModel):
    command: str
    session_id: Optional[str] = None


@app.post("/api/command")
async def parse_command(req: CommandRequest):
    """
    Parse a natural-language command and return a structured execution plan.
    Tries to match the named job against the session's matched_jobs.
    """
    command = req.command.strip()
    session_id = req.session_id

    # -- Detect intent: apply --
    apply_patterns = [
        r"apply\s+to\s+(?:the\s+)?(.+?)(?:\s+at\s+(.+))?$",
        r"apply\s+for\s+(?:the\s+)?(.+?)(?:\s+at\s+(.+))?$",
        r"submit\s+(?:application|app)\s+(?:for\s+)?(.+?)(?:\s+at\s+(.+))?$",
        r"send\s+(?:application|cv|resume)\s+(?:for\s+)?(.+?)(?:\s+at\s+(.+))?$",
    ]

    matched_title: Optional[str] = None
    matched_company: Optional[str] = None

    for pattern in apply_patterns:
        m = re.search(pattern, command, re.IGNORECASE)
        if m:
            matched_title = m.group(1).strip() if m.group(1) else None
            if m.lastindex is not None and m.lastindex >= 2:
                matched_company = m.group(2).strip() if m.group(2) else None
            break

    if not matched_title:
        # Return a generic plan so the UI still shows something
        return {
            "action": "unknown",
            "message": "Command not recognised. Try: 'Apply to [job title]' or 'Apply to [job title] at [company]'.",
            "plan": [],
        }

    # -- Try to find the job in the session --
    job_index: Optional[int] = None
    job_title = matched_title
    company = matched_company or "Unknown Company"
    job_url = ""
    job_match_score = 0

    if session_id:
        session_data = _load_session(session_id)
        if session_data:
            result = session_data.get("result")
        if result:
            jobs = result.get("matched_jobs", [])
            # Search by title (fuzzy: check if the command title appears in the job title)
            for idx, job in enumerate(jobs):
                if matched_title.lower() in job.get("title", "").lower():
                    job_index = idx
                    job_title = job.get("title", matched_title)
                    company = job.get("company", company)
                    job_url = job.get("url", "")
                    job_match_score = job.get("match_score", 0)
                    break
                # Also check if company matches
                if matched_company and matched_company.lower() in job.get("company", "").lower():
                    job_index = idx
                    job_title = job.get("title", matched_title)
                    company = job.get("company", company)
                    job_url = job.get("url", "")
                    job_match_score = job.get("match_score", 0)
                    break

    return {
        "action": "apply",
        "job_title": job_title,
        "company": company,
        "job_url": job_url,
        "job_index": job_index,
        "match_score": job_match_score,
        "session_id": session_id,
        "steps": [
            {"agent": "Browser Agent",   "task": f"Navigate to job posting: {job_url or 'URL not available'}",        "time": "~5s"},
            {"agent": "Browser Agent",   "task": "Locate and click the Apply / Easy Apply button",         "time": "~5s"},
            {"agent": "Form Filler",     "task": "Fill in personal info, upload resume, write cover letter","time": "~30s"},
            {"agent": "Submit Agent",    "task": "Click Submit / Finish and confirm application",          "time": "~10s"},
            {"agent": "Notifier",        "task": "Log application and send email confirmation",             "time": "~2s"},
        ],
        "estimated_time": "~1 min",
        "risk": "Medium — CAPTCHA may require manual solve",
    }


# ── Apply Endpoint (SSE) ──────────────────────────────────────────────────────────

@app.get("/api/apply/{session_id}/{job_index}")
async def apply_to_job_stream(session_id: str, job_index: int):
    """
    SSE stream: launches Playwright to apply to the job at job_index
    in the given session's matched_jobs list.
    """
    session = _load_session(session_id)
    if not session:
        raise HTTPException(404, "Session not found. Upload a resume first.")

    result = session.get("result")
    if not result:
        raise HTTPException(400, "Pipeline has not completed yet for this session.")

    matched_jobs = result.get("matched_jobs", [])
    if job_index < 0 or job_index >= len(matched_jobs):
        raise HTTPException(400, f"job_index {job_index} is out of range (0-{len(matched_jobs)-1}).")

    job = matched_jobs[job_index]
    job_url = job.get("url", "")
    job_title = job.get("title", "Unknown Role")
    company = job.get("company", "Unknown Company")

    if not job_url:
        raise HTTPException(400, "This job does not have a URL — cannot auto-apply.")

    # Pass the resume-parsed profile so form fields are auto-filled from the CV
    resume_profile = session.get("profile") or result.get("profile") or {}

    return StreamingResponse(
        stream_apply(job_url, job_title, company, profile=resume_profile),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ── Login Session Endpoints ────────────────────────────────────────────────────

@app.get("/api/login/sites")
def list_login_sites():
    """Return the list of supported job sites and current session status."""
    return {
        "sites": [
            {"id": k, "name": k.title(), "url": v}
            for k, v in LOGIN_URLS.items()
        ],
        "has_session": has_saved_session(),
        "login_active": is_login_active(),
        "chrome_info": get_chrome_info(),
    }


@app.get("/api/login/status")
def login_status():
    """Check if a saved login session exists and if a login browser is currently open."""
    return {
        "has_session": has_saved_session(),
        "login_active": is_login_active(),
        "saved_sites": get_saved_sites(),
        "chrome_debug_active": is_chrome_running_with_debug(),
    }


@app.get("/api/login/chrome-info")
def chrome_info():
    """Return detailed info about Chrome installation and debugging status."""
    return get_chrome_info()


class LoginRequest(BaseModel):
    site: str = "indeed"
    timeout_minutes: int = 5


@app.post("/api/login/start")
async def start_login_session(req: LoginRequest):
    """
    SSE stream: Opens the user's REAL Chrome so they can log in to a job site.
    Uses Chrome DevTools Protocol — zero bot detection.
    """
    if is_login_active():
        raise HTTPException(409, "A login browser session is already open. Close it first.")

    return StreamingResponse(
        stream_login_session(site=req.site, timeout_minutes=req.timeout_minutes),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/api/login/launch-chrome")
def launch_chrome():
    """Manually launch Chrome with remote debugging enabled."""
    success, message = launch_chrome_with_debugging()
    if success:
        return {"status": "ok", "message": message}
    raise HTTPException(400, message)


@app.post("/api/login/stop-chrome")
def stop_chrome():
    """Stop the Chrome debugging process we launched."""
    success, message = stop_chrome_debugging()
    if success:
        return {"status": "ok", "message": message}
    raise HTTPException(400, message)


@app.post("/api/login/clear")
def clear_login_session():
    """
    Note: With real Chrome, clearing means the user should clear cookies
    in Chrome itself (Ctrl+Shift+Delete). We cannot delete their real profile.
    """
    return {
        "status": "info",
        "message": (
            "Since we use your real Chrome browser, please clear cookies directly "
            "in Chrome: press Ctrl+Shift+Delete and select 'Cookies and other site data'."
        ),
    }


# ── Helpers ─────────────────────────────────────────────────────────────────────

def _sse_event(event_type: str, data: dict) -> str:
    """Format an SSE event string."""
    json_data = json.dumps(data, default=str)
    return f"event: {event_type}\ndata: {json_data}\n\n"


# ── Main ────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("  CareerOS Backend")
    print(f"  Demo Mode: {config.DEMO_MODE}")
    print(f"  LangSmith: {config.LANGCHAIN_TRACING_V2}")
    print("=" * 50)
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
