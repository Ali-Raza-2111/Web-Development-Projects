"""
Pydantic Models/Schemas for API
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ==================== Source Citation Models ====================

class SourceCitation(BaseModel):
    """Detailed source citation for verification"""
    id: str  # Unique chunk ID
    filename: str  # Original filename
    page: Optional[int] = None  # Page number (for PDFs)
    excerpt: str  # Text excerpt that was used
    relevance_score: float  # How relevant this source was
    highlight_text: str  # Full text for highlighting in viewer


# ==================== Chat Models ====================

class ChatMessage(BaseModel):
    """Single chat message"""
    role: str
    content: str


class ChatRequest(BaseModel):
    """Request body for chat endpoint"""
    messages: List[ChatMessage]
    stream: Optional[bool] = False


class ChatResponse(BaseModel):
    """Response from chat endpoint"""
    id: str
    role: str
    content: str
    sources: Optional[List[SourceCitation]] = None


# ==================== Document Models ====================

class DocumentResponse(BaseModel):
    """Response for document operations"""
    id: str
    filename: str
    status: str
    upload_date: str
    size: int
    type: str


class DocumentDeleteResponse(BaseModel):
    """Response for document deletion"""
    message: str


# ==================== Settings Models ====================

class SettingsRequest(BaseModel):
    """Request body for settings update"""
    model: Optional[str] = None
    temperature: Optional[float] = None


class SettingsResponse(BaseModel):
    """Response from settings endpoint"""
    model: str
    temperature: float
    chroma_path: str
    document_count: int
