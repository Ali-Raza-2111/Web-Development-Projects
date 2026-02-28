"""
LangGraph Pipeline — orchestrates the full job application workflow.

Graph: parse_resume → detect_role → search_jobs → score_matches → generate_applications → END

Each node updates the shared state and emits events for the frontend.
"""
from __future__ import annotations

import time
import uuid
from typing import Any, TypedDict

from langgraph.graph import StateGraph, END

from resume_parser import parse_resume
from job_searcher import search_jobs
from llm_services import detect_role_from_resume, calculate_match_score, generate_cover_letter


# ── Pipeline State ──────────────────────────────────────────────────────────────

class PipelineState(TypedDict, total=False):
    """Shared state flowing through the pipeline."""
    session_id: str
    file_path: str

    # Resume parsing
    raw_text: str
    name: str
    email: str
    phone: str
    skills: list[str]

    # Role detection
    primary_role: str
    secondary_roles: list[str]
    seniority: str
    preferred_location: str

    # Job search
    jobs: list[dict]

    # Matching
    matched_jobs: list[dict]  # jobs with scores

    # Applications
    applications: list[dict]  # jobs with cover letters

    # Pipeline tracking
    current_step: str
    logs: list[dict]
    error: str | None


# ── Pipeline Nodes ──────────────────────────────────────────────────────────────

def node_parse_resume(state: PipelineState) -> dict:
    """Node 1: Parse the uploaded resume."""
    start = time.time()
    try:
        profile = parse_resume(state["file_path"])
        elapsed = round(time.time() - start, 2)
        return {
            "raw_text": profile["raw_text"],
            "name": profile["name"],
            "email": profile["email"],
            "phone": profile["phone"],
            "skills": profile["skills"],
            "current_step": "parse_resume",
            "logs": state.get("logs", []) + [{
                "agent": "Resume Parser",
                "task": f"Parsed resume: found {len(profile['skills'])} skills",
                "reasoning": f"Extracted name '{profile['name']}', email, phone, and {len(profile['skills'])} technical skills from document",
                "tools": ["PyMuPDF", "python-docx", "Regex extractor"],
                "confidence": 95,
                "nextAction": "Detect best-fit job role",
                "time": f"{elapsed}s",
            }],
        }
    except Exception as e:
        return {
            "error": f"Resume parsing failed: {str(e)}",
            "current_step": "parse_resume",
            "logs": state.get("logs", []) + [{
                "agent": "Resume Parser",
                "task": "Failed to parse resume",
                "reasoning": str(e),
                "tools": ["PyMuPDF", "python-docx"],
                "confidence": 0,
                "nextAction": "Abort pipeline",
                "time": "0s",
            }],
        }


def node_detect_role(state: PipelineState) -> dict:
    """Node 2: Use AI to detect the best-fit job role."""
    if state.get("error"):
        return {}

    start = time.time()
    result = detect_role_from_resume(
        state.get("raw_text", ""),
        state.get("skills", []),
    )
    elapsed = round(time.time() - start, 2)

    return {
        "primary_role": result.get("primary_role", "Software Developer"),
        "secondary_roles": result.get("secondary_roles", []),
        "seniority": result.get("seniority", "Mid"),
        "preferred_location": result.get("preferred_location", "Remote"),
        "current_step": "detect_role",
        "logs": state.get("logs", []) + [{
            "agent": "Role Detector",
            "task": f"Detected role: {result.get('primary_role', 'Unknown')}",
            "reasoning": f"Based on skills ({', '.join(state.get('skills', [])[:5])}), identified {result.get('seniority', 'Mid')}-level {result.get('primary_role', 'role')}",
            "tools": ["LLM Analyzer", "Skill Taxonomy"],
            "confidence": 93,
            "nextAction": f"Search jobs for '{result.get('primary_role', 'Unknown')}'",
            "time": f"{elapsed}s",
        }],
    }


def node_search_jobs(state: PipelineState) -> dict:
    """Node 3: Search for matching jobs."""
    if state.get("error"):
        return {}

    start = time.time()
    role = state.get("primary_role", "Software Developer")
    location = state.get("preferred_location", "Remote")

    jobs = search_jobs(role, location, num_results=8)
    elapsed = round(time.time() - start, 2)

    return {
        "jobs": jobs,
        "current_step": "search_jobs",
        "logs": state.get("logs", []) + [{
            "agent": "Job Intelligence",
            "task": f"Found {len(jobs)} jobs for '{role}'",
            "reasoning": f"Searched across job boards for {role} positions in {location}. Returned top {len(jobs)} results.",
            "tools": ["JSearch API", "Job Board Scraper"],
            "confidence": 90,
            "nextAction": "Score and rank matches",
            "time": f"{elapsed}s",
        }],
    }


def node_score_matches(state: PipelineState) -> dict:
    """Node 4: Score each job against the profile."""
    if state.get("error"):
        return {}

    start = time.time()
    jobs = state.get("jobs", [])
    profile = {
        "name": state.get("name", ""),
        "skills": state.get("skills", []),
        "detected_role": state.get("primary_role", ""),
    }

    matched = []
    for job in jobs:
        score = calculate_match_score(profile, job.get("description", ""))
        matched.append({**job, "match_score": score})

    # Sort by score descending
    matched.sort(key=lambda x: x["match_score"], reverse=True)
    elapsed = round(time.time() - start, 2)

    top_score = matched[0]["match_score"] if matched else 0
    avg_score = round(sum(j["match_score"] for j in matched) / max(len(matched), 1))

    return {
        "matched_jobs": matched,
        "current_step": "score_matches",
        "logs": state.get("logs", []) + [{
            "agent": "Matching Engine",
            "task": f"Scored {len(matched)} jobs (top: {top_score}%, avg: {avg_score}%)",
            "reasoning": f"Applied AI matching against profile skills. Best match: {matched[0]['title'] if matched else 'N/A'} at {top_score}%",
            "tools": ["LLM Scorer", "ATS Simulator", "Keyword Analyzer"],
            "confidence": 91,
            "nextAction": "Generate tailored applications for top matches",
            "time": f"{elapsed}s",
        }],
    }


def node_generate_applications(state: PipelineState) -> dict:
    """Node 5: Generate cover letters for top-matched jobs."""
    if state.get("error"):
        return {}

    start = time.time()
    matched = state.get("matched_jobs", [])
    profile = {
        "name": state.get("name", ""),
        "email": state.get("email", ""),
        "skills": state.get("skills", []),
    }

    # Generate cover letters for top 3 matches
    applications = []
    for job in matched[:3]:
        cover_letter = generate_cover_letter(profile, job)
        applications.append({
            **job,
            "cover_letter": cover_letter,
            "status": "ready",
        })

    elapsed = round(time.time() - start, 2)

    return {
        "applications": applications,
        "current_step": "complete",
        "logs": state.get("logs", []) + [{
            "agent": "Application Generator",
            "task": f"Prepared {len(applications)} tailored applications",
            "reasoning": f"Generated custom cover letters for top {len(applications)} matches. Applications are ready for review/submission.",
            "tools": ["LLM Writer", "Cover Letter Template", "Tone Analyzer"],
            "confidence": 88,
            "nextAction": "Applications ready — awaiting user review",
            "time": f"{elapsed}s",
        }],
    }


# ── Conditional Edge ────────────────────────────────────────────────────────────

def should_continue(state: PipelineState) -> str:
    """If there's an error, stop the pipeline."""
    if state.get("error"):
        return END
    return "continue"


# ── Build Graph ─────────────────────────────────────────────────────────────────

def build_pipeline() -> Any:
    """Build and compile the LangGraph pipeline."""
    workflow = StateGraph(PipelineState)

    # Add nodes
    workflow.add_node("parse_resume", node_parse_resume)
    workflow.add_node("detect_role", node_detect_role)
    workflow.add_node("search_jobs", node_search_jobs)
    workflow.add_node("score_matches", node_score_matches)
    workflow.add_node("generate_applications", node_generate_applications)

    # Set entry point
    workflow.set_entry_point("parse_resume")

    # Add edges with error checking after parse
    workflow.add_conditional_edges(
        "parse_resume",
        should_continue,
        {"continue": "detect_role", END: END},
    )
    workflow.add_edge("detect_role", "search_jobs")
    workflow.add_edge("search_jobs", "score_matches")
    workflow.add_edge("score_matches", "generate_applications")
    workflow.add_edge("generate_applications", END)

    return workflow.compile()


# Singleton compiled pipeline
pipeline = build_pipeline()
