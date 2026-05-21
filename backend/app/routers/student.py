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
    
    # Compute topics
    from app.models import Topic, TopicMastery, StudySession
    total_topics = db.query(Topic).count()
    topics_mastered = db.query(TopicMastery).filter(
        TopicMastery.user_id == current_user.id,
        TopicMastery.mastery >= 80.0
    ).count()

    # Compute hours this week
    from datetime import datetime, timedelta, timezone
    one_week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    recent_sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.id,
        StudySession.started_at >= one_week_ago
    ).all()
    hours_this_week = sum((s.duration_minutes or 0) for s in recent_sessions) / 60.0

    return {
        "streak": len(set(s.started_at.date() for s in recent_sessions)) if recent_sessions else 0,
        "avg_score": round(avg_score, 1),
        "hours_this_week": round(hours_this_week, 1),
        "topics_mastered": topics_mastered,
        "total_topics": total_topics,
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
    from app.models import Topic, TopicMastery
    from sqlalchemy import func
    
    result = []
    for s in subjects:
        # Get topics for this subject
        subject_topics = db.query(Topic.id).filter(Topic.subject_id == s.id).subquery()
        
        # Get average mastery for these topics
        avg_mastery = db.query(func.avg(TopicMastery.mastery)).filter(
            TopicMastery.user_id == current_user.id,
            TopicMastery.topic_id.in_(subject_topics)
        ).scalar() or 0.0
        
        progress = int(avg_mastery)
        mastery_level = "low"
        if progress >= 80:
            mastery_level = "high"
        elif progress >= 50:
            mastery_level = "medium"
            
        result.append({
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "progress": progress,
            "mastery": mastery_level,
        })
    return result
