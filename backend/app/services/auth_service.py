"""
Authentication Service — business logic for user registration and login.
"""

from typing import Optional
from sqlalchemy.orm import Session

from app.auth import hash_password, verify_password, create_access_token
from app.models.user import User


def register_user(
    db: Session,
    email: str,
    username: str,
    password: str,
    full_name: str = "",
    role: str = "student",
    usn: Optional[str] = None,
    employee_id: Optional[str] = None,
) -> tuple[User, str]:
    """Register a new user and return (user, token)."""
    user = User(
        email=email,
        username=username,
        full_name=full_name,
        hashed_password=hash_password(password),
        role=role,
    )

    if role == "student":
        user.semester = 6
        user.branch = "Computer Science"
        user.section = "A"
        user.cgpa = 0.0
    else:
        user.employee_id = employee_id or "EMP-NEW"
        user.department = "Computer Science"

    db.add(user)
    db.commit()
    db.refresh(user)

    if role == "student" and not user.usn:
        user.usn = usn or f"1GD23CS{user.id:03d}"
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": user.username})
    return user, token


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Authenticate user by username/email and password. Returns user or None."""
    user = db.query(User).filter(
        (User.username == username) | (User.email == username)
    ).first()

    if not user or not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        return None

    return user
