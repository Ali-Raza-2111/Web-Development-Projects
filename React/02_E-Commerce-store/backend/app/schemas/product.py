from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


# Category schemas
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    image: Optional[str] = None


class CategoryCreate(CategoryBase):
    parent_id: Optional[int] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    id: int
    slug: str
    is_active: bool
    parent_id: Optional[int] = None
    
    class Config:
        from_attributes = True


# Product schemas
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str
    short_description: Optional[str] = None
    price: float = Field(..., gt=0)
    compare_at_price: Optional[float] = None
    stock: int = Field(default=0, ge=0)


class ProductCreate(ProductBase):
    sku: Optional[str] = None
    barcode: Optional[str] = None
    images: List[str] = []
    thumbnail: Optional[str] = None
    variants: List[dict] = []
    category_ids: List[int] = []
    is_featured: bool = False


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    compare_at_price: Optional[float] = None
    stock: Optional[int] = Field(None, ge=0)
    sku: Optional[str] = None
    barcode: Optional[str] = None
    images: Optional[List[str]] = None
    thumbnail: Optional[str] = None
    variants: Optional[List[dict]] = None
    category_ids: Optional[List[int]] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    seller_id: int
    slug: str
    sku: Optional[str] = None
    images: List[str] = []
    thumbnail: Optional[str] = None
    variants: List[dict] = []
    is_active: bool
    is_featured: bool
    average_rating: float
    review_count: int
    discount_percentage: float
    created_at: datetime
    categories: List[CategoryResponse] = []
    
    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    page_size: int
    pages: int


# Filters
class ProductFilters(BaseModel):
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_rating: Optional[float] = None
    in_stock: Optional[bool] = None
    is_featured: Optional[bool] = None
    search: Optional[str] = None
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = "desc"
