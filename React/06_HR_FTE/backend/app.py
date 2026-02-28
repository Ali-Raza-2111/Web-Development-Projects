"""
CareerOS Backend — FastAPI application.

Endpoints:
  POST /api/upload          — Upload resume, get session_id + parsed profile
  GET  /api/pipeline/{id}   — SSE stream: runs the full pipeline with real-time events
  GET  /api/status/{id}     — Get final pipeline results (poll-based alternative)
  GET  /health              — Health check
"""
from __future__ import annotations

import asyncio
import json
import os
import time
import uuid
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

import config
from graph import pipeline, PipelineState


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

# In-memory session store (use Redis/DB in production)
sessions: dict[str, dict] = {}


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

    # Store session
    sessions[session_id] = {
        "file_path": str(file_path),
        "profile": {k: v for k, v in profile.items() if k != "raw_text"},
        "status": "uploaded",
        "result": None,
    }

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
    session = sessions.get(session_id)
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

            # Save to session
            sessions[session_id]["result"] = result
            sessions[session_id]["status"] = "completed"

            yield _sse_event("pipeline_complete", result)

        except Exception as e:
            yield _sse_event("pipeline_error", {"error": str(e)})
            sessions[session_id]["status"] = "error"

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
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    return {
        "session_id": session_id,
        "status": session["status"],
        "profile": session.get("profile"),
        "result": session.get("result"),
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
