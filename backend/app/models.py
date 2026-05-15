"""
Database Models
Aligned with the frontend mockdb structure for a smooth transition.
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


# ============= User =============
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, default="")
    role = Column(String, default="student")  # student | admin
    is_active = Column(Boolean, default=True)

    # Student fields
    usn = Column(String, unique=True, nullable=True)
    semester = Column(Integer, nullable=True)
    branch = Column(String, nullable=True)
    section = Column(String, nullable=True)
    cgpa = Column(Float, default=0.0)

    # Admin fields
    employee_id = Column(String, unique=True, nullable=True)
    department = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    journal_entries = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")
    test_attempts = relationship("TestAttempt", back_populates="user", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("Achievement", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    study_sessions = relationship("StudySession", back_populates="user", cascade="all, delete-orphan")


# ============= Subject =============
class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    semester = Column(Integer, default=6)
    credits = Column(Integer, default=4)
    description = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")
    tests = relationship("Test", back_populates="subject", cascade="all, delete-orphan")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    name = Column(String, nullable=False)
    description = Column(Text, default="")
    difficulty = Column(String, default="medium")  # easy | medium | hard
    estimated_hours = Column(Float, default=2.0)
    order_index = Column(Integer, default=0)

    subject = relationship("Subject", back_populates="topics")


# ============= Tests =============
class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    type = Column(String, default="quiz")  # quiz | midterm | final | assignment
    difficulty = Column(String, default="medium")
    duration_minutes = Column(Integer, default=60)
    total_marks = Column(Integer, default=100)
    passing_marks = Column(Integer, default=40)
    is_active = Column(Boolean, default=True)
    anti_cheat_enabled = Column(Boolean, default=True)
    starts_at = Column(DateTime(timezone=True), nullable=True)
    ends_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    subject = relationship("Subject", back_populates="tests")
    questions = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    attempts = relationship("TestAttempt", back_populates="test", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"))
    question_text = Column(Text, nullable=False)
    question_type = Column(String, default="mcq")  # mcq | coding | descriptive
    options = Column(JSON, nullable=True)
    correct_answer = Column(Text, nullable=False)
    marks = Column(Integer, default=1)
    difficulty = Column(String, default="medium")

    test = relationship("Test", back_populates="questions")


class TestAttempt(Base):
    __tablename__ = "test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    test_id = Column(Integer, ForeignKey("tests.id"))
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    score = Column(Float, default=0)
    answers = Column(JSON, nullable=True)
    anti_cheat_flags = Column(JSON, nullable=True)
    is_completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="test_attempts")
    test = relationship("Test", back_populates="attempts")


# ============= Journal =============
class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    code = Column(Text, default="")
    language = Column(String, default="python")
    description = Column(Text, default="")
    tags = Column(JSON, default=list)
    is_starred = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="journal_entries")


# ============= Achievements & Certificates =============
class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    type = Column(String, default="completion")  # completion | achievement | excellence
    score = Column(Float, default=0)
    issued_date = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="certificates")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    icon = Column(String, default="🏆")
    rarity = Column(String, default="common")  # common | rare | epic | legendary
    earned_date = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="achievements")


# ============= Study =============
class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, default=0)
    focus_score = Column(Float, default=0)
    notes = Column(Text, default="")

    user = relationship("User", back_populates="study_sessions")


class TopicMastery(Base):
    __tablename__ = "topic_mastery"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    mastery = Column(Float, default=0)  # 0-100
    forgetting_risk = Column(String, default="low")  # low | medium | high
    last_reviewed = Column(DateTime(timezone=True), server_default=func.now())


# ============= Notifications =============
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    message = Column(Text, default="")
    type = Column(String, default="info")  # info | success | warning | error
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")


# ============= Anti-Cheat =============
class AntiCheatFlag(Base):
    __tablename__ = "anti_cheat_flags"

    id = Column(Integer, primary_key=True, index=True)
    test_attempt_id = Column(Integer, ForeignKey("test_attempts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    severity = Column(String, default="info")  # critical | warning | info
    violation = Column(String, nullable=False)
    count = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
