"""
Tests for SM-2 Spaced Repetition Algorithm.
"""
import pytest
from app.services.scheduler import update_sm2, quality_from_score


class TestSM2Algorithm:
    """Test the core SM-2 algorithm."""

    def test_first_correct_response_interval_is_1(self):
        reps, ef, interval = update_sm2(0, 2.5, 0, 4)
        assert interval == 1
        assert reps == 1

    def test_second_correct_response_interval_is_6(self):
        reps, ef, interval = update_sm2(1, 2.5, 1, 4)
        assert interval == 6
        assert reps == 2

    def test_third_correct_response_uses_ease_factor(self):
        reps, ef, interval = update_sm2(2, 2.5, 6, 4)
        assert interval == 15  # round(6 * 2.5) = 15
        assert reps == 3

    def test_perfect_response_increases_ease_factor(self):
        _, ef, _ = update_sm2(2, 2.5, 6, 5)
        assert ef > 2.5

    def test_hard_response_decreases_ease_factor(self):
        _, ef, _ = update_sm2(2, 2.5, 6, 3)
        assert ef < 2.5

    def test_incorrect_response_resets_repetitions(self):
        reps, _, interval = update_sm2(5, 2.5, 30, 2)
        assert reps == 0
        assert interval == 1

    def test_blackout_resets_everything(self):
        reps, _, interval = update_sm2(10, 2.8, 60, 0)
        assert reps == 0
        assert interval == 1

    def test_ease_factor_never_below_1_3(self):
        _, ef, _ = update_sm2(0, 1.3, 1, 0)
        assert ef >= 1.3

    def test_quality_5_gives_max_ease_boost(self):
        _, ef5, _ = update_sm2(2, 2.5, 6, 5)
        _, ef3, _ = update_sm2(2, 2.5, 6, 3)
        assert ef5 > ef3

    def test_interval_grows_with_repetitions(self):
        _, _, i1 = update_sm2(0, 2.5, 0, 4)
        _, _, i2 = update_sm2(1, 2.5, i1, 4)
        _, ef, i3 = update_sm2(2, 2.5, i2, 4)
        _, _, i4 = update_sm2(3, ef, i3, 4)
        assert i1 < i2 < i3 < i4


class TestQualityFromScore:
    """Test score to quality conversion."""

    def test_perfect_score(self):
        assert quality_from_score(100) == 5

    def test_high_score(self):
        assert quality_from_score(85) == 4

    def test_passing_score(self):
        assert quality_from_score(65) == 3

    def test_low_score(self):
        assert quality_from_score(45) == 2

    def test_very_low_score(self):
        assert quality_from_score(25) == 1

    def test_zero_score(self):
        assert quality_from_score(0) == 0
