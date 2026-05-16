"""
Authentication endpoints — register, login, logout, /me.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth import (
    create_access_token, get_current_user, hash_password, verify_password,
)
from app.database import get_db
from app.models import User
from app.schemas import Token, UserCreate, UserResponse

router = APIRouter()


@router.post("/register", response_model=Token)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(
        (User.email == payload.email) | (User.username == payload.username)
    ).first():
        raise HTTPException(status_code=400, detail="Email or username already registered")

    role = payload.role if payload.role in ("student", "admin") else "student"
    user = User(
        email=payload.email,
        username=payload.username,
        full_name=payload.full_name or "",
        hashed_password=hash_password(payload.password),
        role=role,
    )

    if role == "student":
        user.usn = payload.usn or f"1GD23CS{user.id or 'NEW'}"
        user.semester = 6
        user.branch = "Computer Science"
        user.section = "A"
        user.cgpa = 0.0
    else:
        user.employee_id = payload.employee_id or "EMP-NEW"
        user.department = "Computer Science"

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == form.username) | (User.email == form.username)
    ).first()

    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
