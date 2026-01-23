from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, Table, JSON
from sqlalchemy.orm import relationship
import enum

from ..db.base import Base, TimestampMixin


# Many-to-many relationship table for product categories
product_categories = Table(
    'product_categories',
    Base.metadata,
    Column('product_id', Integer, ForeignKey('products.id'), primary_key=True),
    Column('category_id', Integer, ForeignKey('categories.id'), primary_key=True)
)


class Category(Base, TimestampMixin):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)
    parent_id = Column(Integer, ForeignKey('categories.id'), nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    products = relationship("Product", secondary=product_categories, back_populates="categories")
    children = relationship("Category", backref="parent", remote_side=[id])


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Basic info
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    short_description = Column(String(500), nullable=True)
    
    # Pricing
    price = Column(Float, nullable=False)
    compare_at_price = Column(Float, nullable=True)  # Original price for discounts
    cost_per_item = Column(Float, nullable=True)  # For profit calculations
    
    # Inventory
    sku = Column(String(100), unique=True, nullable=True)
    barcode = Column(String(100), nullable=True)
    stock = Column(Integer, default=0)
    track_inventory = Column(Boolean, default=True)
    low_stock_threshold = Column(Integer, default=5)
    
    # Media
    images = Column(JSON, default=list)  # List of image URLs
    thumbnail = Column(String(500), nullable=True)
    
    # Variants and options
    variants = Column(JSON, default=list)  # Size, color, etc.
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # SEO
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(String(500), nullable=True)
    
    # AI-generated fields (placeholders for your AI integration)
    ai_summary = Column(Text, nullable=True)
    ai_tags = Column(JSON, default=list)
    
    # Relationships
    seller = relationship("User", back_populates="products")
    categories = relationship("Category", secondary=product_categories, back_populates="products")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")

    @property
    def average_rating(self) -> float:
        if not self.reviews:
            return 0.0
        return sum(r.rating for r in self.reviews) / len(self.reviews)
    
    @property
    def review_count(self) -> int:
        return len(self.reviews)
    
    @property
    def discount_percentage(self) -> float:
        if self.compare_at_price and self.compare_at_price > self.price:
            return round((1 - self.price / self.compare_at_price) * 100)
        return 0
