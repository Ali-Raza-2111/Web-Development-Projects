from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)
    variant: Optional[dict] = None


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: dict
    billing_address: Optional[dict] = None
    payment_method: str
    customer_notes: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: str
    admin_notes: Optional[str] = None
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_image: Optional[str] = None
    product_sku: Optional[str] = None
    price: float
    quantity: int
    total: float
    variant: Optional[dict] = None
    
    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: int
    status: str
    payment_status: str
    subtotal: float
    tax: float
    shipping_cost: float
    discount: float
    total: float
    shipping_address: dict
    billing_address: Optional[dict] = None
    payment_method: Optional[str] = None
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    customer_notes: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    page_size: int
    pages: int
