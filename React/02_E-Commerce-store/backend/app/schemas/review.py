from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    images: List[str] = []


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    images: Optional[List[str]] = None


class SellerResponseCreate(BaseModel):
    response: str


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    title: Optional[str] = None
    content: Optional[str] = None
    images: List[str] = []
    is_verified_purchase: bool
    helpful_count: int
    not_helpful_count: int
    ai_sentiment: Optional[str] = None
    seller_response: Optional[str] = None
    seller_responded_at: Optional[str] = None
    created_at: datetime
    
    # User info
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    
    class Config:
        from_attributes = True


class ReviewListResponse(BaseModel):
    items: List[ReviewResponse]
    total: int
    page: int
    page_size: int
    average_rating: float
    rating_distribution: dict  # {1: count, 2: count, ...}
