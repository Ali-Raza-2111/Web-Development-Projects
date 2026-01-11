from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, date

from ..database import get_db
from ..models.todo import Todo
from ..models.daily_stats import DailyStats
from ..schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from ..services.streak_service import update_streak_on_complete

router = APIRouter()


@router.get("/", response_model=List[TodoResponse])
def get_todos(
    skip: int = 0,
    limit: int = 100,
    completed: bool = None,
    priority: str = None,
    db: Session = Depends(get_db)
):
    """Get all todos with optional filtering"""
    query = db.query(Todo)
    
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    
    if priority:
        query = query.filter(Todo.priority == priority)
    
    return query.order_by(Todo.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    """Create a new todo"""
    db_todo = Todo(
        text=todo.text,
        priority=todo.priority.value
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    
    # Update daily stats for created tasks
    today = date.today()
    daily_stat = db.query(DailyStats).filter(DailyStats.date == today).first()
    if daily_stat:
        daily_stat.tasks_created += 1
    else:
        daily_stat = DailyStats(date=today, tasks_created=1, tasks_completed=0)
        db.add(daily_stat)
    db.commit()
    
    return db_todo


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    """Get a specific todo by ID"""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    return todo


@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo_update: TodoUpdate, db: Session = Depends(get_db)):
    """Update a todo"""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    
    update_data = todo_update.model_dump(exclude_unset=True)
    
    # Handle completion status change
    if "completed" in update_data:
        if update_data["completed"] and not todo.completed:
            # Task being completed
            update_data["completed_at"] = datetime.now()
            update_streak_on_complete(db, completing=True)
        elif not update_data["completed"] and todo.completed:
            # Task being uncompleted
            update_data["completed_at"] = None
            update_streak_on_complete(db, completing=False)
    
    if "priority" in update_data and update_data["priority"]:
        update_data["priority"] = update_data["priority"].value
    
    for key, value in update_data.items():
        setattr(todo, key, value)
    
    db.commit()
    db.refresh(todo)
    return todo


@router.patch("/{todo_id}/toggle", response_model=TodoResponse)
def toggle_todo(todo_id: int, db: Session = Depends(get_db)):
    """Toggle todo completion status"""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    
    todo.completed = not todo.completed
    if todo.completed:
        todo.completed_at = datetime.now()
        update_streak_on_complete(db, completing=True)
    else:
        todo.completed_at = None
        update_streak_on_complete(db, completing=False)
    
    db.commit()
    db.refresh(todo)
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """Delete a todo"""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    
    db.delete(todo)
    db.commit()
    return None


@router.delete("/completed/clear", status_code=status.HTTP_204_NO_CONTENT)
def clear_completed(db: Session = Depends(get_db)):
    """Delete all completed todos"""
    db.query(Todo).filter(Todo.completed == True).delete()
    db.commit()
    return None
