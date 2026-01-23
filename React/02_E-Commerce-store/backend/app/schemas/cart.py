from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)
    variant: Optional[dict] = None


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    variant: Optional[dict] = None
    created_at: datetime
    
    # Product info
    product_name: str
    product_image: Optional[str] = None
    product_price: float
    product_stock: int
    
    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: float
    item_count: int


class WishlistItemCreate(BaseModel):
    product_id: int


class WishlistItemResponse(BaseModel):
    id: int
    product_id: int
    created_at: datetime
    
    # Product info
    product_name: str
    product_image: Optional[str] = None
    product_price: float
    product_stock: int
    
    class Config:
        from_attributes = True
