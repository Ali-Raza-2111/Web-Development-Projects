from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user_settings import UserSettings
from ..schemas.user_settings import UserSettingsResponse, UserSettingsUpdate

router = APIRouter()


def get_or_create_settings(db: Session) -> UserSettings:
    """Get settings or create default ones"""
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("/", response_model=UserSettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    """Get user settings"""
    return get_or_create_settings(db)


@router.put("/", response_model=UserSettingsResponse)
def update_settings(settings_update: UserSettingsUpdate, db: Session = Depends(get_db)):
    """Update user settings"""
    settings = get_or_create_settings(db)
    
    update_data = settings_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(settings, key, value)
    
    db.commit()
    db.refresh(settings)
    return settings


@router.post("/reset", response_model=UserSettingsResponse)
def reset_settings(db: Session = Depends(get_db)):
    """Reset settings to defaults"""
    settings = get_or_create_settings(db)
    
    settings.work_duration = 25
    settings.short_break = 5
    settings.long_break = 15
    settings.sessions_before_long_break = 4
    settings.theme = "dark"
    
    db.commit()
    db.refresh(settings)
    return settings
