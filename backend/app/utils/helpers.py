"""
General Helper Utilities.
"""

from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional


def utc_now() -> datetime:
    """Get current UTC datetime."""
    return datetime.now(timezone.utc)


def format_duration(minutes: int) -> str:
    """Format minutes into human-readable duration."""
    if minutes < 60:
        return f"{minutes}m"
    hours = minutes // 60
    mins = minutes % 60
    if mins == 0:
        return f"{hours}h"
    return f"{hours}h {mins}m"


def calculate_percentage(value: float, total: float) -> float:
    """Calculate percentage safely."""
    if total == 0:
        return 0.0
    return round((value / total) * 100, 1)


def paginate(items: List[Any], page: int = 1, per_page: int = 20) -> Dict:
    """Paginate a list of items."""
    total = len(items)
    start = (page - 1) * per_page
    end = start + per_page

    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
        "has_next": end < total,
        "has_prev": page > 1,
    }


def calculate_streak(dates: List[datetime]) -> int:
    """Calculate consecutive day streak from a list of datetimes."""
    if not dates:
        return 0

    unique_dates = sorted(set(d.date() for d in dates), reverse=True)
    if not unique_dates:
        return 0

    # Check if today or yesterday is in the list
    today = datetime.now(timezone.utc).date()
    if unique_dates[0] < today - timedelta(days=1):
        return 0  # Streak broken

    streak = 1
    for i in range(1, len(unique_dates)):
        if (unique_dates[i - 1] - unique_dates[i]).days == 1:
            streak += 1
        else:
            break

    return streak


def truncate_text(text: str, max_length: int = 200, suffix: str = "...") -> str:
    """Truncate text to max length with suffix."""
    if len(text) <= max_length:
        return text
    return text[: max_length - len(suffix)] + suffix


def safe_json_loads(text: str, default: Any = None) -> Any:
    """Safely parse JSON, returning default on failure."""
    import json
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        return default
