"""
Study Planner endpoints — schedule, sessions, mastery.
"""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import require_student
from app.database import get_db
from app.models import StudySession, TopicMastery, Topic, User

router = APIRouter()


@router.get("/today")
def today_plan(
    _user: User = Depends(require_student),
):
    """Static plan for now — RL scheduler comes later."""
    return {
        "date": datetime.utcnow().date().isoformat(),
        "sessions": [
            {"id": 1, "time": "09:00", "subject": "Data Structures", "topic": "Trees & Graphs", "duration": 90, "status": "completed"},
            {"id": 2, "time": "11:00", "subject": "DBMS", "topic": "Normalization", "duration": 60, "status": "in-progress"},
            {"id": 3, "time": "14:00", "subject": "Operating Systems", "topic": "Quick Quiz", "duration": 30, "status": "pending"},
            {"id": 4, "time": "15:30", "subject": "Computer Networks", "topic": "TCP/IP Lab", "duration": 90, "status": "pending"},
            {"id": 5, "time": "18:00", "subject": "Software Engineering", "topic": "Review", "duration": 45, "status": "pending"},
        ],
        "total_duration": 315,
    }


@router.get("/goals")
def get_goals(
    _user: User = Depends(require_student),
):
    return [
        {"id": 1, "title": "Complete DSA Module 5", "progress": 75, "deadline": "2026-05-18"},
        {"id": 2, "title": "Practice 50 Coding Problems", "progress": 60, "deadline": "2026-05-20"},
        {"id": 3, "title": "Read OS Chapters 6-8", "progress": 40, "deadline": "2026-05-19"},
        {"id": 4, "title": "Submit SE Project", "progress": 90, "deadline": "2026-05-22"},
    ]


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

    session.ended_at = datetime.utcnow()
    delta = (session.ended_at - session.started_at).total_seconds() / 60
    session.duration_minutes = int(delta)
    session.focus_score = focus_score
    session.notes = notes
    db.commit()
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
        # Demo data when no mastery records exist yet
        topics = db.query(Topic).limit(8).all()
        return [
            {
                "topic_id": t.id,
                "topic": t.name,
                "subject": t.subject.code if t.subject else "",
                "mastery": [92, 85, 70, 45, 88, 75, 60, 35][i % 8],
                "status": ["mastered", "proficient", "learning", "weak", "mastered", "proficient", "learning", "weak"][i % 8],
                "forgetting_risk": ["low", "low", "medium", "high", "low", "low", "medium", "high"][i % 8],
            }
            for i, t in enumerate(topics)
        ]

    return [
        {
            "topic_id": tm.topic_id,
            "topic": topic.name,
            "subject": topic.subject.code if topic.subject else "",
            "mastery": tm.mastery,
            "forgetting_risk": tm.forgetting_risk,
            "last_reviewed": tm.last_reviewed,
        }
        for tm, topic in rows
    ]
