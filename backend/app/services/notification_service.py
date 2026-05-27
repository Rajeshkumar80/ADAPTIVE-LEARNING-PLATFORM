"""
Notification Service — business logic for creating, sending, and managing notifications.
"""

import logging
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import Notification, User

logger = logging.getLogger("adaptlearn.notifications")


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "info",
) -> Notification:
    """Create a single notification for a user."""
    n = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type,
    )
    db.add(n)
    db.commit()
    db.refresh(n)
    logger.info(f"Notification created for user {user_id}: {title}")
    return n


def broadcast_to_students(
    db: Session,
    title: str,
    message: str,
    notification_type: str = "info",
    section: Optional[str] = None,
    semester: Optional[int] = None,
) -> int:
    """Broadcast notification to all students (optionally filtered by section/semester)."""
    query = db.query(User).filter(User.role == "student", User.is_active == True)

    if section:
        query = query.filter(User.section == section)
    if semester:
        query = query.filter(User.semester == semester)

    students = query.all()
    count = 0

    for student in students:
        db.add(Notification(
            user_id=student.id,
            title=title,
            message=message,
            type=notification_type,
        ))
        count += 1

    db.commit()
    logger.info(f"Broadcast sent to {count} students: {title}")
    return count


def get_user_notifications(
    db: Session,
    user_id: int,
    unread_only: bool = False,
    limit: int = 50,
    offset: int = 0,
) -> dict:
    """Get notifications for a user with pagination and counts."""
    query = db.query(Notification).filter(Notification.user_id == user_id)

    if unread_only:
        query = query.filter(Notification.is_read == False)

    total = query.count()
    unread_count = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False,
    ).count()

    notifications = (
        query.order_by(Notification.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "notifications": notifications,
        "total": total,
        "unread_count": unread_count,
        "page_size": limit,
        "offset": offset,
    }


def mark_as_read(db: Session, notification_id: int, user_id: int) -> bool:
    """Mark a single notification as read."""
    n = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id,
    ).first()
    if not n:
        return False
    n.is_read = True
    db.commit()
    return True


def mark_all_as_read(db: Session, user_id: int) -> int:
    """Mark all notifications as read for a user. Returns count updated."""
    count = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False,
    ).update({"is_read": True})
    db.commit()
    return count


def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
    """Delete a notification."""
    n = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id,
    ).first()
    if not n:
        return False
    db.delete(n)
    db.commit()
    return True


def get_notification_stats(db: Session, user_id: int) -> dict:
    """Get notification statistics for a user."""
    total = db.query(Notification).filter(Notification.user_id == user_id).count()
    unread = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False,
    ).count()

    # Count by type
    type_counts = (
        db.query(Notification.type, func.count(Notification.id))
        .filter(Notification.user_id == user_id)
        .group_by(Notification.type)
        .all()
    )

    return {
        "total": total,
        "unread": unread,
        "read": total - unread,
        "by_type": {t: c for t, c in type_counts},
    }
