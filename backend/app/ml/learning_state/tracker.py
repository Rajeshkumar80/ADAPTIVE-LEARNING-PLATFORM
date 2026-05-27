"""
Learning State Tracker — combines BKT and forgetting curve for comprehensive tracking.
"""

import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional
from sqlalchemy.orm import Session

from app.ml.learning_state.bayesian import bkt
from app.ml.learning_state.forgetting import forgetting_curve

logger = logging.getLogger("adaptlearn.ml.tracker")


class LearningStateTracker:
    """
    Tracks and updates student learning states across all topics.
    Combines Bayesian Knowledge Tracing with Ebbinghaus Forgetting Curve.
    """

    def __init__(self):
        self.bkt = bkt
        self.forgetting = forgetting_curve

    def update_after_quiz(
        self,
        db: Session,
        user_id: int,
        topic_id: int,
        correct: int,
        total: int,
    ) -> Dict:
        """
        Update learning state after a quiz/test.

        Returns:
            Updated mastery info dict.
        """
        from app.models.learning_state import TopicMastery

        mastery_record = db.query(TopicMastery).filter(
            TopicMastery.user_id == user_id,
            TopicMastery.topic_id == topic_id,
        ).first()

        if not mastery_record:
            mastery_record = TopicMastery(
                user_id=user_id,
                topic_id=topic_id,
                mastery=0.0,
                forgetting_risk="high",
            )
            db.add(mastery_record)
            db.flush()

        # Current mastery as probability (0-1)
        current_p = mastery_record.mastery / 100.0

        # Update using BKT
        new_p = self.bkt.update_from_quiz(current_p, correct, total)

        # Convert back to 0-100 scale
        mastery_record.mastery = round(new_p * 100, 1)
        mastery_record.last_reviewed = datetime.now(timezone.utc)

        # Update forgetting risk
        mastery_record.forgetting_risk = "low" if new_p >= 0.8 else ("medium" if new_p >= 0.5 else "high")

        db.commit()

        return {
            "topic_id": topic_id,
            "mastery": mastery_record.mastery,
            "mastery_level": self.bkt.estimate_mastery_level(new_p),
            "forgetting_risk": mastery_record.forgetting_risk,
        }

    def update_after_study(
        self,
        db: Session,
        user_id: int,
        topic_id: int,
        duration_minutes: int,
        focus_score: float = 50.0,
    ) -> Dict:
        """Update learning state after a study session."""
        from app.models.learning_state import TopicMastery

        mastery_record = db.query(TopicMastery).filter(
            TopicMastery.user_id == user_id,
            TopicMastery.topic_id == topic_id,
        ).first()

        if not mastery_record:
            mastery_record = TopicMastery(
                user_id=user_id,
                topic_id=topic_id,
                mastery=0.0,
                forgetting_risk="high",
            )
            db.add(mastery_record)
            db.flush()

        # Boost mastery based on study time and focus
        boost = min(10.0, (duration_minutes / 30) * (1 + focus_score / 100))
        mastery_record.mastery = min(100.0, mastery_record.mastery + boost)
        mastery_record.last_reviewed = datetime.now(timezone.utc)
        mastery_record.forgetting_risk = self.forgetting.forgetting_risk(0, 24.0)

        db.commit()

        return {
            "topic_id": topic_id,
            "mastery": mastery_record.mastery,
            "boost": round(boost, 1),
        }

    def get_topics_due_for_review(
        self,
        db: Session,
        user_id: int,
        limit: int = 10,
    ) -> List[Dict]:
        """Get topics that are due for review based on forgetting curve."""
        from app.models.learning_state import TopicMastery
        from app.models.subject import Topic

        records = (
            db.query(TopicMastery, Topic)
            .join(Topic, TopicMastery.topic_id == Topic.id)
            .filter(TopicMastery.user_id == user_id)
            .all()
        )

        due_topics = []
        now = datetime.now(timezone.utc)

        for mastery_record, topic in records:
            if not mastery_record.last_reviewed:
                due_topics.append({
                    "topic_id": topic.id,
                    "topic_name": topic.name,
                    "mastery": mastery_record.mastery,
                    "urgency": "high",
                })
                continue

            hours_since = (now - mastery_record.last_reviewed).total_seconds() / 3600
            stability = max(24.0, mastery_record.mastery * 2)  # Higher mastery = slower forgetting
            retention = self.forgetting.retention(hours_since, stability)

            if retention < 0.8:
                due_topics.append({
                    "topic_id": topic.id,
                    "topic_name": topic.name,
                    "mastery": mastery_record.mastery,
                    "retention": round(retention * 100, 1),
                    "urgency": "high" if retention < 0.5 else "medium",
                    "hours_since_review": round(hours_since, 1),
                })

        # Sort by urgency (lowest retention first)
        due_topics.sort(key=lambda x: x.get("retention", 0))
        return due_topics[:limit]


# Singleton
learning_tracker = LearningStateTracker()
