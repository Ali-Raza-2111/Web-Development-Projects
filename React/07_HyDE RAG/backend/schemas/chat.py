"""
Pydantic request / response models for the chat endpoint.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class TraceStep(BaseModel):
    step: int
    label: str
    status: str = "complete"
    duration_s: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []
    trace: List[TraceStep] = []
