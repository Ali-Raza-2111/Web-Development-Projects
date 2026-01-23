"""
Database Seed Script

This script populates the database with initial data for testing and development.
Run with: python -m app.seeds.seed_db
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.user import User, UserRole
from app.models.product import Product, Category
from app.core.security import get_password_hash


def seed_users(db: Session):
    """Create initial users."""
    users = [
        {
            "email": "admin@luxe.com",
            "password_hash": get_password_hash("admin123"),
            "first_name": "Admin",
            "last_name": "User",
            "role": "admin",
            "is_verified": True
        },
        {
            "email": "seller@luxe.com",
            "password_hash": get_password_hash("seller123"),
            "first_name": "John",
            "last_name": "Seller",
            "role": "seller",
            "is_verified": True,
            "store_name": "Luxury Boutique",
            "store_description": "Premium luxury products for discerning customers"
        },
        {
            "email": "buyer@luxe.com",
            "password_hash": get_password_hash("buyer123"),
            "first_name": "Jane",
            "last_name": "Buyer",
            "role": "buyer",
            "is_verified": True
        }
    ]
    
    for user_data in users:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            user = User(**user_data)
            db.add(user)
            print(f"✅ Created user: {user_data['email']}")
        else:
            print(f"⏭️ User already exists: {user_data['email']}")
    
    db.commit()


def seed_categories(db: Session):
    """Create initial categories."""
    categories = [
        {"name": "Electronics", "slug": "electronics", "description": "Cutting-edge technology and gadgets"},
        {"name": "Fashion", "slug": "fashion", "description": "Luxury clothing and accessories"},
        {"name": "Jewelry", "slug": "jewelry", "description": "Fine jewelry and watches"},
        {"name": "Home & Living", "slug": "home-living", "description": "Premium home decor and furniture"},
        {"name": "Beauty", "slug": "beauty", "description": "Luxury beauty and skincare products"},
        {"name": "Accessories", "slug": "accessories", "description": "Designer bags, belts, and more"},
    ]
    
    for cat_data in categories:
        existing = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if not existing:
            category = Category(**cat_data)
            db.add(category)
            print(f"✅ Created category: {cat_data['name']}")
        else:
            print(f"⏭️ Category already exists: {cat_data['name']}")
    
    db.commit()


def seed_products(db: Session):
    """Create sample products."""
    # Get seller
    seller = db.query(User).filter(User.role == "seller").first()
    if not seller:
        print("❌ No seller found. Please seed users first.")
        return
    
    # Get categories
    electronics = db.query(Category).filter(Category.slug == "electronics").first()
    fashion = db.query(Category).filter(Category.slug == "fashion").first()
    jewelry = db.query(Category).filter(Category.slug == "jewelry").first()
    
    products = [
        {
            "seller_id": seller.id,
            "name": "Premium Wireless Headphones",
            "slug": "premium-wireless-headphones",
            "description": "Experience unparalleled audio quality with our Premium Wireless Headphones. Featuring advanced noise cancellation, 40-hour battery life, and luxurious leather ear cushions. Perfect for audiophiles who demand the best.",
            "short_description": "Luxury wireless headphones with exceptional sound quality",
            "price": 599.99,
            "compare_at_price": 799.99,
            "stock": 50,
            "images": [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "is_featured": True,
            "categories": [electronics] if electronics else []
        },
        {
            "seller_id": seller.id,
            "name": "Designer Leather Jacket",
            "slug": "designer-leather-jacket",
            "description": "Handcrafted from premium Italian leather, this jacket embodies timeless elegance. Features a custom silk lining, brass hardware, and meticulous stitching. A statement piece for any wardrobe.",
            "short_description": "Handcrafted Italian leather jacket",
            "price": 1299.99,
            "compare_at_price": 1599.99,
            "stock": 25,
            "images": [
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
                "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
            "is_featured": True,
            "categories": [fashion] if fashion else []
        },
        {
            "seller_id": seller.id,
            "name": "Diamond Tennis Bracelet",
            "slug": "diamond-tennis-bracelet",
            "description": "A stunning 18K white gold tennis bracelet featuring 5 carats of VVS diamonds. Each stone is hand-selected for maximum brilliance. Comes with a certificate of authenticity.",
            "short_description": "18K white gold with 5 carats of VVS diamonds",
            "price": 8999.99,
            "compare_at_price": 12000.00,
            "stock": 10,
            "images": [
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
                "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
            "is_featured": True,
            "categories": [jewelry] if jewelry else []
        },
        {
            "seller_id": seller.id,
            "name": "Smart Home Hub Pro",
            "slug": "smart-home-hub-pro",
            "description": "The ultimate smart home control center. Compatible with over 500+ smart devices. Features AI-powered automation, voice control, and an elegant touchscreen display.",
            "short_description": "AI-powered smart home control center",
            "price": 449.99,
            "compare_at_price": 599.99,
            "stock": 100,
            "images": [
                "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400",
            "is_featured": True,
            "categories": [electronics] if electronics else []
        },
        {
            "seller_id": seller.id,
            "name": "Silk Evening Gown",
            "slug": "silk-evening-gown",
            "description": "An exquisite hand-sewn silk evening gown featuring intricate beadwork and a flowing silhouette. Perfect for galas, red carpet events, and special occasions.",
            "short_description": "Hand-sewn silk gown with intricate beadwork",
            "price": 2499.99,
            "stock": 15,
            "images": [
                "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400",
            "is_featured": False,
            "categories": [fashion] if fashion else []
        },
        {
            "seller_id": seller.id,
            "name": "Luxury Watch Collection - Chrono Elite",
            "slug": "luxury-watch-chrono-elite",
            "description": "A masterpiece of Swiss engineering. Features a sapphire crystal face, automatic movement, and genuine alligator leather strap. Water resistant to 100m.",
            "short_description": "Swiss automatic watch with sapphire crystal",
            "price": 4999.99,
            "compare_at_price": 6500.00,
            "stock": 8,
            "images": [
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
            ],
            "thumbnail": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "is_featured": True,
            "categories": [jewelry] if jewelry else []
        }
    ]
    
    for prod_data in products:
        existing = db.query(Product).filter(Product.slug == prod_data["slug"]).first()
        if not existing:
            categories = prod_data.pop("categories", [])
            product = Product(**prod_data)
            product.categories = categories
            db.add(product)
            print(f"✅ Created product: {prod_data['name']}")
        else:
            print(f"⏭️ Product already exists: {prod_data['name']}")
    
    db.commit()


def main():
    """Main seed function."""
    print("\n🌱 Starting database seeding...\n")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created\n")
    
    # Create session
    db = SessionLocal()
    
    try:
        seed_users(db)
        print()
        seed_categories(db)
        print()
        seed_products(db)
        print()
        print("🎉 Database seeding completed successfully!\n")
        print("📧 Test accounts:")
        print("   Admin:  admin@luxe.com  / admin123")
        print("   Seller: seller@luxe.com / seller123")
        print("   Buyer:  buyer@luxe.com  / buyer123")
        print()
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
