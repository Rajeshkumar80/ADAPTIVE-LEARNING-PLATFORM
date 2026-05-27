"""
Topic Extractor — extracts topics and key concepts from text/PDFs.
"""

import logging
import re
from typing import List, Dict

logger = logging.getLogger("adaptlearn.nlp.topics")


def extract_topics_from_text(text: str) -> List[Dict]:
    """
    Extract topics from syllabus or textbook text.
    Uses pattern matching and heuristics.

    Returns:
        List of dicts with 'name', 'module', 'difficulty_estimate'
    """
    topics = []
    lines = text.split("\n")
    current_module = 1

    for line in lines:
        line = line.strip()
        if not line or len(line) < 3:
            continue

        # Detect module/unit headers
        module_match = re.match(r"(?:module|unit|chapter)\s*(\d+)", line, re.IGNORECASE)
        if module_match:
            current_module = int(module_match.group(1))
            continue

        # Detect numbered topics: "1.1 Topic Name", "1. Topic Name"
        topic_match = re.match(r"^\d+\.?\d*\.?\s+(.+)", line)
        if topic_match and len(topic_match.group(1)) > 5:
            topic_name = topic_match.group(1).strip(".:- ")
            topics.append({
                "name": topic_name,
                "module": current_module,
                "difficulty_estimate": _estimate_difficulty(topic_name),
            })
            continue

        # Detect bullet points or dashes
        bullet_match = re.match(r"^[-•*]\s+(.+)", line)
        if bullet_match and len(bullet_match.group(1)) > 5:
            topic_name = bullet_match.group(1).strip(".:- ")
            topics.append({
                "name": topic_name,
                "module": current_module,
                "difficulty_estimate": _estimate_difficulty(topic_name),
            })

    return topics[:100]  # Cap at 100 topics


def extract_keywords(text: str, top_n: int = 20) -> List[str]:
    """Extract key terms from text using TF-based approach."""
    # Simple keyword extraction without external dependencies
    words = re.findall(r"\b[a-zA-Z]{4,}\b", text.lower())

    # Remove common stop words
    stop_words = {
        "this", "that", "with", "from", "have", "been", "will", "would",
        "could", "should", "their", "there", "which", "about", "these",
        "those", "other", "some", "more", "also", "than", "then",
        "when", "what", "where", "each", "every", "both", "such",
    }
    words = [w for w in words if w not in stop_words]

    # Count frequencies
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1

    # Sort by frequency
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [w for w, _ in sorted_words[:top_n]]


def _estimate_difficulty(topic_name: str) -> str:
    """Estimate topic difficulty based on keywords."""
    hard_keywords = [
        "advanced", "complex", "optimization", "dynamic", "concurrent",
        "distributed", "algorithm", "theorem", "proof", "analysis",
        "NP-hard", "recursion", "backtracking",
    ]
    easy_keywords = [
        "introduction", "basic", "overview", "definition", "simple",
        "fundamental", "elementary", "getting started",
    ]

    name_lower = topic_name.lower()

    if any(kw in name_lower for kw in hard_keywords):
        return "hard"
    elif any(kw in name_lower for kw in easy_keywords):
        return "easy"
    return "medium"
