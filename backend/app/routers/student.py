"""
Student endpoints — dashboard, profile, certificates, achievements.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import require_student, get_current_user
from app.database import get_db
from app.models import (
    User, Subject, Certificate, Achievement, JournalEntry, TestAttempt
)
from app.schemas import (
    StudentDashboard, CertificateResponse, AchievementResponse,
    SubjectResponse,
)

router = APIRouter()


@router.get("/dashboard", response_model=StudentDashboard)
def get_dashboard(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    achievements_count = db.query(Achievement).filter(Achievement.user_id == current_user.id).count()
    certificates_count = db.query(Certificate).filter(Certificate.user_id == current_user.id).count()

    attempts = db.query(TestAttempt).filter(
        TestAttempt.user_id == current_user.id,
        TestAttempt.is_completed == True,
    ).all()
    avg_score = sum(a.score for a in attempts) / len(attempts) if attempts else 0.0

    return {
        "streak": 7,  # TODO: compute from study sessions
        "avg_score": round(avg_score, 1),
        "hours_this_week": 38.0,  # TODO: compute
        "topics_mastered": 23,
        "total_topics": 45,
        "achievements_count": achievements_count,
        "certificates_count": certificates_count,
    }


@router.get("/subjects", response_model=list[SubjectResponse])
def get_subjects(db: Session = Depends(get_db)):
    return db.query(Subject).all()


@router.get("/certificates", response_model=list[CertificateResponse])
def get_certificates(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    return db.query(Certificate).filter(Certificate.user_id == current_user.id).all()


@router.get("/achievements", response_model=list[AchievementResponse])
def get_achievements(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    return db.query(Achievement).filter(Achievement.user_id == current_user.id).all()


@router.get("/progress")
def get_progress(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """Subject progress for the student."""
    subjects = db.query(Subject).all()
    return [
        {
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "progress": 65,  # TODO: compute from topic mastery
            "mastery": "medium",
        }
        for s in subjects
    ]
