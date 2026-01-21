"""
FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.api import chat_router, documents_router, settings_router

settings = get_settings()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application"""
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="A RAG-powered chat API with LangGraph ReAct agents and ChromaDB",
        docs_url="/docs",
        redoc_url="/redoc",
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
    app.include_router(chat_router)
    app.include_router(documents_router)
    app.include_router(settings_router)
    
    # Root endpoint
    @app.get("/", tags=["Health"])
    async def root():
        return {
            "message": f"{settings.APP_NAME} is running",
            "version": settings.APP_VERSION,
            "docs": "/docs"
        }
    
    # Health check endpoint
    @app.get("/health", tags=["Health"])
    async def health_check():
        return {"status": "healthy"}
    
    return app


# Create the app instance
app = create_app()
