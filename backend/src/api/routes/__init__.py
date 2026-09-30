"""Routes package exports."""
from .auth import router as auth_router
from .forecast import router as forecast_router
from .advisory import router as advisory_router
from .stations import router as stations_router
from .compare import router as compare_router
from .search import router as search_router
from .webhooks import router as webhooks_router
from .feedback import router as feedback_router
from .admin import router as admin_router
from .health import router as health_router
from .delivery import router as delivery_router

__all__ = [
    "auth_router",
    "forecast_router",
    "advisory_router",
    "stations_router",
    "compare_router",
    "search_router",
    "webhooks_router",
    "feedback_router",
    "admin_router",
    "health_router",
    "delivery_router",
]
