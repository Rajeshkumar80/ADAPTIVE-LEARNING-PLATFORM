"""
Adaptive Scheduler — uses DQN or heuristic fallback to generate study plans.
"""

import logging
from typing import List, Dict
from datetime import datetime, timezone

logger = logging.getLogger("adaptlearn.rl.scheduler")


class AdaptiveScheduler:
    """
    Generates personalized study schedules.
    Uses RL model when trained, falls back to heuristic otherwise.
    """

    def __init__(self):
        self.use_rl = False
        self.dqn = None

    def initialize_rl(self):
        """Try to initialize the RL model."""
        try:
            from app.ml.rl.dqn_model import dqn_scheduler
            dqn_scheduler.initialize()
            self.dqn = dqn_scheduler
            self.use_rl = True
            logger.info("RL scheduler initialized")
        except Exception as e:
            logger.warning(f"RL initialization failed, using heuristic: {e}")
            self.use_rl = False

    def generate_schedule(
        self,
        user_state: Dict,
        topics: List[str],
        available_hours: float = 4.0,
        weak_topics: List[str] = None,
    ) -> List[Dict]:
        """
        Generate a personalized study schedule.

        Args:
            user_state: Current user learning state
            topics: Available topics to study
            available_hours: Hours available for study
            weak_topics: Topics that need extra attention

        Returns:
            List of study session recommendations
        """
        if self.use_rl and self.dqn:
            return self._rl_schedule(user_state, topics, available_hours)
        else:
            return self._heuristic_schedule(topics, available_hours, weak_topics)

    def _rl_schedule(
        self, user_state: Dict, topics: List[str], available_hours: float
    ) -> List[Dict]:
        """Generate schedule using trained DQN model."""
        from app.ml.rl.environment import LearningEnvironment
        import numpy as np

        env = LearningEnvironment(num_topics=len(topics))
        state = env.reset(user_state)

        sessions = []
        total_minutes = 0
        max_minutes = int(available_hours * 60)

        while total_minutes < max_minutes and len(sessions) < 8:
            action = self.dqn.select_action(state)
            decoded = self.dqn.decode_action(action, topics)

            duration = self._estimate_duration(decoded["method"], decoded["difficulty"])
            if total_minutes + duration > max_minutes:
                break

            hour = 9 + (total_minutes // 60)
            minute = total_minutes % 60

            sessions.append({
                "time": f"{hour:02d}:{minute:02d}",
                "topic": decoded["topic"],
                "subject": decoded["topic"],
                "method": decoded["method"],
                "difficulty": decoded["difficulty"],
                "duration": duration,
                "activity": decoded["method"],
            })

            total_minutes += duration
            state, _, done, _ = env.step(action, {"completed": True, "mastery_change": 5})
            if done:
                break

        return sessions

    def _heuristic_schedule(
        self,
        topics: List[str],
        available_hours: float,
        weak_topics: List[str] = None,
    ) -> List[Dict]:
        """Generate schedule using heuristic rules."""
        sessions = []
        total_minutes = 0
        max_minutes = int(available_hours * 60)

        # Prioritize weak topics
        priority_topics = (weak_topics or []) + [t for t in topics if t not in (weak_topics or [])]

        methods = ["study", "practice", "review", "quiz"]
        hour = 9

        for i, topic in enumerate(priority_topics[:8]):
            if total_minutes >= max_minutes:
                break

            duration = 45 if i < len(weak_topics or []) else 30
            if total_minutes + duration > max_minutes:
                duration = max_minutes - total_minutes

            method = methods[i % len(methods)]

            sessions.append({
                "time": f"{hour:02d}:{total_minutes % 60:02d}",
                "topic": topic,
                "subject": topic,
                "duration": duration,
                "activity": method,
            })

            total_minutes += duration
            hour = 9 + (total_minutes // 60)

        return sessions

    def _estimate_duration(self, method: str, difficulty: str) -> int:
        """Estimate session duration based on method and difficulty."""
        base = {"reading": 45, "quiz": 20, "flashcard": 15, "practice": 40, "video": 30}
        multiplier = {"easy": 0.8, "medium": 1.0, "hard": 1.3}
        return int(base.get(method, 30) * multiplier.get(difficulty, 1.0))


# Singleton
adaptive_scheduler = AdaptiveScheduler()
