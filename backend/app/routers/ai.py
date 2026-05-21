"""
AI Tutor endpoints — chat, explain, generate quiz.
Uses OpenRouter via the centralized AI service.
"""

from fastapi import APIRouter, Depends, Query
from app.auth import get_current_user
from app.models import User
from app.schemas import AIQueryRequest, AIQueryResponse
from app.services import ai_service

router = APIRouter()


@router.post("/ask", response_model=AIQueryResponse)
def ask_ai(
    payload: AIQueryRequest,
    _user: User = Depends(get_current_user),
):
    """Ask the AI tutor a question."""
    if not ai_service.is_available():
        return {"response": "AI service not configured. Set OPENROUTER_API_KEY in .env.", "sources": []}

    try:
        answer = ai_service.ask_tutor(payload.query, context=payload.context)
        return {"response": answer, "sources": []}
    except Exception as e:
        return {"response": f"AI service error: {str(e)}", "sources": []}


@router.post("/explain", response_model=AIQueryResponse)
def explain_topic(
    payload: AIQueryRequest,
    _user: User = Depends(get_current_user),
):
    """Get a detailed explanation of a topic."""
    if not ai_service.is_available():
        return {"response": "AI service not configured. Set OPENROUTER_API_KEY in .env.", "sources": []}

    try:
        answer = ai_service.explain_topic(payload.query, context=payload.context)
        return {"response": answer, "sources": []}
    except Exception as e:
        return {"response": f"AI service error: {str(e)}", "sources": []}


@router.post("/generate-quiz")
def generate_quiz(
    topic: str = Query(...),
    difficulty: str = Query("medium"),
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
                "explanation": "AI not configured.",
            }],
        }

    try:
        questions = ai_service.generate_quiz(topic, difficulty, count)
        return {"topic": topic, "difficulty": difficulty, "questions": questions}
    except Exception as e:
        return {
            "topic": topic,
            "difficulty": difficulty,
            "questions": [],
            "error": str(e),
        }
