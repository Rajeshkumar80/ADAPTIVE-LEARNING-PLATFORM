"""
ML Tasks — background machine learning operations.
"""

import logging
from typing import Dict

logger = logging.getLogger("adaptlearn.tasks.ml")


def update_learning_states(user_id: int) -> Dict:
    """
    Recalculate all learning states for a user.
    Updates forgetting risk based on time since last review.
    """
    from datetime import datetime, timezone
    from app.database import SessionLocal
    from app.models.learning_state import TopicMastery
    from app.ml.learning_state.forgetting import forgetting_curve

    db = SessionLocal()
    try:
        records = db.query(TopicMastery).filter(
            TopicMastery.user_id == user_id
        ).all()

        updated = 0
        now = datetime.now(timezone.utc)

        for record in records:
            if record.last_reviewed:
                hours_since = (now - record.last_reviewed).total_seconds() / 3600
                stability = max(24.0, record.mastery * 2)
                risk = forgetting_curve.forgetting_risk(hours_since, stability)

                if risk != record.forgetting_risk:
                    record.forgetting_risk = risk
                    updated += 1

        db.commit()
        logger.info(f"Updated {updated} learning states for user {user_id}")
        return {"user_id": user_id, "updated": updated}

    finally:
        db.close()


def retrain_scheduler(episodes: int = 100) -> Dict:
    """
    Retrain the RL scheduler model.
    Collects recent user data and runs training episodes.
    """
    logger.info(f"Starting RL scheduler retraining ({episodes} episodes)")

    try:
        from app.ml.rl.dqn_model import dqn_scheduler
        from app.ml.rl.environment import LearningEnvironment
        from app.ml.rl.trainer import DQNTrainer
        import numpy as np

        dqn_scheduler.initialize()
        env = LearningEnvironment()
        trainer = DQNTrainer()

        total_reward = 0

        for episode in range(episodes):
            state = env.reset()
            episode_reward = 0

            for step in range(20):
                action = dqn_scheduler.select_action(state)
                next_state, reward, done, info = env.step(action, {
                    "completed": True,
                    "mastery_change": np.random.uniform(1, 10),
                    "focus_score": np.random.uniform(40, 90),
                })

                trainer.add_experience(state, action, reward, next_state, done)
                state = next_state
                episode_reward += reward

                if done:
                    break

            total_reward += episode_reward
            dqn_scheduler.decay_epsilon()

        stats = trainer.get_training_stats()
        stats["total_episodes"] = episodes
        stats["avg_reward"] = total_reward / episodes

        logger.info(f"RL retraining complete: avg_reward={stats['avg_reward']:.2f}")
        return stats

    except Exception as e:
        logger.error(f"RL retraining failed: {e}")
        return {"error": str(e)}
