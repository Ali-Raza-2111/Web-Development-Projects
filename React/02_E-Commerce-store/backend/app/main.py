"""
LUXE E-Commerce API - Main Application

A futuristic luxury AI-powered e-commerce backend built with FastAPI.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from .core.config import settings
from .db.session import engine
from .db.base import Base
from .api import auth, users, products, orders, reviews, cart, ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup: Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Create upload directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} started!")
    print(f"📚 API Documentation: http://localhost:8000/docs")
    
    yield
    
    # Shutdown
    print("👋 Shutting down...")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## LUXE E-Commerce API

A futuristic luxury AI-powered e-commerce platform backend.

### Features:
- 🔐 JWT Authentication with refresh tokens
- 🛍️ Product management with categories and variants
- 🛒 Cart and wishlist functionality
- 📦 Order management with status tracking
- ⭐ Review and rating system
- 🤖 AI-powered features (recommendations, chat, summaries)

### API Sections:
- **Authentication**: Register, login, token refresh
- **Users**: Profile management, addresses
- **Products**: CRUD operations, search, filtering
- **Orders**: Create, view, cancel orders
- **Reviews**: Product reviews and ratings
- **Cart**: Shopping cart and wishlist
- **AI**: Chatbot, recommendations, summaries
    """,
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(users.router, prefix=settings.API_PREFIX)
app.include_router(products.router, prefix=settings.API_PREFIX)
app.include_router(orders.router, prefix=settings.API_PREFIX)
app.include_router(reviews.router, prefix=settings.API_PREFIX)
app.include_router(cart.router, prefix=settings.API_PREFIX)
app.include_router(ai.router, prefix=settings.API_PREFIX)

# Mount static files for uploads
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "api_prefix": settings.API_PREFIX
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "database": "connected"
    }
