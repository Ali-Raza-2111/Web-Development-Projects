from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class PriorityEnum(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"


class TodoBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    priority: PriorityEnum = PriorityEnum.medium


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    text: Optional[str] = Field(None, min_length=1, max_length=500)
    completed: Optional[bool] = None
    priority: Optional[PriorityEnum] = None


class TodoResponse(TodoBase):
    id: int
    completed: bool
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
