from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core.dependencies import get_db, get_current_user
from ..models.user import User
from ..models.cart import CartItem, WishlistItem
from ..models.product import Product
from ..schemas.cart import (
    CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse,
    WishlistItemCreate, WishlistItemResponse
)


router = APIRouter(prefix="/cart", tags=["Cart & Wishlist"])


# Cart endpoints
@router.get("/", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's cart."""
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    
    items = []
    subtotal = 0
    
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            item_response = CartItemResponse(
                id=item.id,
                product_id=item.product_id,
                quantity=item.quantity,
                variant=item.variant,
                created_at=item.created_at,
                product_name=product.name,
                product_image=product.thumbnail,
                product_price=product.price,
                product_stock=product.stock
            )
            items.append(item_response)
            subtotal += product.price * item.quantity
    
    return CartResponse(
        items=items,
        subtotal=subtotal,
        item_count=len(items)
    )


@router.post("/items", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add an item to cart."""
    # Check product exists and is active
    product = db.query(Product).filter(
        Product.id == item_data.product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or inactive"
        )
    
    # Check stock
    if product.stock < item_data.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock"
        )
    
    # Check if item already in cart
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == item_data.product_id
    ).first()
    
    if existing_item:
        # Update quantity
        new_quantity = existing_item.quantity + item_data.quantity
        if new_quantity > product.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot add more items than available stock"
            )
        existing_item.quantity = new_quantity
        existing_item.variant = item_data.variant
        db.commit()
        db.refresh(existing_item)
        item = existing_item
    else:
        # Create new cart item
        item = CartItem(
            user_id=current_user.id,
            **item_data.model_dump()
        )
        db.add(item)
        db.commit()
        db.refresh(item)
    
    return CartItemResponse(
        id=item.id,
        product_id=item.product_id,
        quantity=item.quantity,
        variant=item.variant,
        created_at=item.created_at,
        product_name=product.name,
        product_image=product.thumbnail,
        product_price=product.price,
        product_stock=product.stock
    )


@router.put("/items/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update cart item quantity."""
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
    
    product = db.query(Product).filter(Product.id == item.product_id).first()
    
    if item_data.quantity > product.stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add more items than available stock"
        )
    
    item.quantity = item_data.quantity
    db.commit()
    db.refresh(item)
    
    return CartItemResponse(
        id=item.id,
        product_id=item.product_id,
        quantity=item.quantity,
        variant=item.variant,
        created_at=item.created_at,
        product_name=product.name,
        product_image=product.thumbnail,
        product_price=product.price,
        product_stock=product.stock
    )


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove an item from cart."""
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
    
    db.delete(item)
    db.commit()


@router.delete("/clear", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear all items from cart."""
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()


# Wishlist endpoints
@router.get("/wishlist", response_model=List[WishlistItemResponse])
async def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's wishlist."""
    wishlist_items = db.query(WishlistItem).filter(WishlistItem.user_id == current_user.id).all()
    
    items = []
    for item in wishlist_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            item_response = WishlistItemResponse(
                id=item.id,
                product_id=item.product_id,
                created_at=item.created_at,
                product_name=product.name,
                product_image=product.thumbnail,
                product_price=product.price,
                product_stock=product.stock
            )
            items.append(item_response)
    
    return items


@router.post("/wishlist", response_model=WishlistItemResponse, status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    item_data: WishlistItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add an item to wishlist."""
    # Check product exists
    product = db.query(Product).filter(Product.id == item_data.product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if already in wishlist
    existing_item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == item_data.product_id
    ).first()
    
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already in wishlist"
        )
    
    item = WishlistItem(
        user_id=current_user.id,
        product_id=item_data.product_id
    )
    
    db.add(item)
    db.commit()
    db.refresh(item)
    
    return WishlistItemResponse(
        id=item.id,
        product_id=item.product_id,
        created_at=item.created_at,
        product_name=product.name,
        product_image=product.thumbnail,
        product_price=product.price,
        product_stock=product.stock
    )


@router.delete("/wishlist/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_wishlist(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove an item from wishlist."""
    item = db.query(WishlistItem).filter(
        WishlistItem.id == item_id,
        WishlistItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wishlist item not found"
        )
    
    db.delete(item)
    db.commit()


@router.post("/wishlist/{wishlist_id}/move-to-cart", response_model=CartItemResponse)
async def move_wishlist_to_cart(
    wishlist_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Move an item from wishlist to cart."""
    wishlist_item = db.query(WishlistItem).filter(
        WishlistItem.id == wishlist_id,
        WishlistItem.user_id == current_user.id
    ).first()
    
    if not wishlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wishlist item not found"
        )
    
    product = db.query(Product).filter(Product.id == wishlist_item.product_id).first()
    
    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or inactive"
        )
    
    if product.stock < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product is out of stock"
        )
    
    # Add to cart
    cart_item = CartItem(
        user_id=current_user.id,
        product_id=wishlist_item.product_id,
        quantity=1
    )
    
    db.add(cart_item)
    db.delete(wishlist_item)
    db.commit()
    db.refresh(cart_item)
    
    return CartItemResponse(
        id=cart_item.id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
        variant=cart_item.variant,
        created_at=cart_item.created_at,
        product_name=product.name,
        product_image=product.thumbnail,
        product_price=product.price,
        product_stock=product.stock
    )
