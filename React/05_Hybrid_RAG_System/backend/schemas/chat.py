"""
Pydantic request / response models for the chat endpoint.
"""

from typing import List

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []
