"""Request & Response Logging Middleware."""
import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from backend.src.utils.logger import logger

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path

        try:
            response = await call_next(request)
            duration_ms = (time.time() - start_time) * 1000.0
            logger.info(
                f"{request.method} {path} - {response.status_code} [{duration_ms:.1f}ms] ({client_ip})"
            )
            return response
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000.0
            logger.error(f"{request.method} {path} - FAILED [{duration_ms:.1f}ms]: {e}")
            raise e
