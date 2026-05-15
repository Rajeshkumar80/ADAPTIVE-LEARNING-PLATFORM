"""
Pydantic Schemas for Request/Response Validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models import UserRole, TestType, DifficultyLevel


# ============= User Schemas =============
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ============= Student Profile Schemas =============
class StudentProfileBase(BaseModel):
    usn: str
    semester: int
    branch: str
    cgpa: Optional[float] = 0.0
    learning_style: Optional[str] = None
    preferred_study_time: Optional[str] = None
    study_hours_per_day: Optional[float] = 0.0


class StudentProfileCreate(StudentProfileBase):
    pass


class StudentProfileResponse(StudentProfileBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============= Subject Schemas =============
class SubjectBase(BaseModel):
    code: str
    name: str
    semester: int
    credits: int
    description: Optional[str] = None


class SubjectCreate(SubjectBase):
    pass


class SubjectResponse(SubjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============= Topic Schemas =============
class TopicBase(BaseModel):
    subject_id: int
    name: str
    description: Optional[str] = None
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    estimated_hours: Optional[float] = None
    order: Optional[int] = None


class TopicCreate(TopicBase):
    pass


class TopicResponse(TopicBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============= Resource Schemas =============
class ResourceBase(BaseModel):
    topic_id: int
    title: str
    type: str
    url: Optional[str] = None
    content: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None


class ResourceCreate(ResourceBase):
    pass


class ResourceResponse(ResourceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============= Journal Entry Schemas =============
class JournalEntryBase(BaseModel):
    title: str
    code: Optional[str] = None
    language: str = "python"
    description: Optional[str] = None
    tags: Optional[List[str]] = []
    is_public: bool = False


class JournalEntryCreate(JournalEntryBase):
    pass


class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    code: Optional[str] = None
    language: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None


class JournalEntryResponse(JournalEntryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ============= Test Schemas =============
class QuestionBase(BaseModel):
    question_text: str
    question_type: str
    options: Optional[Dict[str, str]] = None
    correct_answer: str
    marks: int
    difficulty: DifficultyLevel


class QuestionCreate(QuestionBase):
    test_id: int


class QuestionResponse(QuestionBase):
    id: int
    test_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TestBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    type: TestType
    difficulty: DifficultyLevel
    duration_minutes: int
    total_marks: int
    passing_marks: int
    anti_cheat_enabled: bool = True


class TestCreate(TestBase):
    questions: Optional[List[QuestionBase]] = []


class TestResponse(TestBase):
    id: int
    is_active: bool
    created_at: datetime
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True


class TestAttemptCreate(BaseModel):
    test_id: int


class TestAttemptSubmit(BaseModel):
    answers: Dict[int, str]  # question_id: answer


class TestAttemptResponse(BaseModel):
    id: int
    user_id: int
    test_id: int
    started_at: datetime
    submitted_at: Optional[datetime]
    score: Optional[float]
    is_completed: bool
    anti_cheat_flags: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


# ============= Study Session Schemas =============
class StudySessionCreate(BaseModel):
    subject_id: int
    topic_id: Optional[int] = None


class StudySessionEnd(BaseModel):
    focus_score: Optional[float] = None
    notes: Optional[str] = None


class StudySessionResponse(BaseModel):
    id: int
    user_id: int
    subject_id: int
    topic_id: Optional[int]
    started_at: datetime
    ended_at: Optional[datetime]
    duration_minutes: Optional[int]
    focus_score: Optional[float]
    notes: Optional[str]

    class Config:
        from_attributes = True


# ============= Notification Schemas =============
class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str
    type: str = "info"


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============= Study Plan Schemas =============
class StudyPlanCreate(BaseModel):
    subject_id: int
    start_date: datetime
    end_date: datetime
    daily_hours: float


class StudyPlanResponse(BaseModel):
    id: int
    user_id: int
    subject_id: int
    start_date: datetime
    end_date: datetime
    daily_hours: float
    schedule: Optional[Dict[str, Any]]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============= AI Assistant Schemas =============
class AIQueryRequest(BaseModel):
    query: str
    context: Optional[str] = None


class AIQueryResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = []
    confidence: Optional[float] = None


# ============= Dashboard Schemas =============
class DashboardStats(BaseModel):
    total_study_hours: float
    tests_completed: int
    average_score: float
    journal_entries: int
    current_streak: int
    subjects_in_progress: int


class ProgressData(BaseModel):
    subject: str
    progress: float
    last_studied: Optional[datetime]
