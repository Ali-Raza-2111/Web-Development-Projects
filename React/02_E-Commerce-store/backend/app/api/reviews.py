from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from ..core.dependencies import get_db, get_current_user, get_current_seller
from ..core.config import settings
from ..models.user import User
from ..models.review import Review
from ..models.product import Product
from ..models.order import Order, OrderItem
from ..schemas.review import (
    ReviewCreate, ReviewUpdate, ReviewResponse, ReviewListResponse, SellerResponseCreate
)


router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/product/{product_id}", response_model=ReviewListResponse)
async def get_product_reviews(
    product_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE),
    rating: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get reviews for a product."""
    # Check product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    query = db.query(Review).filter(
        Review.product_id == product_id,
        Review.is_approved == True
    )
    
    if rating:
        query = query.filter(Review.rating == rating)
    
    total = query.count()
    
    # Calculate average and distribution
    avg_rating = db.query(func.avg(Review.rating)).filter(
        Review.product_id == product_id,
        Review.is_approved == True
    ).scalar() or 0
    
    distribution = {}
    for i in range(1, 6):
        count = db.query(Review).filter(
            Review.product_id == product_id,
            Review.rating == i,
            Review.is_approved == True
        ).count()
        distribution[str(i)] = count
    
    offset = (page - 1) * page_size
    reviews = query.order_by(Review.created_at.desc()).offset(offset).limit(page_size).all()
    
    # Add user info to reviews
    review_responses = []
    for review in reviews:
        user = db.query(User).filter(User.id == review.user_id).first()
        review_dict = ReviewResponse.model_validate(review)
        review_dict.user_name = user.full_name if user else "Anonymous"
        review_dict.user_avatar = user.avatar if user else None
        review_responses.append(review_dict)
    
    return ReviewListResponse(
        items=review_responses,
        total=total,
        page=page,
        page_size=page_size,
        average_rating=float(avg_rating),
        rating_distribution=distribution
    )


@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a review for a product."""
    # Check product exists
    product = db.query(Product).filter(Product.id == review_data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if user already reviewed this product
    existing_review = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.product_id == review_data.product_id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this product"
        )
    
    # Check if user has purchased this product
    has_purchased = db.query(OrderItem).join(Order).filter(
        Order.user_id == current_user.id,
        OrderItem.product_id == review_data.product_id
    ).first() is not None
    
    review = Review(
        user_id=current_user.id,
        is_verified_purchase=has_purchased,
        **review_data.model_dump()
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    
    # Add user info
    review_response = ReviewResponse.model_validate(review)
    review_response.user_name = current_user.full_name
    review_response.user_avatar = current_user.avatar
    
    return review_response


@router.put("/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: int,
    review_data: ReviewUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a review (owner only)."""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this review"
        )
    
    for field, value in review_data.model_dump(exclude_unset=True).items():
        setattr(review, field, value)
    
    db.commit()
    db.refresh(review)
    
    review_response = ReviewResponse.model_validate(review)
    review_response.user_name = current_user.full_name
    review_response.user_avatar = current_user.avatar
    
    return review_response


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a review (owner or admin only)."""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    if review.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this review"
        )
    
    db.delete(review)
    db.commit()


@router.post("/{review_id}/helpful")
async def mark_review_helpful(
    review_id: int,
    helpful: bool = True,
    db: Session = Depends(get_db)
):
    """Mark a review as helpful or not helpful."""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    if helpful:
        review.helpful_count += 1
    else:
        review.not_helpful_count += 1
    
    db.commit()
    
    return {"message": "Vote recorded"}


@router.post("/{review_id}/response", response_model=ReviewResponse)
async def add_seller_response(
    review_id: int,
    response_data: SellerResponseCreate,
    current_user: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Add a seller response to a review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Check if seller owns the product
    product = db.query(Product).filter(Product.id == review.product_id).first()
    if product.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to respond to this review"
        )
    
    from datetime import datetime
    review.seller_response = response_data.response
    review.seller_responded_at = datetime.utcnow().isoformat()
    
    db.commit()
    db.refresh(review)
    
    user = db.query(User).filter(User.id == review.user_id).first()
    review_response = ReviewResponse.model_validate(review)
    review_response.user_name = user.full_name if user else "Anonymous"
    review_response.user_avatar = user.avatar if user else None
    
    return review_response


# User's reviews
@router.get("/my-reviews", response_model=List[ReviewResponse])
async def get_my_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's reviews."""
    reviews = db.query(Review).filter(Review.user_id == current_user.id).all()
    
    review_responses = []
    for review in reviews:
        review_response = ReviewResponse.model_validate(review)
        review_response.user_name = current_user.full_name
        review_response.user_avatar = current_user.avatar
        review_responses.append(review_response)
    
    return review_responses
