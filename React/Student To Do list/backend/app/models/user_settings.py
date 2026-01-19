from sqlalchemy import Column, Integer, String
from ..database import Base


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    work_duration = Column(Integer, default=25)  # minutes
    short_break = Column(Integer, default=5)  # minutes
    long_break = Column(Integer, default=15)  # minutes
    sessions_before_long_break = Column(Integer, default=4)
    theme = Column(String(10), default="dark")
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)

    def __repr__(self):
        return f"<UserSettings(theme={self.theme}, work={self.work_duration}min)>"
