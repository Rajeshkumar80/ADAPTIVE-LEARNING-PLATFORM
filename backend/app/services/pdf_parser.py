"""
PDF Parser Service — extracts text, topics, and structure from uploaded PDFs.
Uses PyMuPDF (fitz) for extraction.
"""

import logging
from typing import List, Dict, Optional

logger = logging.getLogger("adaptlearn.pdf")


def extract_text(file_path: str) -> str:
    """Extract all text from a PDF file."""
    try:
        import fitz  # PyMuPDF

        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text() + "\n"
        doc.close()
        return text.strip()
    except ImportError:
        logger.warning("PyMuPDF not installed. Install with: pip install PyMuPDF")
        return ""
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        return ""


def extract_pages(file_path: str) -> List[Dict]:
    """Extract text page by page with metadata."""
    try:
        import fitz

        doc = fitz.open(file_path)
        pages = []
        for i, page in enumerate(doc):
            pages.append({
                "page_number": i + 1,
                "text": page.get_text(),
                "word_count": len(page.get_text().split()),
            })
        doc.close()
        return pages
    except ImportError:
        logger.warning("PyMuPDF not installed")
        return []
    except Exception as e:
        logger.error(f"PDF page extraction error: {e}")
        return []


def extract_topics(text: str) -> List[str]:
    """
    Extract topic headings from PDF text using heuristics.
    Looks for numbered sections, bold text patterns, and capitalized lines.
    """
    topics = []
    lines = text.split("\n")

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Match numbered sections: "1.", "1.1", "Module 1:", etc.
        if (
            (len(line) < 100)
            and (
                line[0].isdigit()
                or line.upper().startswith("MODULE")
                or line.upper().startswith("UNIT")
                or line.upper().startswith("CHAPTER")
            )
        ):
            # Clean up the topic name
            topic = line.strip(".:- ")
            if len(topic) > 5:
                topics.append(topic)

        # Match ALL CAPS lines (likely headings)
        elif line.isupper() and 5 < len(line) < 80:
            topics.append(line.title())

    return topics[:50]  # Cap at 50 topics


def get_pdf_metadata(file_path: str) -> Dict:
    """Get PDF metadata (title, author, pages, etc.)."""
    try:
        import fitz

        doc = fitz.open(file_path)
        metadata = doc.metadata
        info = {
            "title": metadata.get("title", ""),
            "author": metadata.get("author", ""),
            "subject": metadata.get("subject", ""),
            "pages": doc.page_count,
            "file_path": file_path,
        }
        doc.close()
        return info
    except ImportError:
        return {"error": "PyMuPDF not installed"}
    except Exception as e:
        return {"error": str(e)}


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """
    Split text into overlapping chunks for embedding.
    Used for vector database ingestion.
    """
    if not text:
        return []

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]

        # Try to break at sentence boundary
        if end < len(text):
            last_period = chunk.rfind(".")
            if last_period > chunk_size * 0.5:
                end = start + last_period + 1
                chunk = text[start:end]

        chunks.append(chunk.strip())
        start = end - overlap

    return chunks
