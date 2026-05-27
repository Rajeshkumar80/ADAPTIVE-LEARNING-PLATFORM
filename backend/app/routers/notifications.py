"""
Notification endpoints — list, mark read, send (admin), history, stats.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from app.auth import get_current_user, require_admin
from app.database import get_db
from app.models import User
from app.schemas import NotificationCreate, NotificationResponse
from app.services import notification_service

router = APIRouter()


# ── Schemas ──────────────────────────────────────────────────────────────────

class BroadcastRequest(BaseModel):
    title: str
    message: str
    type: str = "info"
    section: Optional[str] = None
    semester: Optional[int] = None


# ── Student Endpoints ────────────────────────────────────────────────────────

@router.get("/")
def list_notifications(
    unread_only: bool = Query(False),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get notifications for the current user with pagination."""
    result = notification_service.get_user_notifications(
        db, current_user.id, unread_only=unread_only, limit=limit, offset=offset
    )
    return {
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "type": n.type,
                "is_read": n.is_read,
                "created_at": n.created_at,
            }
            for n in result["notifications"]
        ],
        "total": result["total"],
        "unread_count": result["unread_count"],
    }


@router.get("/stats")
def notification_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get notification statistics for the current user."""
    return notification_service.get_notification_stats(db, current_user.id)


@router.put("/{notification_id}/read")
def mark_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a single notification as read."""
    success = notification_service.mark_as_read(db, notification_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Marked as read"}


@router.put("/read-all")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark all notifications as read."""
    count = notification_service.mark_all_as_read(db, current_user.id)
    return {"message": f"Marked {count} notifications as read", "count": count}


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a notification."""
    success = notification_service.delete_notification(db, notification_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted"}


# ── Teacher/Admin Endpoints ──────────────────────────────────────────────────

@router.post("/send")
def send_notification(
    payload: NotificationCreate,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Admin sends notification to a specific user or all students."""
    if payload.user_id:
        n = notification_service.create_notification(
            db, payload.user_id, payload.title, payload.message, payload.type
        )
        return {"message": "Notification sent", "id": n.id, "count": 1}

    # Broadcast to all students
    count = notification_service.broadcast_to_students(
        db, payload.title, payload.message, payload.type
    )
    return {"message": "Broadcast sent", "count": count}


@router.post("/broadcast")
def broadcast_notification(
    payload: BroadcastRequest,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Admin broadcasts notification with optional section/semester filter."""
    count = notification_service.broadcast_to_students(
        db,
        title=payload.title,
        message=payload.message,
        notification_type=payload.type,
        section=payload.section,
        semester=payload.semester,
    )
    return {
        "message": "Broadcast sent",
        "count": count,
        "filters": {
            "section": payload.section,
            "semester": payload.semester,
        },
    }
