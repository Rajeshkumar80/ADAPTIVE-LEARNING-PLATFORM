"""
Question Randomizer Service — selects and randomizes questions for each student.
Implements seed-based randomization for reproducibility and fairness.
"""

import random
from typing import List, Dict


def randomize_questions(
    question_pool: List[Dict],
    count: int = 10,
    seed: int = None,
    difficulty_distribution: Dict[str, int] = None,
) -> List[Dict]:
    """
    Select and randomize questions from a pool.

    Args:
        question_pool: List of question dicts with 'difficulty' field
        count: Number of questions to select
        seed: Random seed for reproducibility (e.g., user_id + test_id)
        difficulty_distribution: e.g., {"easy": 3, "medium": 4, "hard": 3}

    Returns:
        List of selected questions with randomized order and option order.
    """
    if seed is not None:
        rng = random.Random(seed)
    else:
        rng = random.Random()

    if not difficulty_distribution:
        difficulty_distribution = {"easy": 3, "medium": 4, "hard": 3}

    selected = []

    for difficulty, needed in difficulty_distribution.items():
        pool = [q for q in question_pool if q.get("difficulty") == difficulty]
        if len(pool) < needed:
            # If not enough questions of this difficulty, take what's available
            selected.extend(pool)
        else:
            selected.extend(rng.sample(pool, needed))

    # If we still need more questions, fill from remaining pool
    remaining_needed = count - len(selected)
    if remaining_needed > 0:
        remaining_pool = [q for q in question_pool if q not in selected]
        fill = rng.sample(remaining_pool, min(remaining_needed, len(remaining_pool)))
        selected.extend(fill)

    # Randomize question order
    rng.shuffle(selected)

    # Randomize option order for MCQs
    for q in selected:
        if q.get("options") and isinstance(q["options"], dict):
            keys = list(q["options"].keys())
            rng.shuffle(keys)
            q["shuffled_options"] = {k: q["options"][k] for k in keys}
            # Map correct answer to new position
            if q.get("correct_answer") in q["options"]:
                q["shuffled_correct"] = q["correct_answer"]

    return selected


def generate_seed(user_id: int, test_id: int) -> int:
    """Generate a deterministic seed from user and test IDs."""
    return hash(f"{user_id}-{test_id}") % (2**31)
