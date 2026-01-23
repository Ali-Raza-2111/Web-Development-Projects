from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from typing import List, Optional
import re

from ..core.dependencies import get_db, get_current_user, get_current_seller, get_optional_user, get_current_admin
from ..core.config import settings
from ..models.user import User
from ..models.product import Product, Category, product_categories
from ..schemas.product import (
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse,
    CategoryCreate, CategoryUpdate, CategoryResponse, ProductFilters
)


router = APIRouter(prefix="/products", tags=["Products"])


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text


# Category endpoints
@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(
    include_inactive: bool = False,
    db: Session = Depends(get_db)
):
    """Get all categories."""
    query = db.query(Category)
    if not include_inactive:
        query = query.filter(Category.is_active == True)
    return query.all()


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new category (admin only)."""
    # Check if name already exists
    existing = db.query(Category).filter(Category.name == category_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )
    
    category = Category(
        **category_data.model_dump(),
        slug=slugify(category_data.name)
    )
    
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return category


@router.put("/categories/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a category (admin only)."""
    category = db.query(Category).filter(Category.id == category_id).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    for field, value in category_data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    
    if category_data.name:
        category.slug = slugify(category_data.name)
    
    db.commit()
    db.refresh(category)
    
    return category


# Product endpoints
@router.get("/", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE),
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    in_stock: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db)
):
    """Get products with filtering and pagination."""
    query = db.query(Product).filter(Product.is_active == True)
    
    # Apply filters
    if category:
        query = query.join(Product.categories).filter(Category.slug == category)
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    if in_stock is not None:
        if in_stock:
            query = query.filter(Product.stock > 0)
        else:
            query = query.filter(Product.stock == 0)
    
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    
    if search:
        search_filter = or_(
            Product.name.ilike(f"%{search}%"),
            Product.description.ilike(f"%{search}%"),
            Product.short_description.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    # Get total count
    total = query.count()
    
    # Apply sorting
    sort_column = getattr(Product, sort_by, Product.created_at)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    # Apply pagination
    offset = (page - 1) * page_size
    products = query.options(joinedload(Product.categories)).offset(offset).limit(page_size).all()
    
    return ProductListResponse(
        items=products,
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size
    )


@router.get("/featured", response_model=List[ProductResponse])
async def get_featured_products(
    limit: int = 8,
    db: Session = Depends(get_db)
):
    """Get featured products."""
    products = db.query(Product).filter(
        Product.is_active == True,
        Product.is_featured == True
    ).options(joinedload(Product.categories)).limit(limit).all()
    
    return products


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Get a product by ID."""
    product = db.query(Product).options(
        joinedload(Product.categories)
    ).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product


@router.get("/slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """Get a product by slug."""
    product = db.query(Product).options(
        joinedload(Product.categories)
    ).filter(Product.slug == slug).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Create a new product (seller/admin only)."""
    # Generate unique slug
    base_slug = slugify(product_data.name)
    slug = base_slug
    counter = 1
    while db.query(Product).filter(Product.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    # Extract category IDs and create product
    category_ids = product_data.category_ids
    product_dict = product_data.model_dump(exclude={"category_ids"})
    
    product = Product(
        **product_dict,
        seller_id=current_user.id,
        slug=slug,
        thumbnail=product_data.images[0] if product_data.images else None
    )
    
    # Add categories
    if category_ids:
        categories = db.query(Category).filter(Category.id.in_(category_ids)).all()
        product.categories = categories
    
    db.add(product)
    db.commit()
    db.refresh(product)
    
    return product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Update a product (owner/admin only)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check ownership
    if product.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this product"
        )
    
    # Update fields
    update_data = product_data.model_dump(exclude_unset=True, exclude={"category_ids"})
    for field, value in update_data.items():
        setattr(product, field, value)
    
    # Update slug if name changed
    if product_data.name:
        product.slug = slugify(product_data.name)
    
    # Update categories if provided
    if product_data.category_ids is not None:
        categories = db.query(Category).filter(Category.id.in_(product_data.category_ids)).all()
        product.categories = categories
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Delete a product (owner/admin only)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check ownership
    if product.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this product"
        )
    
    db.delete(product)
    db.commit()


# Seller product management
@router.get("/seller/my-products", response_model=ProductListResponse)
async def get_my_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE),
    current_user: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get current seller's products."""
    query = db.query(Product).filter(Product.seller_id == current_user.id)
    
    total = query.count()
    offset = (page - 1) * page_size
    products = query.options(joinedload(Product.categories)).offset(offset).limit(page_size).all()
    
    return ProductListResponse(
        items=products,
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size
    )
