"""FastAPI Application Factory for KrishiNetra."""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from backend.src.api.routes import (
    auth_router,
    forecast_router,
    advisory_router,
    stations_router,
    compare_router,
    search_router,
    webhooks_router,
    feedback_router,
    admin_router,
    health_router,
    delivery_router,
)
from backend.src.api.middleware.logging import RequestLoggingMiddleware
from backend.src.api.dependencies import seed_initial_data_if_empty
from backend.src.utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing KrishiNetra Backend Services...")
    seed_initial_data_if_empty()
    logger.info("KrishiNetra API ready for requests.")
    yield
    logger.info("Shutting down KrishiNetra Backend Services...")

def create_app() -> FastAPI:
    app = FastAPI(
        title="KrishiNetra Agro-Meteorological Downscaling API",
        description="High-resolution (1 km) AI-powered weather intelligence and localized crop advisory API for India.",
        version="2.3.1",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(RequestLoggingMiddleware)

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled error on {request.url.path}: {exc}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": "error",
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected error occurred. Please try again later.",
                },
            },
        )

    for prefix in ["/v1", ""]:
        app.include_router(auth_router, prefix=prefix)
        app.include_router(forecast_router, prefix=prefix)
        app.include_router(advisory_router, prefix=prefix)
        app.include_router(stations_router, prefix=prefix)
        app.include_router(compare_router, prefix=prefix)
        app.include_router(search_router, prefix=prefix)
        app.include_router(webhooks_router, prefix=prefix)
        app.include_router(feedback_router, prefix=prefix)
        app.include_router(admin_router, prefix=prefix)
        app.include_router(health_router, prefix=prefix)
        app.include_router(delivery_router, prefix=prefix)

    return app

app = create_app()
