"""
Document Upload & RAG endpoints — upload files, process them, query with context.
Supports: PDF, DOCX, TXT, MD, Images
"""

import os
import logging
import shutil
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import User

logger = logging.getLogger("adaptlearn.documents")
router = APIRouter()

# Upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Allowed file types
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt", ".md", ".png", ".jpg", ".jpeg", ".gif"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB


# In-memory document store (replace with DB in production)
_documents: dict = {}
_document_chunks: dict = {}


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    subject: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
):
    """Upload a document for AI-powered Q&A."""
    # Validate file extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not supported. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Validate file size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum 20MB.")

    # Save file
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    safe_name = f"{current_user.id}_{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    with open(file_path, "wb") as f:
        f.write(content)

    # Process document
    text = ""
    try:
        text = _extract_text(file_path, ext)
    except Exception as e:
        logger.error(f"Text extraction failed: {e}")

    # Chunk and store
    chunks = _chunk_text(text) if text else []
    doc_id = f"doc_{current_user.id}_{timestamp}"

    _documents[doc_id] = {
        "id": doc_id,
        "filename": file.filename,
        "file_path": file_path,
        "extension": ext,
        "size": len(content),
        "subject": subject,
        "description": description,
        "user_id": current_user.id,
        "text_length": len(text),
        "chunks_count": len(chunks),
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }
    _document_chunks[doc_id] = chunks

    logger.info(f"Document uploaded: {file.filename} ({len(chunks)} chunks)")

    return {
        "id": doc_id,
        "filename": file.filename,
        "size": len(content),
        "text_extracted": len(text) > 0,
        "text_length": len(text),
        "chunks": len(chunks),
        "message": "Document uploaded and processed successfully",
    }


@router.get("/")
def list_documents(
    current_user: User = Depends(get_current_user),
):
    """List all uploaded documents for the current user."""
    user_docs = [
        doc for doc in _documents.values()
        if doc["user_id"] == current_user.id
    ]
    return {"documents": user_docs, "total": len(user_docs)}


@router.delete("/{doc_id}")
def delete_document(
    doc_id: str,
    current_user: User = Depends(get_current_user),
):
    """Delete an uploaded document."""
    doc = _documents.get(doc_id)
    if not doc or doc["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")

    # Remove file
    if os.path.exists(doc["file_path"]):
        os.remove(doc["file_path"])

    del _documents[doc_id]
    _document_chunks.pop(doc_id, None)

    return {"message": "Document deleted"}


@router.post("/ask")
def ask_document(
    doc_id: str = Form(...),
    question: str = Form(...),
    current_user: User = Depends(get_current_user),
):
    """Ask a question about an uploaded document (RAG)."""
    doc = _documents.get(doc_id)
    if not doc or doc["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")

    chunks = _document_chunks.get(doc_id, [])
    if not chunks:
        raise HTTPException(status_code=400, detail="No text extracted from this document")

    # Simple keyword-based retrieval (replace with vector search in production)
    relevant_chunks = _retrieve_relevant_chunks(question, chunks, top_k=3)
    context = "\n\n".join(relevant_chunks)

    # Call AI with context
    from app.services import ai_service

    if not ai_service.is_available():
        return {
            "answer": "AI service not configured. The relevant sections from your document are:\n\n" + context[:2000],
            "sources": relevant_chunks[:2],
            "ai_generated": False,
        }

    try:
        system_prompt = (
            "You are an AI tutor helping a student understand their study material. "
            "Answer the question based on the provided document context. "
            "If the answer isn't in the context, say so and provide general knowledge. "
            "Use markdown formatting."
        )
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "system", "content": f"Document context:\n{context}"},
            {"role": "user", "content": question},
        ]
        answer = ai_service.chat(messages, max_tokens=1000)

        return {
            "answer": answer,
            "sources": relevant_chunks[:2],
            "ai_generated": True,
            "document": doc["filename"],
        }
    except Exception as e:
        logger.error(f"RAG query failed: {e}")
        return {
            "answer": f"AI error. Here's the relevant context from your document:\n\n{context[:1500]}",
            "sources": relevant_chunks[:2],
            "ai_generated": False,
            "error": str(e),
        }


# ── Helper Functions ─────────────────────────────────────────────────────────

def _extract_text(file_path: str, ext: str) -> str:
    """Extract text from various file types."""
    if ext == ".txt" or ext == ".md":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    if ext == ".pdf":
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text() + "\n"
            doc.close()
            return text
        except ImportError:
            # Fallback: try pdfplumber
            try:
                import pdfplumber
                with pdfplumber.open(file_path) as pdf:
                    return "\n".join(page.extract_text() or "" for page in pdf.pages)
            except ImportError:
                logger.warning("No PDF library available (install PyMuPDF or pdfplumber)")
                return ""

    if ext in (".docx", ".doc"):
        try:
            import docx
            doc = docx.Document(file_path)
            return "\n".join(p.text for p in doc.paragraphs)
        except ImportError:
            logger.warning("python-docx not installed")
            return ""

    return ""


def _chunk_text(text: str, chunk_size: int = 800, overlap: int = 150) -> list:
    """Split text into overlapping chunks."""
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

        if chunk.strip():
            chunks.append(chunk.strip())
        start = end - overlap

    return chunks


def _retrieve_relevant_chunks(query: str, chunks: list, top_k: int = 3) -> list:
    """Simple keyword-based retrieval. Replace with vector search for production."""
    query_words = set(query.lower().split())

    scored = []
    for chunk in chunks:
        chunk_words = set(chunk.lower().split())
        overlap = len(query_words & chunk_words)
        scored.append((overlap, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [chunk for _, chunk in scored[:top_k]]
