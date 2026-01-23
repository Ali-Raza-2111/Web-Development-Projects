from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship

from ..db.base import Base, TimestampMixin


class Review(Base, TimestampMixin):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    
    # Rating and content
    rating = Column(Integer, nullable=False)  # 1-5
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=True)
    
    # Media
    images = Column(JSON, default=list)
    
    # Verification
    is_verified_purchase = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=True)
    
    # Helpful votes
    helpful_count = Column(Integer, default=0)
    not_helpful_count = Column(Integer, default=0)
    
    # AI-generated summary (placeholder for your AI integration)
    ai_sentiment = Column(String(20), nullable=True)  # positive, negative, neutral
    
    # Seller response
    seller_response = Column(Text, nullable=True)
    seller_responded_at = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="reviews")
    product = relationship("Product", back_populates="reviews")
