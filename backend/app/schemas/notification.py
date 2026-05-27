"""
Notification Schemas.
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class NotificationCreate(BaseModel):
    user_id: Optional[int] = None  # if None, broadcast to all
    title: str
    message: str
    type: str = "info"


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
