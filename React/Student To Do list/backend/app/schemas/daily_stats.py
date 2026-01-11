from pydantic import BaseModel
from datetime import date
from typing import List


class DailyStatsResponse(BaseModel):
    date: date
    tasks_completed: int
    tasks_created: int

    class Config:
        from_attributes = True


class WeeklyStatsResponse(BaseModel):
    data: List[DailyStatsResponse]
    total_completed: int
    total_created: int


class StreakDataResponse(BaseModel):
    date: str
    count: int
    level: int  # 0-4 for intensity


class OverallStatsResponse(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    completion_rate: float
    current_streak: int
    longest_streak: int
    tasks_today: int
    tasks_this_week: int
