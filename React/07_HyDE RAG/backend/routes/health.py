"""
GET /health – lightweight status probe.
"""

from fastapi import APIRouter

from services.state import app_state

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "documents_loaded": len(app_state.all_documents),
        "files_uploaded": len(app_state.uploaded_file_names),
        "rag_initialized": app_state.rag_manager is not None,
    }
