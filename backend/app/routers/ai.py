"""
AI Tutor endpoints — chat, explain, generate quiz, chatbot.
Uses Google Gemini (primary) + OpenRouter (fallback) via the centralized AI service.
"""

import logging
from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.auth import get_current_user
from app.models import User
from app.schemas import AIQueryRequest, AIQueryResponse
from app.services import ai_service

logger = logging.getLogger("adaptlearn.ai")
router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[list[ChatMessage]] = []


class ChatResponse(BaseModel):
    response: str
    model: str = "unknown"
    error: Optional[str] = None


@router.post("/chat", response_model=ChatResponse)
def chat_with_ai(
    payload: ChatRequest,
    _user: User = Depends(get_current_user),
):
    """Conversational AI chatbot with history support."""
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    if not ai_service.is_available():
        return ChatResponse(
            response="AI service is not configured. Please ask your admin to set GEMINI_API_KEY or OPENROUTER_API_KEY in the backend .env file.",
            model="none",
            error="AI service not configured",
        )

    try:
        history = [{"role": m.role, "content": m.content} for m in (payload.history or [])]
        answer = ai_service.chatbot(payload.message, history)
        model_name = "gemini-2.5-flash" if ai_service.is_gemini_available() else "openrouter"
        return ChatResponse(response=answer, model=model_name)
    except Exception as e:
        logger.error(f"AI chat error: {e}")
        return ChatResponse(
            response="I'm having trouble connecting to the AI service right now. Please try again in a moment.",
            model="error",
            error=str(e),
        )


@router.post("/ask", response_model=AIQueryResponse)
def ask_ai(
    payload: AIQueryRequest,
    _user: User = Depends(get_current_user),
):
    """Ask the AI tutor a question."""
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    if not ai_service.is_available():
        return AIQueryResponse(
            response="AI service not configured. Set GEMINI_API_KEY or OPENROUTER_API_KEY in .env.",
            sources=[],
        )

    try:
        answer = ai_service.ask_tutor(payload.query, context=payload.context)
        return AIQueryResponse(response=answer, sources=[])
    except Exception as e:
        logger.error(f"AI ask error: {e}")
        return AIQueryResponse(
            response=f"Sorry, I couldn't process your question right now. Error: {str(e)}",
            sources=[],
        )


@router.post("/explain", response_model=AIQueryResponse)
def explain_topic(
    payload: AIQueryRequest,
    _user: User = Depends(get_current_user),
):
    """Get a detailed explanation of a topic."""
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")

    if not ai_service.is_available():
        return AIQueryResponse(
            response="AI service not configured. Set GEMINI_API_KEY or OPENROUTER_API_KEY in .env.",
            sources=[],
        )

    try:
        answer = ai_service.explain_topic(payload.query, context=payload.context)
        return AIQueryResponse(response=answer, sources=[])
    except Exception as e:
        logger.error(f"AI explain error: {e}")
        return AIQueryResponse(
            response=f"Sorry, I couldn't explain that topic right now. Error: {str(e)}",
            sources=[],
        )


@router.post("/generate-quiz")
def generate_quiz(
    topic: str = Query(..., min_length=1),
    difficulty: str = Query("medium", pattern="^(easy|medium|hard)$"),
    count: int = Query(3, ge=1, le=10),
    _user: User = Depends(get_current_user),
):
    """Generate quiz questions on a topic using AI."""
    if not ai_service.is_available():
        return {
            "topic": topic,
            "difficulty": difficulty,
            "questions": [{
                "question": f"Sample question about {topic}",
                "options": {"a": "Option A", "b": "Option B", "c": "Option C", "d": "Option D"},
                "correct_answer": "a",
                "explanation": "AI not configured — this is a placeholder.",
            }],
            "ai_generated": False,
        }

    try:
        questions = ai_service.generate_quiz(topic, difficulty, count)
        return {"topic": topic, "difficulty": difficulty, "questions": questions, "ai_generated": True}
    except Exception as e:
        logger.error(f"AI quiz generation error: {e}")
        return {
            "topic": topic,
            "difficulty": difficulty,
            "questions": [],
            "ai_generated": False,
            "error": str(e),
        }


@router.get("/status")
def ai_status(_user: User = Depends(get_current_user)):
    """Check AI service availability."""
    return {
        "available": ai_service.is_available(),
        "gemini": ai_service.is_gemini_available(),
        "openrouter": ai_service.is_openrouter_available(),
    }
