"""
Ebbinghaus Forgetting Curve — models memory retention over time.

Formula: R = e^(-t/S)
Where:
  R = retention (0-1)
  t = time since last review (hours)
  S = stability (strength of memory)
"""

import math
from datetime import datetime, timezone, timedelta
from typing import Optional


class ForgettingCurve:
    """
    Models the Ebbinghaus forgetting curve for spaced repetition scheduling.
    """

    def __init__(self, initial_stability: float = 24.0):
        """
        Args:
            initial_stability: Initial memory stability in hours.
                              Higher = slower forgetting.
        """
        self.initial_stability = initial_stability

    def retention(self, hours_since_review: float, stability: float) -> float:
        """
        Calculate current retention level.

        Args:
            hours_since_review: Hours since last review
            stability: Memory stability (increases with each review)

        Returns:
            Retention probability (0-1)
        """
        if hours_since_review <= 0:
            return 1.0
        if stability <= 0:
            stability = self.initial_stability

        r = math.exp(-hours_since_review / stability)
        return max(0.0, min(1.0, r))

    def update_stability(
        self,
        current_stability: float,
        recall_success: bool,
        difficulty: float = 0.5,
    ) -> float:
        """
        Update memory stability after a review.

        Args:
            current_stability: Current stability in hours
            recall_success: Whether the student recalled correctly
            difficulty: Topic difficulty (0-1, higher = harder)

        Returns:
            New stability value
        """
        if recall_success:
            # Successful recall increases stability
            # Harder topics get less stability boost
            multiplier = 2.0 - difficulty
            new_stability = current_stability * multiplier
        else:
            # Failed recall resets stability partially
            new_stability = current_stability * 0.5

        # Cap stability between 1 hour and 720 hours (30 days)
        return max(1.0, min(720.0, new_stability))

    def next_review_time(
        self,
        stability: float,
        target_retention: float = 0.8,
    ) -> float:
        """
        Calculate when the next review should happen.

        Args:
            stability: Current memory stability
            target_retention: Desired retention level when review triggers

        Returns:
            Hours until next review
        """
        if target_retention <= 0 or target_retention >= 1:
            target_retention = 0.8

        # R = e^(-t/S) → t = -S * ln(R)
        hours = -stability * math.log(target_retention)
        return max(1.0, hours)

    def next_review_date(
        self,
        last_reviewed: datetime,
        stability: float,
        target_retention: float = 0.8,
    ) -> datetime:
        """Calculate the next review datetime."""
        hours = self.next_review_time(stability, target_retention)
        return last_reviewed + timedelta(hours=hours)

    def forgetting_risk(
        self,
        hours_since_review: float,
        stability: float,
    ) -> str:
        """Categorize forgetting risk level."""
        r = self.retention(hours_since_review, stability)
        if r >= 0.8:
            return "low"
        elif r >= 0.5:
            return "medium"
        else:
            return "high"


# Default instance
forgetting_curve = ForgettingCurve()
