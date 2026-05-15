"""
Pydantic Schemas for Request/Response Validation
"""

from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime


# ============= User =============
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


# ============= Subject =============
class SubjectBase(BaseModel):
    code: str
    name: str
    semester: int = 6
    credits: int = 4
    description: Optional[str] = ""


class SubjectCreate(SubjectBase):
    pass


class SubjectResponse(SubjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


# ============= Test =============
class QuestionBase(BaseModel):
    question_text: str
    question_type: str = "mcq"
    options: Optional[Dict[str, str]] = None
    correct_answer: str
    marks: int = 1
    difficulty: str = "medium"


class QuestionResponse(QuestionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    test_id: int


class TestBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = ""
    type: str = "quiz"
    difficulty: str = "medium"
    duration_minutes: int = 60
    total_marks: int = 100
    passing_marks: int = 40
    anti_cheat_enabled: bool = True


class TestCreate(TestBase):
    questions: Optional[List[QuestionBase]] = []


class TestResponse(TestBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_active: bool
    created_at: datetime


class TestSubmit(BaseModel):
    answers: Dict[str, str]
    anti_cheat_flags: Optional[Dict[str, Any]] = None


# ============= Journal =============
class JournalEntryBase(BaseModel):
    title: str
    code: Optional[str] = ""
    language: str = "python"
    description: Optional[str] = ""
    tags: Optional[List[str]] = []
    is_starred: bool = False


class JournalEntryCreate(JournalEntryBase):
    pass


class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    code: Optional[str] = None
    language: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    is_starred: Optional[bool] = None


class JournalEntryResponse(JournalEntryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


# ============= Certificate / Achievement =============
class CertificateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    title: str
    subject: str
    type: str
    score: float
    issued_date: datetime


class AchievementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    title: str
    description: str
    icon: str
    rarity: str
    earned_date: datetime


# ============= Notification =============
class NotificationCreate(BaseModel):
    user_id: Optional[int] = None  # if None, send to all
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


# ============= AI =============
class AIQueryRequest(BaseModel):
    query: str
    context: Optional[str] = None


class AIQueryResponse(BaseModel):
    response: str
    sources: List[str] = []


# ============= Dashboard =============
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
