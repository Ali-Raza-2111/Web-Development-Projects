from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from ..db.base import Base, TimestampMixin


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    order_number = Column(String(50), unique=True, nullable=False)
    
    # Status
    status = Column(String(20), default=OrderStatus.PENDING)
    payment_status = Column(String(20), default=PaymentStatus.PENDING)
    
    # Pricing
    subtotal = Column(Float, nullable=False)
    tax = Column(Float, default=0)
    shipping_cost = Column(Float, default=0)
    discount = Column(Float, default=0)
    total = Column(Float, nullable=False)
    
    # Shipping address (stored as JSON for historical purposes)
    shipping_address = Column(JSON, nullable=False)
    billing_address = Column(JSON, nullable=True)
    
    # Payment info
    payment_method = Column(String(50), nullable=True)
    payment_id = Column(String(100), nullable=True)
    
    # Notes
    customer_notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    
    # Tracking
    tracking_number = Column(String(100), nullable=True)
    carrier = Column(String(50), nullable=True)
    
    # Timestamps
    paid_at = Column(String, nullable=True)
    shipped_at = Column(String, nullable=True)
    delivered_at = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    
    # Snapshot of product at time of order
    product_name = Column(String(255), nullable=False)
    product_image = Column(String(500), nullable=True)
    product_sku = Column(String(100), nullable=True)
    
    # Pricing
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    total = Column(Float, nullable=False)
    
    # Variant info
    variant = Column(JSON, nullable=True)  # e.g., {"size": "M", "color": "Blue"}
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
