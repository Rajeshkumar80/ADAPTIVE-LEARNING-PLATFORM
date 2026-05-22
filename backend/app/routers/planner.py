"""
Study Planner endpoints — AI-powered schedule, sessions, mastery.
"""

import logging
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.auth import require_student
from app.database import get_db
from app.models import StudySession, TopicMastery, Topic, User, Subject
from app.services import ai_service

logger = logging.getLogger("adaptlearn.planner")
router = APIRouter()


@router.get("/today")
def today_plan(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """Generate today's study plan based on user's subjects and weak areas."""
    # Get user's subjects (based on semester)
    subjects = db.query(Subject).filter(Subject.semester == (current_user.semester or 6)).all()
    subject_names = [s.name for s in subjects] if subjects else ["Data Structures", "DBMS", "Operating Systems"]

    # Find weak topics (mastery < 60)
    weak_topics_q = (
        db.query(Topic.name)
        .join(TopicMastery, TopicMastery.topic_id == Topic.id)
        .filter(TopicMastery.user_id == current_user.id, TopicMastery.mastery < 60)
        .limit(5)
        .all()
    )
    weak_topics = [t[0] for t in weak_topics_q]

    # Try AI-generated plan
    sessions = []
    if ai_service.is_available():
        try:
            sessions = ai_service.generate_study_plan(
                subjects=subject_names,
                weak_topics=weak_topics,
                available_hours=4.0,
            )
        except Exception as e:
            logger.warning(f"AI plan generation failed: {e}")

    # Fallback: generate a basic plan from subjects
    if not sessions:
        base_time = 9
        sessions = []
        for i, subj in enumerate(subject_names[:5]):
            hour = base_time + (i * 2)
            sessions.append({
                "time": f"{hour:02d}:00",
                "subject": subj,
                "topic": weak_topics[i] if i < len(weak_topics) else "General Review",
                "duration": 60,
                "activity": "study" if i % 2 == 0 else "practice",
            })

    # Add IDs and status
    today_sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.id,
        StudySession.started_at >= datetime.now(timezone.utc).replace(hour=0, minute=0, second=0),
    ).all()
    completed_subjects = {s.subject_id for s in today_sessions if s.ended_at}

    for i, s in enumerate(sessions):
        s["id"] = i + 1
        s["status"] = "pending"

    total_duration = sum(s.get("duration", 60) for s in sessions)

    return {
        "date": datetime.now(timezone.utc).date().isoformat(),
        "sessions": sessions,
        "total_duration": total_duration,
        "ai_generated": ai_service.is_available(),
    }


@router.get("/goals")
def get_goals(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """Generate goals based on user's actual progress."""
    # Get subjects with low mastery
    subjects = db.query(Subject).filter(Subject.semester == (current_user.semester or 6)).all()

    goals = []
    for i, subj in enumerate(subjects[:4]):
        # Calculate real progress for this subject
        topic_ids = db.query(Topic.id).filter(Topic.subject_id == subj.id).subquery()
        avg_mastery = db.query(func.avg(TopicMastery.mastery)).filter(
            TopicMastery.user_id == current_user.id,
            TopicMastery.topic_id.in_(topic_ids),
        ).scalar()

        progress = int(avg_mastery) if avg_mastery else 0
        deadline = (datetime.now(timezone.utc) + timedelta(days=7 + i * 3)).date().isoformat()

        goals.append({
            "id": i + 1,
            "title": f"Master {subj.name}",
            "progress": min(progress, 100),
            "deadline": deadline,
            "subject_id": subj.id,
        })

    # If no subjects found, return empty
    if not goals:
        goals = [{
            "id": 1,
            "title": "Complete your profile and select subjects",
            "progress": 0,
            "deadline": (datetime.now(timezone.utc) + timedelta(days=7)).date().isoformat(),
        }]

    return goals


@router.post("/sessions/start")
def start_session(
    subject_id: int,
    topic_id: int | None = None,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    session = StudySession(
        user_id=current_user.id,
        subject_id=subject_id,
        topic_id=topic_id,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"session_id": session.id, "started_at": session.started_at}


@router.post("/sessions/{session_id}/end")
def end_session(
    session_id: int,
    focus_score: float = 0,
    notes: str = "",
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    session = db.query(StudySession).filter(
        StudySession.id == session_id,
        StudySession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.ended_at = datetime.now(timezone.utc)
    delta = (session.ended_at - session.started_at).total_seconds() / 60
    session.duration_minutes = int(delta)
    session.focus_score = focus_score
    session.notes = notes
    db.commit()

    # Update topic mastery if topic was studied
    if session.topic_id:
        mastery = db.query(TopicMastery).filter(
            TopicMastery.user_id == current_user.id,
            TopicMastery.topic_id == session.topic_id,
        ).first()
        if mastery:
            # Increase mastery based on study time and focus
            boost = min(5.0, (session.duration_minutes / 30) * (1 + focus_score / 100))
            mastery.mastery = min(100, mastery.mastery + boost)
            mastery.last_reviewed = datetime.now(timezone.utc)
            mastery.forgetting_risk = "low" if mastery.mastery >= 80 else ("medium" if mastery.mastery >= 50 else "high")
        else:
            mastery = TopicMastery(
                user_id=current_user.id,
                topic_id=session.topic_id,
                mastery=min(20.0, session.duration_minutes / 3),
                forgetting_risk="high",
            )
            db.add(mastery)
        db.commit()

    # Check for study-related achievements
    from app.services.gamification import check_study_achievements
    check_study_achievements(current_user, db)

    return {"session_id": session.id, "duration_minutes": session.duration_minutes}


@router.get("/mastery")
def get_mastery(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """Return topic mastery for the student."""
    rows = (
        db.query(TopicMastery, Topic)
        .join(Topic, TopicMastery.topic_id == Topic.id)
        .filter(TopicMastery.user_id == current_user.id)
        .all()
    )

    if not rows:
        # Return empty — no fake data
        return []

    return [
        {
            "topic_id": tm.topic_id,
            "topic": topic.name,
            "subject": topic.subject.code if topic.subject else "",
            "mastery": round(tm.mastery, 1),
            "status": "mastered" if tm.mastery >= 80 else ("proficient" if tm.mastery >= 60 else ("learning" if tm.mastery >= 30 else "weak")),
            "forgetting_risk": tm.forgetting_risk,
            "last_reviewed": tm.last_reviewed.isoformat() if tm.last_reviewed else None,
        }
        for tm, topic in rows
    ]
