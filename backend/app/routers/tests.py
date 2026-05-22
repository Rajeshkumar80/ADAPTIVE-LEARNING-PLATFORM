"""
Test endpoints — list, create (admin), take, submit, results.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user, require_admin, require_student
from app.database import get_db
from app.models import Test, Question, TestAttempt, AntiCheatFlag, User
from app.schemas import TestCreate, TestResponse, TestSubmit

router = APIRouter()


@router.get("/my-attempts")
def my_attempts(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """List all test attempts for the current student with test info."""
    attempts = (
        db.query(TestAttempt)
        .filter(TestAttempt.user_id == current_user.id)
        .order_by(TestAttempt.started_at.desc())
        .all()
    )
    results = []
    for a in attempts:
        test = db.query(Test).filter(Test.id == a.test_id).first()
        results.append({
            "attempt_id": a.id,
            "test_id": a.test_id,
            "test_title": test.title if test else "Unknown",
            "subject": test.subject.name if test and test.subject else "",
            "score": a.score,
            "total_marks": test.total_marks if test else 0,
            "is_completed": a.is_completed,
            "started_at": a.started_at,
            "submitted_at": a.submitted_at,
            "passed": a.score >= (test.passing_marks if test else 0) if a.is_completed else None,
        })
    return results


@router.get("/upcoming")
def upcoming_tests(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """List tests that are scheduled for the future."""
    now = datetime.now(timezone.utc)
    tests = db.query(Test).filter(
        Test.is_active == True,
        Test.starts_at > now,
    ).order_by(Test.starts_at).all()
    return [
        {
            "id": t.id,
            "title": t.title,
            "subject": t.subject.name if t.subject else "",
            "type": t.type,
            "starts_at": t.starts_at,
            "ends_at": t.ends_at,
            "duration_minutes": t.duration_minutes,
        }
        for t in tests
    ]


@router.get("/", response_model=list[TestResponse])
def list_tests(db: Session = Depends(get_db)):
    return db.query(Test).filter(Test.is_active == True).all()


@router.get("/{test_id}", response_model=TestResponse)
def get_test(test_id: int, db: Session = Depends(get_db)):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test


@router.post("/", response_model=TestResponse)
def create_test(
    payload: TestCreate,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    test = Test(
        subject_id=payload.subject_id,
        title=payload.title,
        description=payload.description or "",
        type=payload.type,
        difficulty=payload.difficulty,
        duration_minutes=payload.duration_minutes,
        total_marks=payload.total_marks,
        passing_marks=payload.passing_marks,
        anti_cheat_enabled=payload.anti_cheat_enabled,
    )
    db.add(test)
    db.commit()
    db.refresh(test)

    for q in payload.questions or []:
        db.add(Question(
            test_id=test.id,
            question_text=q.question_text,
            question_type=q.question_type,
            options=q.options,
            correct_answer=q.correct_answer,
            marks=q.marks,
            difficulty=q.difficulty,
        ))
    db.commit()
    return test


@router.post("/{test_id}/start")
def start_test(
    test_id: int,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    test = db.query(Test).filter(Test.id == test_id, Test.is_active == True).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # Enforce scheduling window
    now = datetime.now(timezone.utc)
    if test.starts_at and now < test.starts_at:
        raise HTTPException(status_code=400, detail=f"Test hasn't started yet. Opens at {test.starts_at.isoformat()}")
    if test.ends_at and now > test.ends_at:
        raise HTTPException(status_code=400, detail="Test window has closed")

    # Check if student already has an incomplete attempt
    existing = db.query(TestAttempt).filter(
        TestAttempt.user_id == current_user.id,
        TestAttempt.test_id == test.id,
        TestAttempt.is_completed == False,
    ).first()
    if existing:
        # Resume existing attempt
        questions = db.query(Question).filter(Question.test_id == test.id).all()
        return {
            "attempt_id": existing.id,
            "test_id": test.id,
            "duration_minutes": test.duration_minutes,
            "resumed": True,
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

    attempt = TestAttempt(user_id=current_user.id, test_id=test.id)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    questions = db.query(Question).filter(Question.test_id == test.id).all()
    return {
        "attempt_id": attempt.id,
        "test_id": test.id,
        "duration_minutes": test.duration_minutes,
        "resumed": False,
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


@router.post("/{attempt_id}/submit")
def submit_test(
    attempt_id: int,
    payload: TestSubmit,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    attempt = db.query(TestAttempt).filter(
        TestAttempt.id == attempt_id,
        TestAttempt.user_id == current_user.id,
    ).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.is_completed:
        raise HTTPException(status_code=400, detail="Already submitted")

    questions = db.query(Question).filter(Question.test_id == attempt.test_id).all()
    score = 0
    for q in questions:
        ans = payload.answers.get(str(q.id))
        if ans and ans.strip().lower() == q.correct_answer.strip().lower():
            score += q.marks

    attempt.answers = payload.answers
    attempt.anti_cheat_flags = payload.anti_cheat_flags
    attempt.score = score
    attempt.submitted_at = datetime.now(timezone.utc)
    attempt.is_completed = True
    db.commit()

    # Auto-award certificates and achievements
    from app.services.gamification import check_and_award_after_test
    check_and_award_after_test(current_user, attempt, db)

    return {
        "attempt_id": attempt.id,
        "score": score,
        "total": sum(q.marks for q in questions),
        "percentage": round(score / sum(q.marks for q in questions) * 100, 1) if questions else 0,
        "passed": score >= (db.query(Test).filter(Test.id == attempt.test_id).first().passing_marks or 0),
        "submitted_at": attempt.submitted_at,
    }


@router.post("/{attempt_id}/violation")
def report_violation(
    attempt_id: int,
    severity: str = "warning",
    violation: str = "Tab switch detected",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    flag = AntiCheatFlag(
        test_attempt_id=attempt_id,
        user_id=current_user.id,
        severity=severity,
        violation=violation,
    )
    db.add(flag)
    db.commit()
    return {"message": "Violation logged", "flag_id": flag.id}


@router.get("/{attempt_id}/result")
def get_result(
    attempt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id).first()
    if not attempt or attempt.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Result not found")
    return {
        "attempt_id": attempt.id,
        "score": attempt.score,
        "submitted_at": attempt.submitted_at,
        "is_completed": attempt.is_completed,
    }
