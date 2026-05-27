"""
User Schemas — registration, login, profile, dashboards.
"""

from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = ""


class UserCreate(UserBase):
    password: str
    role: str = "student"
    usn: Optional[str] = None
    employee_id: Optional[str] = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: str
    is_active: bool
    usn: Optional[str] = None
    semester: Optional[int] = None
    branch: Optional[str] = None
    section: Optional[str] = None
    cgpa: Optional[float] = 0.0
    employee_id: Optional[str] = None
    department: Optional[str] = None
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class StudentDashboard(BaseModel):
    streak: int
    avg_score: float
    hours_this_week: float
    topics_mastered: int
    total_topics: int
    achievements_count: int
    certificates_count: int


class AdminDashboard(BaseModel):
    total_students: int
    active_tests: int
    flags_count: int
    avg_performance: float
