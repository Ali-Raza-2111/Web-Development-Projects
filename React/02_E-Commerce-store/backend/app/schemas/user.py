from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = None
    avatar: Optional[str] = None


class SellerUpdate(UserUpdate):
    store_name: Optional[str] = Field(None, max_length=200)
    store_description: Optional[str] = None
    store_logo: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


# Response schemas
class UserResponse(UserBase):
    id: int
    avatar: Optional[str] = None
    phone: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserProfileResponse(UserResponse):
    store_name: Optional[str] = None
    store_description: Optional[str] = None
    store_logo: Optional[str] = None


# Address schemas
class AddressBase(BaseModel):
    label: str = "Home"
    street: str
    city: str
    state: str
    country: str
    zip_code: str


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    label: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip_code: Optional[str] = None
    is_default: Optional[bool] = None


class AddressResponse(AddressBase):
    id: int
    is_default: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
