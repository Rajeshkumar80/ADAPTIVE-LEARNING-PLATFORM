"""
SM-2 Spaced Repetition Algorithm — core adaptive scheduling logic.
Used to determine when a student should review a topic next.

Algorithm: SuperMemo 2 (SM-2)
- ease_factor starts at 2.5
- interval: 1 → 6 → calculated
- quality: 0-5 (5=perfect, 3=correct with difficulty, 0=blackout)
"""

from datetime import datetime, timezone, timedelta
from typing import Tuple
from sqlalchemy.orm import Session

from app.models import TopicMastery


def update_sm2(
    repetitions: int,
    ease_factor: float,
    interval: int,
    quality: int,  # 0-5
) -> Tuple[int, float, int]:
    """
    SM-2 algorithm implementation.
    Returns (new_repetitions, new_ease_factor, new_interval_days)

    quality scale:
      5 — perfect response, no hesitation
      4 — correct after brief hesitation
      3 — correct with serious difficulty
      2 — incorrect but close
      1 — incorrect, remembered upon seeing answer
      0 — complete blackout
    """
    # Clamp quality to valid range
    quality = max(0, min(5, quality))

    if quality >= 3:
        # Correct response
        if repetitions == 0:
            new_interval = 1
        elif repetitions == 1:
            new_interval = 6
        else:
            new_interval = round(interval * ease_factor)
        new_repetitions = repetitions + 1
    else:
        # Incorrect response — reset
        new_repetitions = 0
        new_interval = 1

    # Update ease factor
    new_ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    new_ease_factor = max(1.3, new_ease_factor)

    return new_repetitions, new_ease_factor, new_interval


def quality_from_score(score_percent: float) -> int:
    """Convert a percentage score (0-100) to SM-2 quality (0-5)."""
    if score_percent >= 95:
        return 5
    elif score_percent >= 80:
        return 4
    elif score_percent >= 60:
        return 3
    elif score_percent >= 40:
        return 2
    elif score_percent >= 20:
        return 1
    else:
        return 0


def get_due_topics(db: Session, user_id: int) -> list:
    """Get all topics due for review today (next_review <= now)."""
    now = datetime.now(timezone.utc)
    due = db.query(TopicMastery).filter(
        TopicMastery.user_id == user_id,
        TopicMastery.last_reviewed <= now - timedelta(days=1),
    ).all()
    return due


def update_learning_state(
    db: Session,
    user_id: int,
    topic_id: int,
    score_percent: float,
) -> dict:
    """
    Update a user's learning state for a topic after a study session or quiz.
    Uses SM-2 to calculate next review interval.

    Returns updated state dict.
    """
    mastery = db.query(TopicMastery).filter(
        TopicMastery.user_id == user_id,
        TopicMastery.topic_id == topic_id,
    ).first()

    quality = quality_from_score(score_percent)

    if not mastery:
        # First time studying this topic
        mastery = TopicMastery(
            user_id=user_id,
            topic_id=topic_id,
            mastery=score_percent,
            forgetting_risk="high",
        )
        db.add(mastery)
        db.flush()

        # Initial SM-2 values
        repetitions = 0
        ease_factor = 2.5
        interval = 0
    else:
        # Extract current SM-2 state from mastery
        # We store ease_factor in mastery/100 scale and interval via forgetting_risk
        repetitions = int(mastery.mastery / 20)  # rough mapping
        ease_factor = max(1.3, 2.5 - (100 - mastery.mastery) * 0.01)
        interval = 1 if mastery.forgetting_risk == "high" else (6 if mastery.forgetting_risk == "medium" else 14)

    # Run SM-2
    new_reps, new_ef, new_interval = update_sm2(repetitions, ease_factor, interval, quality)

    # Update mastery record
    # Convert back: mastery score is a blend of SM-2 state and raw score
    new_mastery = min(100, mastery.mastery * 0.7 + score_percent * 0.3) if mastery.mastery else score_percent
    mastery.mastery = round(new_mastery, 1)
    mastery.last_reviewed = datetime.now(timezone.utc)

    # Set forgetting risk based on interval
    if new_interval >= 14:
        mastery.forgetting_risk = "low"
    elif new_interval >= 6:
        mastery.forgetting_risk = "medium"
    else:
        mastery.forgetting_risk = "high"

    db.commit()

    return {
        "topic_id": topic_id,
        "mastery": mastery.mastery,
        "quality": quality,
        "new_interval_days": new_interval,
        "new_ease_factor": round(new_ef, 2),
        "new_repetitions": new_reps,
        "forgetting_risk": mastery.forgetting_risk,
        "next_review": (datetime.now(timezone.utc) + timedelta(days=new_interval)).isoformat(),
    }
