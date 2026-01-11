from sqlalchemy import Column, Integer, Date
from sqlalchemy.sql import func
from ..database import Base


class DailyStats(Base):
    __tablename__ = "daily_stats"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date = Column(Date, unique=True, nullable=False, index=True)
    tasks_completed = Column(Integer, default=0)
    tasks_created = Column(Integer, default=0)

    def __repr__(self):
        return f"<DailyStats(date={self.date}, completed={self.tasks_completed})>"
