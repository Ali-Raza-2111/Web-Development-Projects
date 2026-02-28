from .upload import router as upload_router
from .chat import router as chat_router
from .files import router as files_router
from .health import router as health_router

__all__ = ["upload_router", "chat_router", "files_router", "health_router"]
