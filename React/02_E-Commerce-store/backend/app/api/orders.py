from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import uuid
from datetime import datetime

from ..core.dependencies import get_db, get_current_user, get_current_seller, get_current_admin
from ..core.config import settings
from ..models.user import User
from ..models.order import Order, OrderItem, OrderStatus, PaymentStatus
from ..models.product import Product
from ..models.cart import CartItem
from ..schemas.order import (
    OrderCreate, OrderResponse, OrderListResponse, OrderStatusUpdate
)


router = APIRouter(prefix="/orders", tags=["Orders"])


def generate_order_number() -> str:
    """Generate a unique order number."""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M")
    unique_id = str(uuid.uuid4())[:8].upper()
    return f"LUXE-{timestamp}-{unique_id}"


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order from cart or direct items."""
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item"
        )
    
    # Calculate totals and validate products
    order_items = []
    subtotal = 0
    
    for item in order_data.items:
        product = db.query(Product).filter(
            Product.id == item.product_id,
            Product.is_active == True
        ).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item.product_id} not found or inactive"
            )
        
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product.name}"
            )
        
        item_total = product.price * item.quantity
        subtotal += item_total
        
        order_items.append(OrderItem(
            product_id=product.id,
            product_name=product.name,
            product_image=product.thumbnail,
            product_sku=product.sku,
            price=product.price,
            quantity=item.quantity,
            total=item_total,
            variant=item.variant
        ))
        
        # Reduce stock
        product.stock -= item.quantity
    
    # Calculate tax and total (simplified - you can add tax logic)
    tax = subtotal * 0.08  # 8% tax
    shipping_cost = 0 if subtotal >= 100 else 10  # Free shipping over $100
    total = subtotal + tax + shipping_cost
    
    # Create order
    order = Order(
        user_id=current_user.id,
        order_number=generate_order_number(),
        status=OrderStatus.PENDING,
        payment_status=PaymentStatus.PENDING,
        subtotal=subtotal,
        tax=tax,
        shipping_cost=shipping_cost,
        total=total,
        shipping_address=order_data.shipping_address,
        billing_address=order_data.billing_address or order_data.shipping_address,
        payment_method=order_data.payment_method,
        customer_notes=order_data.customer_notes
    )
    
    db.add(order)
    db.flush()  # Get order ID
    
    # Add items to order
    for item in order_items:
        item.order_id = order.id
        db.add(item)
    
    # Clear user's cart
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    
    db.commit()
    db.refresh(order)
    
    return order


@router.get("/", response_model=OrderListResponse)
async def get_my_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's orders."""
    query = db.query(Order).filter(Order.user_id == current_user.id)
    
    if status:
        query = query.filter(Order.status == status)
    
    total = query.count()
    offset = (page - 1) * page_size
    
    orders = query.options(
        joinedload(Order.items)
    ).order_by(Order.created_at.desc()).offset(offset).limit(page_size).all()
    
    return OrderListResponse(
        items=orders,
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size
    )


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific order."""
    order = db.query(Order).options(
        joinedload(Order.items)
    ).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check ownership (unless admin)
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order"
        )
    
    return order


@router.get("/number/{order_number}", response_model=OrderResponse)
async def get_order_by_number(
    order_number: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get an order by order number."""
    order = db.query(Order).options(
        joinedload(Order.items)
    ).filter(Order.order_number == order_number).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check ownership (unless admin)
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order"
        )
    
    return order


@router.put("/{order_id}/cancel", response_model=OrderResponse)
async def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel an order (only if pending)."""
    order = db.query(Order).options(
        joinedload(Order.items)
    ).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check ownership
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this order"
        )
    
    if order.status not in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order cannot be cancelled at this stage"
        )
    
    # Restore stock
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock += item.quantity
    
    order.status = OrderStatus.CANCELLED
    db.commit()
    db.refresh(order)
    
    return order


# Seller endpoints
@router.get("/seller/orders", response_model=OrderListResponse)
async def get_seller_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get orders containing seller's products."""
    # Get orders that have items from this seller
    seller_product_ids = db.query(Product.id).filter(Product.seller_id == current_user.id).subquery()
    
    query = db.query(Order).join(OrderItem).filter(
        OrderItem.product_id.in_(seller_product_ids)
    ).distinct()
    
    if status:
        query = query.filter(Order.status == status)
    
    total = query.count()
    offset = (page - 1) * page_size
    
    orders = query.options(
        joinedload(Order.items)
    ).order_by(Order.created_at.desc()).offset(offset).limit(page_size).all()
    
    return OrderListResponse(
        items=orders,
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size
    )


# Admin endpoints
@router.get("/admin/all", response_model=OrderListResponse)
async def get_all_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all orders (admin only)."""
    query = db.query(Order)
    
    if status:
        query = query.filter(Order.status == status)
    
    total = query.count()
    offset = (page - 1) * page_size
    
    orders = query.options(
        joinedload(Order.items)
    ).order_by(Order.created_at.desc()).offset(offset).limit(page_size).all()
    
    return OrderListResponse(
        items=orders,
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size
    )


@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update order status (admin only)."""
    order = db.query(Order).options(
        joinedload(Order.items)
    ).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    order.status = status_update.status
    
    if status_update.admin_notes:
        order.admin_notes = status_update.admin_notes
    
    if status_update.tracking_number:
        order.tracking_number = status_update.tracking_number
    
    if status_update.carrier:
        order.carrier = status_update.carrier
    
    # Update timestamps
    if status_update.status == OrderStatus.SHIPPED:
        order.shipped_at = datetime.utcnow().isoformat()
    elif status_update.status == OrderStatus.DELIVERED:
        order.delivered_at = datetime.utcnow().isoformat()
    
    db.commit()
    db.refresh(order)
    
    return order
