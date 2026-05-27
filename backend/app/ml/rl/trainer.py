"""
DQN Trainer — training pipeline for the RL scheduler.
"""

import logging
from typing import List, Tuple
from collections import deque

try:
    import numpy as np
except ImportError:
    np = None  # type: ignore

logger = logging.getLogger("adaptlearn.rl.trainer")


class ReplayBuffer:
    """Experience replay buffer for DQN training."""

    def __init__(self, capacity: int = 10000):
        self.buffer = deque(maxlen=capacity)

    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))

    def sample(self, batch_size: int) -> List[Tuple]:
        indices = np.random.choice(len(self.buffer), batch_size, replace=False)
        return [self.buffer[i] for i in indices]

    def __len__(self):
        return len(self.buffer)


class DQNTrainer:
    """
    Training pipeline for the DQN adaptive scheduler.
    Supports offline training from collected user data.
    """

    def __init__(
        self,
        state_dim: int = 64,
        action_dim: int = 750,
        batch_size: int = 64,
        buffer_size: int = 10000,
        target_update_freq: int = 100,
    ):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.batch_size = batch_size
        self.replay_buffer = ReplayBuffer(buffer_size)
        self.target_update_freq = target_update_freq
        self.train_step = 0
        self.losses = []

    def add_experience(self, state, action, reward, next_state, done):
        """Add a training experience to the replay buffer."""
        self.replay_buffer.push(state, action, reward, next_state, done)

    def train_step_fn(self, model, target_model, optimizer) -> float:
        """Perform one training step. Returns loss value."""
        if len(self.replay_buffer) < self.batch_size:
            return 0.0

        try:
            import torch
            import torch.nn.functional as F
        except ImportError:
            logger.warning("PyTorch not available for training")
            return 0.0

        batch = self.replay_buffer.sample(self.batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)

        states = torch.FloatTensor(np.array(states))
        actions = torch.LongTensor(actions)
        rewards = torch.FloatTensor(rewards)
        next_states = torch.FloatTensor(np.array(next_states))
        dones = torch.FloatTensor(dones)

        # Current Q values
        current_q = model(states).gather(1, actions.unsqueeze(1)).squeeze()

        # Target Q values
        with torch.no_grad():
            next_q = target_model(next_states).max(1)[0]
            target_q = rewards + (1 - dones) * 0.99 * next_q

        # Loss and backprop
        loss = F.mse_loss(current_q, target_q)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        self.train_step += 1
        loss_val = loss.item()
        self.losses.append(loss_val)

        # Update target network
        if self.train_step % self.target_update_freq == 0:
            target_model.load_state_dict(model.state_dict())
            logger.info(f"Target network updated at step {self.train_step}")

        return loss_val

    def get_training_stats(self) -> dict:
        """Get training statistics."""
        return {
            "total_steps": self.train_step,
            "buffer_size": len(self.replay_buffer),
            "avg_loss": np.mean(self.losses[-100:]) if self.losses else 0.0,
            "min_loss": min(self.losses[-100:]) if self.losses else 0.0,
        }
