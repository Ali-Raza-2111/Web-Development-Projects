from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
import enum
from ..database import Base


class PriorityEnum(str, enum.Enum):
    high = "high"
    medium = "medium"
    low = "low"


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    text = Column(String(500), nullable=False)
    completed = Column(Boolean, default=False)
    priority = Column(String(10), default="medium")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<Todo(id={self.id}, text='{self.text[:20]}...', completed={self.completed})>"
