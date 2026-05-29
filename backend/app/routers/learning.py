"""
Learning State & Adaptive Scheduler endpoints.
Implements SM-2 spaced repetition for personalized review scheduling.
"""

from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from app.auth import get_current_user, require_student
from app.database import get_db
from app.models import User, TopicMastery, Topic, Subject, StudySession, TestAttempt
from app.services.scheduler import update_learning_state, quality_from_score, update_sm2

router = APIRouter()


class UpdateLearningRequest(BaseModel):
    topic_id: int
    score_percent: float  # 0-100


class SM2DebugRequest(BaseModel):
    repetitions: int = 0
    ease_factor: float = 2.5
    interval: int = 0
    quality: int = 3  # 0-5


@router.get("/due-today")
def get_due_today(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """Get topics due for review today based on SM-2 scheduling."""
    now = datetime.now(timezone.utc)

    # Get all mastery records for user
    records = db.query(TopicMastery, Topic).join(
        Topic, TopicMastery.topic_id == Topic.id
    ).filter(
        TopicMastery.user_id == current_user.id,
    ).all()

    due_topics = []
    for mastery, topic in records:
        # Calculate if due based on forgetting risk and last reviewed
        if not mastery.last_reviewed:
            due_topics.append({
                "topic_id": topic.id,
                "topic_name": topic.name,
                "subject": topic.subject.name if topic.subject else "",
                "mastery": mastery.mastery,
                "forgetting_risk": mastery.forgetting_risk,
                "priority": "high",
            })
            continue

        hours_since = (now - mastery.last_reviewed).total_seconds() / 3600
        interval_hours = 24 if mastery.forgetting_risk == "high" else (144 if mastery.forgetting_risk == "medium" else 336)

        if hours_since >= interval_hours:
            priority = "high" if mastery.forgetting_risk == "high" else ("medium" if mastery.forgetting_risk == "medium" else "low")
            due_topics.append({
                "topic_id": topic.id,
                "topic_name": topic.name,
                "subject": topic.subject.name if topic.subject else "",
                "mastery": mastery.mastery,
                "forgetting_risk": mastery.forgetting_risk,
                "hours_overdue": round(hours_since - interval_hours, 1),
                "priority": priority,
            })

    # Sort by priority
    priority_order = {"high": 0, "medium": 1, "low": 2}
    due_topics.sort(key=lambda x: priority_order.get(x.get("priority", "low"), 3))

    return {
        "due_count": len(due_topics),
        "topics": due_topics,
        "date": now.date().isoformat(),
    }


@router.post("/update")
def update_learning(
    payload: UpdateLearningRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """Update learning state after a study session or quiz. Uses SM-2 algorithm."""
    # Validate topic exists
    topic = db.query(Topic).filter(Topic.id == payload.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    result = update_learning_state(
        db=db,
        user_id=current_user.id,
        topic_id=payload.topic_id,
        score_percent=payload.score_percent,
    )

    return result


@router.get("/dashboard")
def learning_dashboard(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """User's learning progress overview — mastery per subject, streak, stats."""
    # Get all subjects for user's semester
    subjects = db.query(Subject).filter(Subject.semester == (current_user.semester or 6)).all()

    subject_progress = []
    for subj in subjects:
        topic_ids = db.query(Topic.id).filter(Topic.subject_id == subj.id).subquery()
        avg_mastery = db.query(func.avg(TopicMastery.mastery)).filter(
            TopicMastery.user_id == current_user.id,
            TopicMastery.topic_id.in_(topic_ids),
        ).scalar() or 0.0

        topics_total = db.query(Topic).filter(Topic.subject_id == subj.id).count()
        topics_started = db.query(TopicMastery).filter(
            TopicMastery.user_id == current_user.id,
            TopicMastery.topic_id.in_(topic_ids),
        ).count()

        subject_progress.append({
            "subject_id": subj.id,
            "subject_name": subj.name,
            "subject_code": subj.code,
            "avg_mastery": round(avg_mastery, 1),
            "topics_total": topics_total,
            "topics_started": topics_started,
        })

    # Study streak
    sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.id,
        StudySession.ended_at.isnot(None),
    ).order_by(StudySession.started_at.desc()).all()

    streak = 0
    if sessions:
        dates = sorted(set(s.started_at.date() for s in sessions), reverse=True)
        today = datetime.now(timezone.utc).date()
        if dates and (dates[0] == today or dates[0] == today - timedelta(days=1)):
            streak = 1
            for i in range(1, len(dates)):
                if (dates[i - 1] - dates[i]).days == 1:
                    streak += 1
                else:
                    break

    # Total stats
    total_study_minutes = db.query(func.sum(StudySession.duration_minutes)).filter(
        StudySession.user_id == current_user.id
    ).scalar() or 0

    tests_taken = db.query(TestAttempt).filter(
        TestAttempt.user_id == current_user.id,
        TestAttempt.is_completed == True,
    ).count()

    return {
        "user": current_user.full_name,
        "semester": current_user.semester,
        "streak_days": streak,
        "total_study_hours": round(total_study_minutes / 60, 1),
        "tests_taken": tests_taken,
        "subjects": subject_progress,
    }


@router.post("/sm2-calculate")
def sm2_calculate(payload: SM2DebugRequest):
    """Debug/test endpoint: calculate SM-2 output for given inputs."""
    new_reps, new_ef, new_interval = update_sm2(
        payload.repetitions, payload.ease_factor, payload.interval, payload.quality
    )
    return {
        "input": payload.model_dump(),
        "output": {
            "repetitions": new_reps,
            "ease_factor": round(new_ef, 2),
            "interval_days": new_interval,
            "next_review": (datetime.now(timezone.utc) + timedelta(days=new_interval)).isoformat(),
        },
    }
