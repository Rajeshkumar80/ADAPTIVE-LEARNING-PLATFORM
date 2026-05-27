"""
PDF Processing Tasks — background processing of uploaded PDFs.
Extracts text, topics, and generates embeddings.
"""

import logging
from typing import Dict

logger = logging.getLogger("adaptlearn.tasks.pdf")


def process_pdf(file_path: str, subject_id: int = None) -> Dict:
    """
    Process an uploaded PDF file:
    1. Extract text
    2. Extract topics
    3. Generate embeddings for semantic search
    4. Store in database

    Args:
        file_path: Path to the uploaded PDF
        subject_id: Optional subject to associate with

    Returns:
        Processing result dict
    """
    from app.services.pdf_parser import extract_text, extract_topics, chunk_text

    logger.info(f"Processing PDF: {file_path}")

    # Step 1: Extract text
    text = extract_text(file_path)
    if not text:
        return {"success": False, "error": "Could not extract text from PDF"}

    # Step 2: Extract topics
    topics = extract_topics(text)
    logger.info(f"Extracted {len(topics)} topics from PDF")

    # Step 3: Chunk text for embeddings
    chunks = chunk_text(text, chunk_size=1000, overlap=200)
    logger.info(f"Created {len(chunks)} text chunks")

    # Step 4: Generate embeddings (if available)
    embeddings = []
    try:
        from app.ml.nlp.embeddings import embed_batch
        embeddings = embed_batch(chunks[:50])  # Limit to 50 chunks
        logger.info(f"Generated {len(embeddings)} embeddings")
    except Exception as e:
        logger.warning(f"Embedding generation skipped: {e}")

    return {
        "success": True,
        "file_path": file_path,
        "text_length": len(text),
        "topics_found": len(topics),
        "topics": topics[:20],
        "chunks_created": len(chunks),
        "embeddings_generated": len(embeddings),
    }


def extract_syllabus_topics(file_path: str) -> Dict:
    """
    Extract structured syllabus topics from a PDF.
    Specifically designed for VTU syllabus format.
    """
    from app.services.pdf_parser import extract_text
    from app.ml.nlp.topic_extractor import extract_topics_from_text

    text = extract_text(file_path)
    if not text:
        return {"success": False, "error": "Could not extract text"}

    topics = extract_topics_from_text(text)

    return {
        "success": True,
        "topics": topics,
        "total_topics": len(topics),
    }
