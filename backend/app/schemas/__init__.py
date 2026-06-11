"""
Pydantic Schemas Package
Re-exports all schemas for backward compatibility.
"""

from app.schemas.user import (
    UserBase, UserCreate, UserResponse, Token,
    StudentDashboard, AdminDashboard, StudentCreate, StudentUpdate,
)
from app.schemas.test import (
    QuestionBase, QuestionResponse,
    TestBase, TestCreate, TestResponse, TestSubmit,
)
from app.schemas.journal import (
    JournalEntryBase, JournalEntryCreate, JournalEntryUpdate, JournalEntryResponse,
)
from app.schemas.subject import SubjectBase, SubjectCreate, SubjectResponse
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.schemas.achievement import CertificateResponse, AchievementResponse
from app.schemas.ai import AIQueryRequest, AIQueryResponse

__all__ = [
    "UserBase", "UserCreate", "UserResponse", "Token",
    "StudentDashboard", "AdminDashboard", "StudentCreate", "StudentUpdate",
    "QuestionBase", "QuestionResponse",
    "TestBase", "TestCreate", "TestResponse", "TestSubmit",
    "JournalEntryBase", "JournalEntryCreate", "JournalEntryUpdate", "JournalEntryResponse",
    "SubjectBase", "SubjectCreate", "SubjectResponse",
    "NotificationCreate", "NotificationResponse",
    "CertificateResponse", "AchievementResponse",
    "AIQueryRequest", "AIQueryResponse",
]
