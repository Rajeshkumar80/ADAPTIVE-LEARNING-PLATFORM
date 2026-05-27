"""
Test Service — business logic for test creation, grading, and management.
"""

from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session

from app.models.test import Test, Question, TestAttempt, AntiCheatFlag
from app.models.user import User


def create_test(
    db: Session,
    subject_id: int,
    title: str,
    description: str = "",
    test_type: str = "quiz",
    difficulty: str = "medium",
    duration_minutes: int = 60,
    total_marks: int = 100,
    passing_marks: int = 40,
    anti_cheat_enabled: bool = True,
    questions: list = None,
) -> Test:
    """Create a new test with optional questions."""
    test = Test(
        subject_id=subject_id,
        title=title,
        description=description,
        type=test_type,
        difficulty=difficulty,
        duration_minutes=duration_minutes,
        total_marks=total_marks,
        passing_marks=passing_marks,
        anti_cheat_enabled=anti_cheat_enabled,
    )
    db.add(test)
    db.commit()
    db.refresh(test)

    if questions:
        for q in questions:
            db.add(Question(
                test_id=test.id,
                question_text=q.get("question_text", ""),
                question_type=q.get("question_type", "mcq"),
                options=q.get("options"),
                correct_answer=q.get("correct_answer", ""),
                marks=q.get("marks", 1),
                difficulty=q.get("difficulty", "medium"),
            ))
        db.commit()

    return test


def start_test_attempt(db: Session, user: User, test_id: int) -> dict:
    """Start or resume a test attempt for a student."""
    test = db.query(Test).filter(Test.id == test_id, Test.is_active == True).first()
    if not test:
        return {"error": "Test not found"}

    now = datetime.now(timezone.utc)
    if test.starts_at and now < test.starts_at:
        return {"error": f"Test hasn't started yet. Opens at {test.starts_at.isoformat()}"}
    if test.ends_at and now > test.ends_at:
        return {"error": "Test window has closed"}

    # Check for existing incomplete attempt
    existing = db.query(TestAttempt).filter(
        TestAttempt.user_id == user.id,
        TestAttempt.test_id == test.id,
        TestAttempt.is_completed == False,
    ).first()

    if existing:
        attempt = existing
        resumed = True
    else:
        attempt = TestAttempt(user_id=user.id, test_id=test.id)
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        resumed = False

    questions = db.query(Question).filter(Question.test_id == test.id).all()
    return {
        "attempt_id": attempt.id,
        "test_id": test.id,
        "duration_minutes": test.duration_minutes,
        "resumed": resumed,
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "options": q.options,
                "marks": q.marks,
            }
            for q in questions
        ],
    }


def grade_attempt(db: Session, attempt: TestAttempt, answers: dict) -> dict:
    """Grade a test attempt and return results."""
    questions = db.query(Question).filter(Question.test_id == attempt.test_id).all()
    score = 0
    for q in questions:
        ans = answers.get(str(q.id))
        if ans and ans.strip().lower() == q.correct_answer.strip().lower():
            score += q.marks

    attempt.answers = answers
    attempt.score = score
    attempt.submitted_at = datetime.now(timezone.utc)
    attempt.is_completed = True
    db.commit()

    total = sum(q.marks for q in questions)
    test = db.query(Test).filter(Test.id == attempt.test_id).first()

    return {
        "attempt_id": attempt.id,
        "score": score,
        "total": total,
        "percentage": round(score / total * 100, 1) if total else 0,
        "passed": score >= (test.passing_marks if test else 0),
        "submitted_at": attempt.submitted_at,
    }


def log_violation(
    db: Session,
    attempt_id: int,
    user_id: int,
    severity: str = "warning",
    violation: str = "Tab switch detected",
) -> AntiCheatFlag:
    """Log an anti-cheat violation."""
    flag = AntiCheatFlag(
        test_attempt_id=attempt_id,
        user_id=user_id,
        severity=severity,
        violation=violation,
    )
    db.add(flag)
    db.commit()
    return flag
