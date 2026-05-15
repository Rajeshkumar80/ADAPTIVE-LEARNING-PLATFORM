"""
Authentication Router
Handles user registration, login, password reset
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.database import get_db
from app.config import settings

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/register/student")
async def register_student(db: Session = Depends(get_db)):
    """Register a new student"""
    return {"message": "Student registration endpoint - to be implemented"}

@router.post("/register/admin")
async def register_admin(db: Session = Depends(get_db)):
    """Register a new admin/teacher"""
    return {"message": "Admin registration endpoint - to be implemented"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login endpoint for both students and admins"""
    return {"message": "Login endpoint - to be implemented"}

@router.post("/logout")
async def logout():
    """Logout endpoint"""
    return {"message": "Logged out successfully"}

@router.post("/forgot-password")
async def forgot_password(db: Session = Depends(get_db)):
    """Send password reset email"""
    return {"message": "Password reset email sent"}

@router.post("/reset-password")
async def reset_password(db: Session = Depends(get_db)):
    """Reset password with OTP"""
    return {"message": "Password reset successful"}

@router.get("/profile")
async def get_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Get current user profile"""
    return {"message": "User profile - to be implemented"}
