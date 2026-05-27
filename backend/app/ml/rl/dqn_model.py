"""
DQN Model — Deep Q-Network for adaptive study scheduling.

Action Space: 50 topics × 5 methods × 3 difficulties = 750 actions
State Space: temporal + academic + behavioral + schedule features
"""

import logging
from typing import List, Tuple

try:
    import numpy as np
except ImportError:
    np = None  # type: ignore

logger = logging.getLogger("adaptlearn.rl.dqn")

# State dimensions
STATE_DIM = 64  # temporal(8) + academic(32) + behavioral(16) + schedule(8)
ACTION_DIM = 750  # 50 topics × 5 methods × 3 difficulties

# Study methods
METHODS = ["reading", "quiz", "flashcard", "practice", "video"]
DIFFICULTIES = ["easy", "medium", "hard"]


class DQNModel:
    """
    Deep Q-Network for adaptive study scheduling.
    Uses PyTorch when available, falls back to numpy-based heuristic.
    """

    def __init__(self, state_dim: int = STATE_DIM, action_dim: int = ACTION_DIM):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.model = None
        self.target_model = None
        self.epsilon = 1.0  # Exploration rate
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.gamma = 0.99  # Discount factor
        self.learning_rate = 0.001
        self._initialized = False

    def initialize(self):
        """Initialize PyTorch model if available."""
        try:
            import torch
            import torch.nn as nn

            class QNetwork(nn.Module):
                def __init__(self, state_dim, action_dim):
                    super().__init__()
                    self.fc1 = nn.Linear(state_dim, 256)
                    self.fc2 = nn.Linear(256, 128)
                    self.fc3 = nn.Linear(128, 64)
                    self.fc4 = nn.Linear(64, action_dim)
                    self.relu = nn.ReLU()

                def forward(self, x):
                    x = self.relu(self.fc1(x))
                    x = self.relu(self.fc2(x))
                    x = self.relu(self.fc3(x))
                    return self.fc4(x)

            self.model = QNetwork(self.state_dim, self.action_dim)
            self.target_model = QNetwork(self.state_dim, self.action_dim)
            self.target_model.load_state_dict(self.model.state_dict())
            self._initialized = True
            logger.info("DQN model initialized with PyTorch")

        except ImportError:
            logger.warning("PyTorch not available. Using heuristic scheduler.")
            self._initialized = False

    def select_action(self, state) -> int:
        """Select action using epsilon-greedy policy."""
        if not self._initialized or np is None:
            # Fallback: random action
            import random
            return random.randint(0, self.action_dim - 1)

        import torch

        if np is not None and np.random.random() < self.epsilon:
            return np.random.randint(0, self.action_dim)

        with torch.no_grad():
            state_tensor = torch.FloatTensor(state).unsqueeze(0)
            q_values = self.model(state_tensor)
            return q_values.argmax().item()

    def decode_action(self, action_id: int, topics: List[str]) -> dict:
        """Decode action ID into (topic, method, difficulty)."""
        num_topics = min(len(topics), 50)
        if num_topics == 0:
            return {"topic": "General Review", "method": "reading", "difficulty": "medium"}

        topic_idx = action_id // (len(METHODS) * len(DIFFICULTIES))
        remainder = action_id % (len(METHODS) * len(DIFFICULTIES))
        method_idx = remainder // len(DIFFICULTIES)
        diff_idx = remainder % len(DIFFICULTIES)

        topic_idx = topic_idx % num_topics

        return {
            "topic": topics[topic_idx],
            "method": METHODS[method_idx % len(METHODS)],
            "difficulty": DIFFICULTIES[diff_idx % len(DIFFICULTIES)],
        }

    def decay_epsilon(self):
        """Decay exploration rate."""
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)


# Singleton instance
dqn_scheduler = DQNModel()
