"""
RL Environment — simulates the learning environment for DQN training.
"""

try:
    import numpy as np
except ImportError:
    np = None  # type: ignore

from typing import Dict, Tuple
from datetime import datetime, timezone

if np is None:
    pass  # Will fail at runtime if used without numpy


class LearningEnvironment:
    """
    Reinforcement Learning environment for adaptive study scheduling.

    State: [temporal_features, academic_features, behavioral_features, schedule_features]
    Action: (topic_id, method, difficulty)
    Reward: learning_gain + retention + test_score_improvement + consistency
    """

    def __init__(self, num_topics: int = 50):
        self.num_topics = num_topics
        self.state_dim = 64
        self.current_state = None
        self.step_count = 0
        self.episode_reward = 0.0

    def reset(self, user_state: Dict = None) -> np.ndarray:
        """Reset environment and return initial state."""
        self.step_count = 0
        self.episode_reward = 0.0

        if user_state:
            self.current_state = self._encode_state(user_state)
        else:
            self.current_state = np.zeros(self.state_dim)

        return self.current_state

    def step(self, action: int, outcome: Dict = None) -> Tuple[np.ndarray, float, bool, Dict]:
        """
        Take an action and return (next_state, reward, done, info).

        Args:
            action: Action ID (encoded topic + method + difficulty)
            outcome: Dict with actual learning outcome (mastery_change, time_spent, etc.)

        Returns:
            Tuple of (next_state, reward, done, info)
        """
        self.step_count += 1

        # Calculate reward
        reward = self._calculate_reward(outcome or {})
        self.episode_reward += reward

        # Update state
        next_state = self._update_state(action, outcome)
        self.current_state = next_state

        # Episode ends after max steps or goal reached
        done = self.step_count >= 20  # Max 20 study sessions per episode

        info = {
            "step": self.step_count,
            "episode_reward": self.episode_reward,
        }

        return next_state, reward, done, info

    def _encode_state(self, user_state: Dict) -> np.ndarray:
        """Encode user state into a fixed-size vector."""
        state = np.zeros(self.state_dim)

        # Temporal features (8 dims): hour, day_of_week, time_since_last_study, etc.
        now = datetime.now(timezone.utc)
        state[0] = now.hour / 24.0
        state[1] = now.weekday() / 7.0
        state[2] = user_state.get("hours_since_last_study", 0) / 48.0
        state[3] = user_state.get("sessions_today", 0) / 10.0

        # Academic features (32 dims): mastery levels per topic
        masteries = user_state.get("topic_masteries", [])
        for i, m in enumerate(masteries[:32]):
            state[8 + i] = m / 100.0

        # Behavioral features (16 dims): study patterns
        state[40] = user_state.get("avg_focus_score", 0) / 100.0
        state[41] = user_state.get("avg_session_duration", 0) / 120.0
        state[42] = user_state.get("streak_days", 0) / 30.0
        state[43] = user_state.get("quiz_accuracy", 0) / 100.0

        # Schedule features (8 dims): available time, deadlines
        state[56] = user_state.get("available_hours", 4) / 8.0
        state[57] = user_state.get("upcoming_tests", 0) / 5.0
        state[58] = user_state.get("days_to_exam", 30) / 60.0

        return state

    def _update_state(self, action: int, outcome: Dict) -> np.ndarray:
        """Update state based on action taken and outcome."""
        next_state = self.current_state.copy()

        if outcome:
            # Update mastery for the studied topic
            topic_idx = action // 15  # 5 methods × 3 difficulties
            if 8 + topic_idx < 40:
                mastery_gain = outcome.get("mastery_change", 0) / 100.0
                next_state[8 + topic_idx] = min(1.0, next_state[8 + topic_idx] + mastery_gain)

            # Update behavioral features
            next_state[40] = outcome.get("focus_score", next_state[40] * 100) / 100.0
            next_state[3] = min(1.0, next_state[3] + 0.1)  # sessions_today

        return next_state

    def _calculate_reward(self, outcome: Dict) -> float:
        """
        Calculate reward based on learning outcome.

        Reward components:
        - Learning gain (mastery improvement)
        - Retention (spaced repetition bonus)
        - Test score improvement
        - Consistency (streak bonus)
        """
        reward = 0.0

        # Learning gain: +1 for each % mastery gained
        mastery_change = outcome.get("mastery_change", 0)
        reward += mastery_change * 0.1

        # Focus bonus
        focus = outcome.get("focus_score", 50)
        reward += (focus - 50) * 0.01

        # Completion bonus
        if outcome.get("completed", False):
            reward += 0.5

        # Penalty for skipping
        if outcome.get("skipped", False):
            reward -= 1.0

        return reward
