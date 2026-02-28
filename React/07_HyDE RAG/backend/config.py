"""
Application-wide configuration and constants.
"""

import os

from dotenv import load_dotenv

load_dotenv()

# ── Paths ────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
VECTOR_STORE_DIR = os.path.join(BASE_DIR, "vector_store")

# ── Model settings ───────────────────────────────────────────────────────
GEMINI_MODEL = "gemini-2.5-flash"
EMBEDDING_MODEL = "gemini-embedding-001"
GEMINI_API_KEY = os.getenv("Gemini_APi_Key")

# ── Chunking ─────────────────────────────────────────────────────────────
CHUNK_SIZE = 500
CHUNK_OVERLAP = 100

# ── Retrieval ────────────────────────────────────────────────────────────
DENSE_WEIGHT = 0.7
RETRIEVER_K = 5
RERANK_THRESHOLD = 3  # min score (1-10) to keep a document

# ── CORS origins ─────────────────────────────────────────────────────────
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
