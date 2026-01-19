from .todos import router as todos_router
from .stats import router as stats_router
from .settings import router as settings_router

__all__ = ["todos_router", "stats_router", "settings_router"]
