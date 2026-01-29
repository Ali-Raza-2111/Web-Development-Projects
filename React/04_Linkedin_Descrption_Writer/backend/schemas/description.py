from pydantic import BaseModel
from typing import Optional

class GenerateRequest(BaseModel):
    description: str
    tone: str
    audience: str
    length: str
    # Optional fields from requirements
    include_keywords: bool = False
    achievement_focused: bool = False

class GenerateResponse(BaseModel):
    generated_text: str

class RefineRequest(BaseModel):
    original_description: str
    current_text: str
    instruction: str

class RefineResponse(BaseModel):
    refined_text: str
