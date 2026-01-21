"""
Dependencies for API routes
"""
from functools import lru_cache
from app.core.agent import RAGAgent
from app.config import get_settings


# Singleton instance of RAG Agent
_rag_agent: RAGAgent | None = None


def get_rag_agent() -> RAGAgent:
    """Get or create RAG Agent instance"""
    global _rag_agent
    if _rag_agent is None:
        settings = get_settings()
        _rag_agent = RAGAgent(
            model=settings.DEFAULT_MODEL,
            temperature=settings.DEFAULT_TEMPERATURE,
            chroma_dir=settings.CHROMA_DIR,
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
        )
    return _rag_agent


# Document store (in production, use a database)
documents_store: dict = {}


def get_documents_store() -> dict:
    """Get documents store"""
    return documents_store
