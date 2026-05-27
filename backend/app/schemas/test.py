"""
Test and Question Schemas.
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime


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
