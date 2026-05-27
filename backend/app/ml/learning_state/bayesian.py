"""
Bayesian Knowledge Tracing — estimates student mastery probability.

Based on the BKT model:
- P(L): probability of learning (mastery)
- P(T): probability of transitioning from unlearned to learned
- P(G): probability of guessing correctly
- P(S): probability of slipping (knowing but answering wrong)
"""

from typing import Dict


class BayesianKnowledgeTracer:
    """
    Implements Bayesian Knowledge Tracing for topic mastery estimation.
    """

    def __init__(
        self,
        p_init: float = 0.1,   # Initial probability of mastery
        p_transit: float = 0.1,  # Probability of learning per opportunity
        p_guess: float = 0.25,   # Probability of guessing correctly
        p_slip: float = 0.1,     # Probability of slipping
    ):
        self.p_init = p_init
        self.p_transit = p_transit
        self.p_guess = p_guess
        self.p_slip = p_slip

    def update(self, p_mastery: float, is_correct: bool) -> float:
        """
        Update mastery probability based on a single observation.

        Args:
            p_mastery: Current probability of mastery (0-1)
            is_correct: Whether the student answered correctly

        Returns:
            Updated probability of mastery
        """
        if is_correct:
            # P(L|correct) = P(correct|L) * P(L) / P(correct)
            p_correct_given_learned = 1 - self.p_slip
            p_correct_given_unlearned = self.p_guess
            p_correct = (p_correct_given_learned * p_mastery +
                        p_correct_given_unlearned * (1 - p_mastery))

            p_learned_given_correct = (p_correct_given_learned * p_mastery) / p_correct
        else:
            # P(L|incorrect) = P(incorrect|L) * P(L) / P(incorrect)
            p_incorrect_given_learned = self.p_slip
            p_incorrect_given_unlearned = 1 - self.p_guess
            p_incorrect = (p_incorrect_given_learned * p_mastery +
                          p_incorrect_given_unlearned * (1 - p_mastery))

            p_learned_given_correct = (p_incorrect_given_learned * p_mastery) / p_incorrect

        # Apply learning transition
        p_new = p_learned_given_correct + (1 - p_learned_given_correct) * self.p_transit

        return min(0.99, max(0.01, p_new))

    def update_from_quiz(self, p_mastery: float, correct: int, total: int) -> float:
        """
        Update mastery from a quiz result (multiple questions).

        Args:
            p_mastery: Current mastery probability
            correct: Number of correct answers
            total: Total questions

        Returns:
            Updated mastery probability
        """
        p = p_mastery
        for i in range(total):
            is_correct = i < correct
            p = self.update(p, is_correct)
        return p

    def estimate_mastery_level(self, p_mastery: float) -> str:
        """Convert probability to human-readable mastery level."""
        if p_mastery >= 0.9:
            return "mastered"
        elif p_mastery >= 0.7:
            return "proficient"
        elif p_mastery >= 0.4:
            return "learning"
        else:
            return "weak"

    def get_confidence(self, p_mastery: float, num_observations: int) -> float:
        """
        Calculate confidence in the mastery estimate.
        More observations = higher confidence.
        """
        # Confidence increases with observations, capped at 0.95
        confidence = 1 - (1 / (1 + num_observations * 0.3))
        return min(0.95, confidence)


# Default tracer instance
bkt = BayesianKnowledgeTracer()
