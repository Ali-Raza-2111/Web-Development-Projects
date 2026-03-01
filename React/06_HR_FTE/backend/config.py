"""
Configuration for the CareerOS Backend.
Reads from environment variables or .env file.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
load_dotenv(Path(__file__).resolve().parent / ".env")

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Upload directory
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Session directory — file-based persistence (survives server restarts)
SESSION_DIR = BASE_DIR / "sessions"
SESSION_DIR.mkdir(exist_ok=True)

# Session TTL in hours (sessions older than this are cleaned up)
SESSION_TTL_HOURS = int(os.getenv("SESSION_TTL_HOURS", "24"))

# --- Mode ---
# Set DEMO_MODE=true to run with mock data (no API keys needed)
DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"

# --- LLM Provider ---
# Supported: "groq", "openrouter" (any OpenAI-compatible API)
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq").lower()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")


def get_llm_settings() -> tuple[str, str, str]:
    """Return (api_key, base_url, model) for the active LLM provider."""
    if LLM_PROVIDER == "groq":
        return GROQ_API_KEY, "https://api.groq.com/openai/v1", LLM_MODEL
    # default: openrouter
    return OPENROUTER_API_KEY, "https://openrouter.ai/api/v1", LLM_MODEL


def has_llm_key() -> bool:
    """Check whether an API key is configured for the active provider."""
    key, _, _ = get_llm_settings()
    return bool(key)

# --- Job Search (JSearch / RapidAPI) ---
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")

# --- LangSmith Observability ---
# Set these to enable tracing in LangSmith dashboard
LANGCHAIN_TRACING_V2 = os.getenv("LANGCHAIN_TRACING_V2", "false")
LANGCHAIN_API_KEY = os.getenv("LANGCHAIN_API_KEY", "")
LANGCHAIN_PROJECT = os.getenv("LANGCHAIN_PROJECT", "career-os")

# Apply LangSmith env vars
if LANGCHAIN_TRACING_V2.lower() == "true" and LANGCHAIN_API_KEY:
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
    os.environ["LANGCHAIN_PROJECT"] = LANGCHAIN_PROJECT

# --- CORS ---
FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:5173",
]
