"""
LLM utilities — wraps OpenRouter (or mocks) for role detection, matching, and writing.
Uses LangChain for LangSmith observability.
"""
import json
import config


def _get_llm():
    """Get a LangChain ChatOpenAI instance pointed at OpenRouter."""
    from langchain_openai import ChatOpenAI

    return ChatOpenAI(
        model=config.LLM_MODEL,
        openai_api_key=config.OPENROUTER_API_KEY,
        openai_api_base="https://openrouter.ai/api/v1",
        temperature=0.3,
    )


def detect_role_from_resume(resume_text: str, skills: list[str]) -> dict:
    """
    Use LLM to detect the best-fit job role(s) from a resume.
    Returns: { "primary_role": str, "secondary_roles": list, "seniority": str, "preferred_location": str }
    """
    if config.DEMO_MODE or not config.OPENROUTER_API_KEY:
        # Smart mock based on skills
        role_map = {
            "python": "Python Developer",
            "react": "Frontend Developer",
            "javascript": "Full Stack Developer",
            "typescript": "Full Stack Developer",
            "flutter": "Flutter Developer",
            "dart": "Flutter Developer",
            "machine learning": "ML Engineer",
            "deep learning": "ML Engineer",
            "tensorflow": "ML Engineer",
            "pytorch": "ML Engineer",
            "docker": "DevOps Engineer",
            "kubernetes": "DevOps Engineer",
            "aws": "Cloud Engineer",
            "django": "Python Backend Developer",
            "fastapi": "Python Backend Developer",
            "node.js": "Backend Developer",
            "java": "Java Developer",
            "go": "Go Developer",
            "rust": "Systems Engineer",
        }
        detected = "Software Developer"
        for skill in skills:
            if skill.lower() in role_map:
                detected = role_map[skill.lower()]
                break

        return {
            "primary_role": detected,
            "secondary_roles": ["Software Engineer", "Backend Developer"],
            "seniority": "Mid-Senior",
            "preferred_location": "Remote",
        }

    llm = _get_llm()
    prompt = f"""Analyze this resume and determine the best-fit job role.

RESUME TEXT (first 3000 chars):
{resume_text[:3000]}

DETECTED SKILLS: {', '.join(skills)}

Return ONLY valid JSON (no markdown, no code blocks):
{{
    "primary_role": "the single best job title to search for",
    "secondary_roles": ["2-3 alternative job titles"],
    "seniority": "Junior/Mid/Senior/Lead",
    "preferred_location": "location if mentioned, else Remote"
}}"""

    response = llm.invoke(prompt)
    text = response.content.strip()
    # Try to parse JSON from the response
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code blocks
        import re
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {
            "primary_role": "Software Developer",
            "secondary_roles": [],
            "seniority": "Mid",
            "preferred_location": "Remote",
        }


def calculate_match_score(profile: dict, job_description: str) -> int:
    """
    Calculate match score (0-100) between profile and job description.
    """
    if config.DEMO_MODE or not config.OPENROUTER_API_KEY:
        # Simple keyword matching for demo
        skills = profile.get("skills", [])
        if not skills:
            return 50
        desc_lower = job_description.lower()
        matches = sum(1 for s in skills if s.lower() in desc_lower)
        score = min(int((matches / max(len(skills), 1)) * 100), 100)
        # Add some variance
        import random
        score = max(20, min(98, score + random.randint(-10, 15)))
        return score

    llm = _get_llm()
    prompt = f"""Evaluate the match between this user profile and job description.
Return ONLY a single integer between 0 and 100.

JOB DESCRIPTION:
{job_description[:2000]}

USER SKILLS: {', '.join(profile.get('skills', []))}
USER ROLE: {profile.get('detected_role', 'Unknown')}"""

    response = llm.invoke(prompt)
    text = response.content.strip()
    try:
        return int("".join(filter(str.isdigit, text)))
    except ValueError:
        return 50


def generate_cover_letter(profile: dict, job: dict) -> str:
    """Generate a tailored cover letter."""
    if config.DEMO_MODE or not config.OPENROUTER_API_KEY:
        name = profile.get("name", "Candidate")
        role = job.get("title", "the position")
        company = job.get("company", "your company")
        skills = ", ".join(profile.get("skills", [])[:5])
        return f"""Dear Hiring Manager,

I am writing to express my strong interest in the {role} position at {company}. With my background in {skills}, I am confident in my ability to contribute meaningfully to your team.

My experience aligns well with the requirements outlined in the job description, and I am excited about the opportunity to bring my skills to {company}.

I look forward to discussing how I can contribute to your team's success.

Best regards,
{name}"""

    llm = _get_llm()
    prompt = f"""Write a professional cover letter (under 250 words) for this job:

JOB: {job.get('title')} at {job.get('company')}
DESCRIPTION: {job.get('description', '')[:1500]}
CANDIDATE SKILLS: {', '.join(profile.get('skills', []))}
CANDIDATE NAME: {profile.get('name', 'Candidate')}

Write a concise, professional cover letter. No placeholders."""

    response = llm.invoke(prompt)
    return response.content.strip()
