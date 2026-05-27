"""
Test, Question, TestAttempt, and AntiCheatFlag Models.
"""

from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


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


class AntiCheatFlag(Base):
    __tablename__ = "anti_cheat_flags"

    id = Column(Integer, primary_key=True, index=True)
    test_attempt_id = Column(Integer, ForeignKey("test_attempts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    severity = Column(String, default="info")  # critical | warning | info
    violation = Column(String, nullable=False)
    count = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
