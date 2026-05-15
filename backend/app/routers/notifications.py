"""
Notification endpoints — list, mark read, send (admin).
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user, require_admin
from app.database import get_db
from app.models import Notification, User
from app.schemas import NotificationCreate, NotificationResponse

router = APIRouter()


@router.get("/", response_model=list[NotificationResponse])
def list_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )


@router.put("/{notification_id}/read")
def mark_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    n = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id,
    ).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    return {"message": "Marked as read"}


@router.put("/read-all")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}


@router.post("/send")
def send_notification(
    payload: NotificationCreate,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Admin sends notification to a specific user or all students."""
    if payload.user_id:
        n = Notification(
            user_id=payload.user_id,
            title=payload.title,
            message=payload.message,
            type=payload.type,
        )
        db.add(n)
        db.commit()
        return {"message": "Notification sent", "count": 1}

    # Broadcast to all students
    students = db.query(User).filter(User.role == "student").all()
    for s in students:
        db.add(Notification(
            user_id=s.id,
            title=payload.title,
            message=payload.message,
            type=payload.type,
        ))
    db.commit()
    return {"message": "Broadcast sent", "count": len(students)}
