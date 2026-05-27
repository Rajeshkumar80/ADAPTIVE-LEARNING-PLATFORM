"""
Security Utilities — rate limiting, input sanitization, CSRF protection.
"""

import time
import hashlib
import secrets
from typing import Dict, Optional
from collections import defaultdict


class RateLimiter:
    """
    Simple in-memory rate limiter.
    For production, use Redis-based rate limiting.
    """

    def __init__(self, max_requests: int = 60, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = defaultdict(list)

    def is_allowed(self, key: str) -> bool:
        """Check if a request is allowed for the given key."""
        now = time.time()
        window_start = now - self.window_seconds

        # Clean old requests
        self.requests[key] = [
            t for t in self.requests[key] if t > window_start
        ]

        if len(self.requests[key]) >= self.max_requests:
            return False

        self.requests[key].append(now)
        return True

    def remaining(self, key: str) -> int:
        """Get remaining requests for the key."""
        now = time.time()
        window_start = now - self.window_seconds
        current = len([t for t in self.requests[key] if t > window_start])
        return max(0, self.max_requests - current)


def sanitize_input(text: str, max_length: int = 10000) -> str:
    """Sanitize user input to prevent XSS and injection."""
    if not text:
        return ""

    # Truncate
    text = text[:max_length]

    # Remove null bytes
    text = text.replace("\x00", "")

    # Basic HTML entity encoding for dangerous chars
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")

    return text


def generate_csrf_token() -> str:
    """Generate a CSRF token."""
    return secrets.token_urlsafe(32)


def hash_data(data: str) -> str:
    """Create a SHA-256 hash of data."""
    return hashlib.sha256(data.encode()).hexdigest()


def generate_secure_token(length: int = 32) -> str:
    """Generate a cryptographically secure random token."""
    return secrets.token_urlsafe(length)


# Global rate limiter instance
api_rate_limiter = RateLimiter(max_requests=60, window_seconds=60)
auth_rate_limiter = RateLimiter(max_requests=5, window_seconds=300)  # 5 login attempts per 5 min
