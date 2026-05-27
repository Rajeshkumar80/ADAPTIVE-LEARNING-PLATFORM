"""
Embeddings Service — generates vector embeddings for semantic search.
Uses sentence-transformers when available, falls back to simple TF-IDF.
"""

import logging
from typing import List, Optional

try:
    import numpy as np
except ImportError:
    np = None  # type: ignore

logger = logging.getLogger("adaptlearn.nlp.embeddings")

_model = None


def get_model():
    """Load sentence-transformers model (lazy initialization)."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("Loaded sentence-transformers model: all-MiniLM-L6-v2")
        except ImportError:
            logger.warning("sentence-transformers not installed. Using fallback.")
            _model = "fallback"
    return _model


def embed_text(text: str) -> List[float]:
    """Generate embedding vector for a text string."""
    model = get_model()

    if model == "fallback":
        return _simple_embedding(text)

    embedding = model.encode(text)
    return embedding.tolist()


def embed_batch(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a batch of texts."""
    model = get_model()

    if model == "fallback":
        return [_simple_embedding(t) for t in texts]

    embeddings = model.encode(texts)
    return embeddings.tolist()


def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    a = np.array(vec_a)
    b = np.array(vec_b)

    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return float(dot / (norm_a * norm_b))


def find_similar(
    query: str,
    documents: List[str],
    top_k: int = 5,
) -> List[dict]:
    """
    Find most similar documents to a query.

    Returns:
        List of dicts with 'index', 'text', 'similarity'
    """
    query_embedding = embed_text(query)
    doc_embeddings = embed_batch(documents)

    similarities = [
        cosine_similarity(query_embedding, doc_emb)
        for doc_emb in doc_embeddings
    ]

    # Sort by similarity
    ranked = sorted(
        enumerate(similarities),
        key=lambda x: x[1],
        reverse=True,
    )[:top_k]

    return [
        {
            "index": idx,
            "text": documents[idx][:200],
            "similarity": round(sim, 4),
        }
        for idx, sim in ranked
    ]


def _simple_embedding(text: str, dim: int = 384) -> List[float]:
    """
    Simple fallback embedding using character-level hashing.
    Not suitable for production but allows the system to function.
    """
    embedding = np.zeros(dim)
    words = text.lower().split()

    for i, word in enumerate(words):
        for j, char in enumerate(word):
            idx = (hash(f"{word}_{j}") % dim)
            embedding[idx] += 1.0 / (i + 1)

    # Normalize
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding = embedding / norm

    return embedding.tolist()
