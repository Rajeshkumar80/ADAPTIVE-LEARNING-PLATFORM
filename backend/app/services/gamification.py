"""
Gamification Service — auto-awards certificates and achievements based on student actions.
"""

from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models import (
    User, Certificate, Achievement, TestAttempt, Test, Subject,
    StudySession, JournalEntry, TopicMastery,
)


def check_and_award_after_test(user: User, attempt: TestAttempt, db: Session):
    """Called after a test is submitted. Awards certificates and achievements."""
    test = db.query(Test).filter(Test.id == attempt.test_id).first()
    if not test:
        return

    subject = db.query(Subject).filter(Subject.id == test.subject_id).first()
    subject_name = subject.name if subject else "General"
    total_marks = sum(q.marks for q in test.questions) if test.questions else test.total_marks

    # ── Certificate: award if score >= passing marks ──
    if attempt.score >= test.passing_marks:
        score_pct = (attempt.score / total_marks * 100) if total_marks > 0 else 0

        cert_type = "completion"
        if score_pct >= 90:
            cert_type = "excellence"
        elif score_pct >= 75:
            cert_type = "achievement"

        # Don't duplicate — check if already has cert for this test
        existing = db.query(Certificate).filter(
            Certificate.user_id == user.id,
            Certificate.title == f"{test.title} — Passed",
        ).first()

        if not existing:
            cert = Certificate(
                user_id=user.id,
                title=f"{test.title} — Passed",
                subject=subject_name,
                type=cert_type,
                score=round(score_pct, 1),
            )
            db.add(cert)

    # ── Achievement: Perfect Score ──
    if attempt.score == total_marks and total_marks > 0:
        _award_achievement(db, user.id, "Perfect Score", "Got 100% on a test", "⭐", "rare")

    # ── Achievement: First Test ──
    attempt_count = db.query(TestAttempt).filter(
        TestAttempt.user_id == user.id, TestAttempt.is_completed == True
    ).count()
    if attempt_count == 1:
        _award_achievement(db, user.id, "First Steps", "Completed your first test", "🎯", "common")

    # ── Achievement: 5 Tests Completed ──
    if attempt_count == 5:
        _award_achievement(db, user.id, "Quiz Enthusiast", "Completed 5 tests", "📝", "common")

    # ── Achievement: 10 Tests Completed ──
    if attempt_count == 10:
        _award_achievement(db, user.id, "Quiz Master", "Completed 10 tests", "🧠", "rare")

    db.commit()


def check_study_achievements(user: User, db: Session):
    """Called after a study session ends. Checks for study-related achievements."""
    from datetime import timedelta

    # ── Streak check ──
    now = datetime.now(timezone.utc)
    sessions = db.query(StudySession).filter(
        StudySession.user_id == user.id,
        StudySession.ended_at.isnot(None),
    ).order_by(StudySession.started_at.desc()).all()

    if sessions:
        # Calculate consecutive days
        days = sorted(set(s.started_at.date() for s in sessions), reverse=True)
        streak = 1
        for i in range(1, len(days)):
            if (days[i - 1] - days[i]).days == 1:
                streak += 1
            else:
                break

        if streak >= 7:
            _award_achievement(db, user.id, "7-Day Streak", "Studied for 7 days in a row", "🔥", "common")
        if streak >= 30:
            _award_achievement(db, user.id, "Monthly Warrior", "30-day study streak", "💪", "epic")

    # ── Night Owl ──
    if sessions and sessions[0].started_at.hour >= 23:
        _award_achievement(db, user.id, "Night Owl", "Studied past 11 PM", "🌙", "common")

    # ── Total hours ──
    total_minutes = sum((s.duration_minutes or 0) for s in sessions)
    if total_minutes >= 600:  # 10 hours
        _award_achievement(db, user.id, "Dedicated Learner", "10+ hours of study", "📚", "common")
    if total_minutes >= 3000:  # 50 hours
        _award_achievement(db, user.id, "Knowledge Seeker", "50+ hours of study", "🎓", "rare")

    db.commit()


def check_journal_achievements(user: User, db: Session):
    """Called after a journal entry is created."""
    count = db.query(JournalEntry).filter(JournalEntry.user_id == user.id).count()

    if count == 1:
        _award_achievement(db, user.id, "First Entry", "Created your first journal entry", "✏️", "common")
    if count == 10:
        _award_achievement(db, user.id, "Journaler", "10 journal entries", "📓", "common")
    if count == 20:
        _award_achievement(db, user.id, "Code Warrior", "20 journal entries", "⚔️", "epic")
    if count == 50:
        _award_achievement(db, user.id, "Prolific Writer", "50 journal entries", "🖊️", "legendary")

    db.commit()


def _award_achievement(db: Session, user_id: int, title: str, description: str, icon: str, rarity: str):
    """Award an achievement if not already earned."""
    existing = db.query(Achievement).filter(
        Achievement.user_id == user_id,
        Achievement.title == title,
    ).first()
    if not existing:
        db.add(Achievement(
            user_id=user_id,
            title=title,
            description=description,
            icon=icon,
            rarity=rarity,
        ))
