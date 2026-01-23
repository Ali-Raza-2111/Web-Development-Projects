from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core.dependencies import get_db, get_current_user, get_current_admin
from ..core.security import verify_password, get_password_hash
from ..models.user import User, Address
from ..schemas.user import (
    UserResponse, UserProfileResponse, UserUpdate, SellerUpdate, 
    PasswordChange, AddressCreate, AddressUpdate, AddressResponse
)


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    return current_user


@router.put("/me", response_model=UserProfileResponse)
async def update_current_user_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile."""
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.put("/me/seller", response_model=UserProfileResponse)
async def update_seller_profile(
    update_data: SellerUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update seller-specific profile fields."""
    if current_user.role not in ["seller", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seller privileges required"
        )
    
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.post("/me/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change current user's password."""
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    current_user.password_hash = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}


# Address endpoints
@router.get("/me/addresses", response_model=List[AddressResponse])
async def get_user_addresses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's addresses."""
    return db.query(Address).filter(Address.user_id == current_user.id).all()


@router.post("/me/addresses", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
async def create_address(
    address_data: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new address for the current user."""
    # Check if this is the first address (make it default)
    existing_addresses = db.query(Address).filter(Address.user_id == current_user.id).count()
    
    address = Address(
        user_id=current_user.id,
        is_default=existing_addresses == 0,
        **address_data.model_dump()
    )
    
    db.add(address)
    db.commit()
    db.refresh(address)
    
    return address


@router.put("/me/addresses/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: int,
    address_data: AddressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an address."""
    address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    # If setting as default, unset other defaults
    if address_data.is_default:
        db.query(Address).filter(
            Address.user_id == current_user.id,
            Address.id != address_id
        ).update({"is_default": False})
    
    for field, value in address_data.model_dump(exclude_unset=True).items():
        setattr(address, field, value)
    
    db.commit()
    db.refresh(address)
    
    return address


@router.delete("/me/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an address."""
    address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    db.delete(address)
    db.commit()


# Admin endpoints
@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)."""
    return db.query(User).offset(skip).limit(limit).all()


@router.get("/{user_id}", response_model=UserProfileResponse)
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get a user by ID (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/{user_id}/toggle-active", response_model=UserResponse)
async def toggle_user_active(
    user_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Toggle user active status (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    
    return user


@router.put("/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: int,
    role: str,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update user role (admin only)."""
    if role not in ["buyer", "seller", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'buyer', 'seller', or 'admin'"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.role = role
    db.commit()
    db.refresh(user)
    
    return user
