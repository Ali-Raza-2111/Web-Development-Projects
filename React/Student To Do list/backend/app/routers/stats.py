from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import date, timedelta

from ..database import get_db
from ..models.todo import Todo
from ..models.daily_stats import DailyStats
from ..models.user_settings import UserSettings
from ..schemas.daily_stats import (
    DailyStatsResponse, 
    OverallStatsResponse, 
    StreakDataResponse
)

router = APIRouter()


@router.get("/", response_model=OverallStatsResponse)
def get_overall_stats(db: Session = Depends(get_db)):
    """Get overall statistics"""
    total_tasks = db.query(Todo).count()
    completed_tasks = db.query(Todo).filter(Todo.completed == True).count()
    pending_tasks = total_tasks - completed_tasks
    
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    # Get streak info from settings
    settings = db.query(UserSettings).first()
    current_streak = settings.current_streak if settings else 0
    longest_streak = settings.longest_streak if settings else 0
    
    # Tasks today
    today = date.today()
    today_stat = db.query(DailyStats).filter(DailyStats.date == today).first()
    tasks_today = today_stat.tasks_completed if today_stat else 0
    
    # Tasks this week
    week_start = today - timedelta(days=today.weekday())
    tasks_this_week = db.query(func.sum(DailyStats.tasks_completed)).filter(
        DailyStats.date >= week_start
    ).scalar() or 0
    
    return OverallStatsResponse(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        completion_rate=round(completion_rate, 1),
        current_streak=current_streak,
        longest_streak=longest_streak,
        tasks_today=tasks_today,
        tasks_this_week=tasks_this_week
    )


@router.get("/weekly", response_model=List[DailyStatsResponse])
def get_weekly_stats(db: Session = Depends(get_db)):
    """Get stats for the last 7 days"""
    today = date.today()
    week_ago = today - timedelta(days=6)
    
    # Get existing stats
    existing_stats = db.query(DailyStats).filter(
        DailyStats.date >= week_ago,
        DailyStats.date <= today
    ).all()
    
    # Create a dict for easy lookup
    stats_dict = {stat.date: stat for stat in existing_stats}
    
    # Fill in missing days with zeros
    result = []
    for i in range(7):
        day = week_ago + timedelta(days=i)
        if day in stats_dict:
            result.append(stats_dict[day])
        else:
            result.append(DailyStatsResponse(
                date=day,
                tasks_completed=0,
                tasks_created=0
            ))
    
    return result


@router.get("/monthly", response_model=List[DailyStatsResponse])
def get_monthly_stats(db: Session = Depends(get_db)):
    """Get stats for the last 30 days"""
    today = date.today()
    month_ago = today - timedelta(days=29)
    
    existing_stats = db.query(DailyStats).filter(
        DailyStats.date >= month_ago,
        DailyStats.date <= today
    ).all()
    
    stats_dict = {stat.date: stat for stat in existing_stats}
    
    result = []
    for i in range(30):
        day = month_ago + timedelta(days=i)
        if day in stats_dict:
            result.append(stats_dict[day])
        else:
            result.append(DailyStatsResponse(
                date=day,
                tasks_completed=0,
                tasks_created=0
            ))
    
    return result


@router.get("/streaks", response_model=List[StreakDataResponse])
def get_streak_data(db: Session = Depends(get_db)):
    """Get streak calendar data for the last 365 days (GitHub-style)"""
    today = date.today()
    year_ago = today - timedelta(days=364)
    
    existing_stats = db.query(DailyStats).filter(
        DailyStats.date >= year_ago,
        DailyStats.date <= today
    ).all()
    
    stats_dict = {stat.date: stat.tasks_completed for stat in existing_stats}
    
    result = []
    for i in range(365):
        day = year_ago + timedelta(days=i)
        count = stats_dict.get(day, 0)
        
        # Calculate intensity level (0-4)
        if count == 0:
            level = 0
        elif count <= 2:
            level = 1
        elif count <= 4:
            level = 2
        elif count <= 6:
            level = 3
        else:
            level = 4
        
        result.append(StreakDataResponse(
            date=day.isoformat(),
            count=count,
            level=level
        ))
    
    return result


@router.get("/priority-distribution")
def get_priority_distribution(db: Session = Depends(get_db)):
    """Get distribution of tasks by priority"""
    high = db.query(Todo).filter(Todo.priority == "high").count()
    medium = db.query(Todo).filter(Todo.priority == "medium").count()
    low = db.query(Todo).filter(Todo.priority == "low").count()
    
    return [
        {"name": "High", "value": high, "color": "#ef4444"},
        {"name": "Medium", "value": medium, "color": "#f59e0b"},
        {"name": "Low", "value": low, "color": "#22c55e"}
    ]
