"""
Settings API Routes
"""
from fastapi import APIRouter, HTTPException, Depends

from app.models import SettingsRequest, SettingsResponse
from app.api.deps import get_rag_agent
from app.core.agent import RAGAgent

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("", response_model=SettingsResponse)
async def get_settings(
    rag_agent: RAGAgent = Depends(get_rag_agent)
):
    """
    Get current model settings
    """
    return rag_agent.get_settings()


@router.post("")
async def update_settings(
    settings: SettingsRequest,
    rag_agent: RAGAgent = Depends(get_rag_agent)
):
    """
    Update model settings
    """
    try:
        rag_agent.update_settings(
            model=settings.model,
            temperature=settings.temperature
        )
        return {"message": "Settings updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
