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


@router.put("/profile")
def update_profile(
    semester: int | None = None,
    section: str | None = None,
    branch: str | None = None,
    full_name: str | None = None,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """Update student profile fields."""
    if semester is not None:
        current_user.semester = semester
    if section is not None:
        current_user.section = section
    if branch is not None:
        current_user.branch = branch
    if full_name is not None:
        current_user.full_name = full_name
    db.commit()
    db.refresh(current_user)
    return {
        "message": "Profile updated",
        "user": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "semester": current_user.semester,
            "section": current_user.section,
            "branch": current_user.branch,
            "usn": current_user.usn,
        },
    }


@router.get("/leaderboard")
def leaderboard(
    db: Session = Depends(get_db),
):
    """Top students by CGPA and test scores."""
    from sqlalchemy import func
    
    # Top by CGPA
    top_cgpa = db.query(User).filter(
        User.role == "student", User.cgpa > 0
    ).order_by(User.cgpa.desc()).limit(10).all()

    # Top by average test score
    top_scores = (
        db.query(
            User.id, User.full_name, User.usn,
            func.avg(TestAttempt.score).label("avg_score"),
            func.count(TestAttempt.id).label("tests_taken"),
        )
        .join(TestAttempt, TestAttempt.user_id == User.id)
        .filter(TestAttempt.is_completed == True)
        .group_by(User.id)
        .order_by(func.avg(TestAttempt.score).desc())
        .limit(10)
        .all()
    )

    return {
        "by_cgpa": [
            {"rank": i + 1, "name": u.full_name, "usn": u.usn, "cgpa": u.cgpa}
            for i, u in enumerate(top_cgpa)
        ],
        "by_test_score": [
            {"rank": i + 1, "name": r.full_name, "usn": r.usn, "avg_score": round(r.avg_score, 1), "tests_taken": r.tests_taken}
            for i, r in enumerate(top_scores)
        ],
    }
