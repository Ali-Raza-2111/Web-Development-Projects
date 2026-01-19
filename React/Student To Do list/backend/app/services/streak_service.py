from sqlalchemy.orm import Session
from datetime import date, timedelta
from ..models.daily_stats import DailyStats
from ..models.user_settings import UserSettings


def get_or_create_settings(db: Session) -> UserSettings:
    """Get settings or create default ones"""
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def update_streak_on_complete(db: Session, completing: bool = True):
    """Update streak and daily stats when a task is completed/uncompleted"""
    today = date.today()
    
    # Update daily stats
    daily_stat = db.query(DailyStats).filter(DailyStats.date == today).first()
    
    if completing:
        if daily_stat:
            daily_stat.tasks_completed += 1
        else:
            daily_stat = DailyStats(date=today, tasks_completed=1, tasks_created=0)
            db.add(daily_stat)
    else:
        if daily_stat and daily_stat.tasks_completed > 0:
            daily_stat.tasks_completed -= 1
    
    db.commit()
    
    # Recalculate streak
    calculate_streak(db)


def calculate_streak(db: Session):
    """Calculate current streak from daily stats"""
    settings = get_or_create_settings(db)
    
    today = date.today()
    current_streak = 0
    check_date = today
    
    while True:
        daily_stat = db.query(DailyStats).filter(DailyStats.date == check_date).first()
        
        if daily_stat and daily_stat.tasks_completed > 0:
            current_streak += 1
            check_date = check_date - timedelta(days=1)
        else:
            # If it's today and no tasks yet, check yesterday
            if check_date == today:
                check_date = check_date - timedelta(days=1)
                continue
            break
    
    settings.current_streak = current_streak
    settings.longest_streak = max(settings.longest_streak, current_streak)
    
    db.commit()
