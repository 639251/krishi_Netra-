"""In-memory Token Bucket / Sliding Window Rate Limiter."""
import time
from typing import Dict, Tuple
from fastapi import Request, HTTPException

class RateLimiter:
    """Limits client requests to max 1,000 req/min per IP/API key."""

    def __init__(self, max_requests: int = 1000, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.clients: Dict[str, list] = {}

    def check_rate_limit(self, client_id: str) -> bool:
        now = time.time()
        if client_id not in self.clients:
            self.clients[client_id] = []

        # Filter out expired timestamps
        self.clients[client_id] = [
            t for t in self.clients[client_id] if now - t < self.window_seconds
        ]

        if len(self.clients[client_id]) >= self.max_requests:
            return False

        self.clients[client_id].append(now)
        return True

rate_limiter = RateLimiter(max_requests=1000, window_seconds=60)
