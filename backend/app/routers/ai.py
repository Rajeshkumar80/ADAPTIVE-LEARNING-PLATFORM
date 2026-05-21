"""
AI Tutor endpoints — chat, explain, generate quiz.
Uses OpenAI if API key is set, otherwise falls back to canned responses.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models import User
from app.schemas import AIQueryRequest, AIQueryResponse

router = APIRouter()


def _fallback_response(query: str) -> str:
    """Smart canned responses when OpenAI isn't configured."""
    q = query.lower()
    if "binary search" in q:
        return (
            "Binary Search is an efficient algorithm for finding a target value in a sorted array.\n\n"
            "How it works:\n"
            "1. Compare target with middle element\n"
            "2. If equal, found it\n"
            "3. If smaller, search left half\n"
            "4. If larger, search right half\n"
            "5. Repeat until found\n\n"
            "Time Complexity: O(log n)"
        )
    if "sort" in q:
        return (
            "Sorting algorithms organize data in a specific order. Common ones:\n\n"
            "• Bubble Sort — O(n²), simple but slow\n"
            "• Quick Sort — O(n log n) avg, divide and conquer\n"
            "• Merge Sort — O(n log n), stable\n"
            "• Heap Sort — O(n log n), in-place"
        )
    if "normal" in q and "form" in q:
        return (
            "Database normalization reduces redundancy.\n\n"
            "Normal Forms:\n"
            "• 1NF — atomic values, no repeating groups\n"
            "• 2NF — 1NF + no partial dependencies\n"
            "• 3NF — 2NF + no transitive dependencies\n"
            "• BCNF — stricter 3NF"
        )
    return (
        f"That's a great question about: \"{query}\"\n\n"
        "I'm running in offline mode. To enable full AI responses, "
        "set OPENAI_API_KEY in the backend .env file. "
        "I can still help with common topics like algorithms, databases, and OS concepts."
    )


@router.post("/ask", response_model=AIQueryResponse)
def ask_ai(
    payload: AIQueryRequest,
    _user: User = Depends(get_current_user),
):
    if settings.OPENROUTER_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=settings.OPENROUTER_API_KEY,
            )
            completion = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a helpful tutor for VTU CS students. Be concise and educational."},
                    {"role": "user", "content": payload.query},
                ],
                max_tokens=500,
            )
            answer = completion.choices[0].message.content
            return {"response": answer, "sources": []}
        except Exception as e:
            return {"response": f"AI service error: {str(e)}\n\n{_fallback_response(payload.query)}", "sources": []}

    return {"response": _fallback_response(payload.query), "sources": []}


@router.post("/explain", response_model=AIQueryResponse)
def explain_topic(
    payload: AIQueryRequest,
    _user: User = Depends(get_current_user),
):
    if settings.OPENROUTER_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=settings.OPENROUTER_API_KEY,
            )
            completion = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a helpful VTU CS tutor. Explain this topic clearly with examples."},
                    {"role": "user", "content": f"Explain: {payload.query}"},
                ],
                max_tokens=800,
            )
            answer = completion.choices[0].message.content
            return {"response": answer, "sources": []}
        except Exception as e:
            pass
            
    return {
        "response": _fallback_response(payload.query),
        "sources": [],
    }


@router.post("/generate-quiz")
def generate_quiz(
    topic: str,
    difficulty: str = "medium",
    _user: User = Depends(get_current_user),
):
    if settings.OPENROUTER_API_KEY:
        try:
            from openai import OpenAI
            import json
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=settings.OPENROUTER_API_KEY,
            )
            completion = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a quiz generator. Output ONLY a valid JSON array containing exactly 1 question object. Format: [{\"question\": \"...\", \"options\": {\"a\": \"...\", \"b\": \"...\", \"c\": \"...\", \"d\": \"...\"}, \"correct_answer\": \"a\"}]"},
                    {"role": "user", "content": f"Generate a {difficulty} multiple-choice question about: {topic}"},
                ],
                max_tokens=400,
            )
            answer = completion.choices[0].message.content
            # Try to parse the JSON
            try:
                # Remove any markdown formatting if present
                clean_answer = answer.strip()
                if clean_answer.startswith("```json"):
                    clean_answer = clean_answer[7:]
                if clean_answer.endswith("```"):
                    clean_answer = clean_answer[:-3]
                
                questions = json.loads(clean_answer.strip())
                return {
                    "topic": topic,
                    "difficulty": difficulty,
                    "questions": questions,
                }
            except json.JSONDecodeError:
                # Fall back if parsing fails
                pass
        except Exception:
            pass

    return {
        "topic": topic,
        "difficulty": difficulty,
        "questions": [
            {
                "question": f"Sample question about {topic}",
                "options": {"a": "Option A", "b": "Option B", "c": "Option C", "d": "Option D"},
                "correct_answer": "a",
            }
        ],
    }
