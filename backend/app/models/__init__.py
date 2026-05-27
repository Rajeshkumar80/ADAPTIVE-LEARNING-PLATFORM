"""
SQLAlchemy Models Package
Re-exports all models for backward compatibility.
"""

from app.models.user import User
from app.models.subject import Subject, Topic
from app.models.test import Test, Question, TestAttempt, AntiCheatFlag
from app.models.journal import JournalEntry
from app.models.learning_state import TopicMastery, StudySession
from app.models.notification import Notification
from app.models.achievement import Certificate, Achievement

__all__ = [
    "User",
    "Subject",
    "Topic",
    "Test",
    "Question",
    "TestAttempt",
    "AntiCheatFlag",
    "JournalEntry",
    "TopicMastery",
    "StudySession",
    "Notification",
    "Certificate",
    "Achievement",
]
