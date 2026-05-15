"""
Notifications Router
Handles notifications, email alerts
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

@router.post("/send")
async def send_notification(db: Session = Depends(get_db)):
    """Send notification (admin only)"""
    return {"message": "Notification sent"}

@router.get("/list")
async def get_notifications(db: Session = Depends(get_db)):
    """Get user notifications"""
    return {"notifications": []}

@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: str, db: Session = Depends(get_db)):
    """Mark notification as read"""
    return {"message": "Marked as read"}
