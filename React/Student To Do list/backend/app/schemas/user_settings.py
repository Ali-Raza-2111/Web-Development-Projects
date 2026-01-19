from pydantic import BaseModel, Field
from typing import Optional


class UserSettingsBase(BaseModel):
    work_duration: int = Field(default=25, ge=1, le=120)
    short_break: int = Field(default=5, ge=1, le=60)
    long_break: int = Field(default=15, ge=1, le=120)
    sessions_before_long_break: int = Field(default=4, ge=1, le=10)
    theme: str = Field(default="dark", pattern="^(dark|light)$")


class UserSettingsCreate(UserSettingsBase):
    pass


class UserSettingsUpdate(BaseModel):
    work_duration: Optional[int] = Field(None, ge=1, le=120)
    short_break: Optional[int] = Field(None, ge=1, le=60)
    long_break: Optional[int] = Field(None, ge=1, le=120)
    sessions_before_long_break: Optional[int] = Field(None, ge=1, le=10)
    theme: Optional[str] = Field(None, pattern="^(dark|light)$")


class UserSettingsResponse(UserSettingsBase):
    id: int
    current_streak: int
    longest_streak: int

    class Config:
        from_attributes = True
