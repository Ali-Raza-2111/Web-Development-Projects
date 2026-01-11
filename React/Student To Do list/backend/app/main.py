from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .database import engine, Base
from .routers import todos, stats, settings as settings_router

# Create database tables
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="API for Student Todo List Application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(todos.router, prefix="/api/todos", tags=["Todos"])
app.include_router(stats.router, prefix="/api/stats", tags=["Statistics"])
app.include_router(settings_router.router, prefix="/api/settings", tags=["Settings"])


@app.get("/")
async def root():
    return {"message": "Welcome to Student Todo API", "docs": "/docs"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
