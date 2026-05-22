"""
AI Service — Google Gemini direct + OpenRouter fallback.
Handles all LLM calls for the platform (tutor, quiz, planner).
"""

import json
import logging
from typing import Optional

from app.config import settings

logger = logging.getLogger("adaptlearn.ai")

# ── Google Gemini Client ────────────────────────────────────────────────────────

_gemini_client = None


def _get_gemini_client():
    global _gemini_client
    if _gemini_client is None:
        from google import genai
        _gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _gemini_client


def _gemini_chat(messages: list[dict], max_tokens: int = 800, temperature: float = 0.7) -> str:
    """Call Google Gemini directly."""
    client = _get_gemini_client()

    # Convert messages to Gemini format (system + user content)
    system_instruction = ""
    contents = []
    for msg in messages:
        if msg["role"] == "system":
            system_instruction += msg["content"] + "\n"
        else:
            contents.append(msg["content"])

    user_prompt = "\n".join(contents)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_prompt,
        config={
            "system_instruction": system_instruction,
            "max_output_tokens": max_tokens,
            "temperature": temperature,
        },
    )
    return response.text or ""


# ── OpenRouter Client (fallback) ────────────────────────────────────────────────

_openrouter_client = None


def _get_openrouter_client():
    global _openrouter_client
    if _openrouter_client is None:
        from openai import OpenAI
        _openrouter_client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
        )
    return _openrouter_client


def _openrouter_chat(messages: list[dict], max_tokens: int = 800, temperature: float = 0.7) -> str:
    """Call OpenRouter as fallback."""
    client = _get_openrouter_client()
    completion = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=messages,
        max_tokens=max_tokens,
        temperature=temperature,
    )
    return completion.choices[0].message.content or ""


# ── Unified chat function ───────────────────────────────────────────────────────

def chat(
    messages: list[dict],
    max_tokens: int = 800,
    temperature: float = 0.7,
) -> str:
    """Send a chat request. Tries Gemini first, falls back to OpenRouter."""
    # Try Gemini first
    if settings.GEMINI_API_KEY:
        try:
            return _gemini_chat(messages, max_tokens, temperature)
        except Exception as e:
            logger.warning(f"Gemini failed, trying OpenRouter: {e}")

    # Fallback to OpenRouter
    if settings.OPENROUTER_API_KEY:
        return _openrouter_chat(messages, max_tokens, temperature)

    raise RuntimeError("No AI provider configured (set GEMINI_API_KEY or OPENROUTER_API_KEY)")


# ── Public API ──────────────────────────────────────────────────────────────────

def ask_tutor(query: str, context: Optional[str] = None) -> str:
    """AI Tutor — answer a student's question."""
    system = (
        "You are an expert tutor for VTU Computer Science students. "
        "Be concise, educational, and use examples. "
        "Format your response with markdown for readability. "
        "If the question is about code, include code snippets."
    )
    messages = [{"role": "system", "content": system}]
    if context:
        messages.append({"role": "system", "content": f"Context: {context}"})
    messages.append({"role": "user", "content": query})
    return chat(messages, max_tokens=600)


def explain_topic(topic: str, context: Optional[str] = None) -> str:
    """Explain a topic in depth with examples."""
    system = (
        "You are a VTU CS professor explaining a topic to a student. "
        "Structure your explanation with:\n"
        "1. Simple definition\n"
        "2. How it works (step by step)\n"
        "3. Real-world analogy\n"
        "4. Code example if applicable\n"
        "5. Common pitfalls\n"
        "Use markdown formatting."
    )
    messages = [{"role": "system", "content": system}]
    if context:
        messages.append({"role": "system", "content": f"Student's current topic: {context}"})
    messages.append({"role": "user", "content": f"Explain: {topic}"})
    return chat(messages, max_tokens=1000)


def generate_quiz(topic: str, difficulty: str = "medium", count: int = 3) -> list[dict]:
    """Generate quiz questions as structured JSON."""
    system = (
        f"You are a quiz generator for VTU CS students. "
        f"Generate exactly {count} {difficulty}-difficulty multiple-choice questions about the given topic. "
        f"Output ONLY a valid JSON array. Each object must have:\n"
        f'  "question": string,\n'
        f'  "options": {{"a": "...", "b": "...", "c": "...", "d": "..."}},\n'
        f'  "correct_answer": "a"|"b"|"c"|"d",\n'
        f'  "explanation": string (brief explanation of correct answer)\n'
        f"No markdown, no extra text — just the JSON array."
    )
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": f"Topic: {topic}"},
    ]
    raw = chat(messages, max_tokens=1200, temperature=0.8)

    # Parse JSON from response
    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("\n", 1)[1] if "\n" in clean else clean[3:]
    if clean.endswith("```"):
        clean = clean[:-3]
    clean = clean.strip()

    try:
        questions = json.loads(clean)
        if isinstance(questions, list):
            return questions
    except json.JSONDecodeError:
        logger.warning(f"Failed to parse quiz JSON: {raw[:200]}")

    return [{
        "question": f"Sample question about {topic}",
        "options": {"a": "Option A", "b": "Option B", "c": "Option C", "d": "Option D"},
        "correct_answer": "a",
        "explanation": "AI response could not be parsed.",
    }]


def generate_study_plan(
    subjects: list[str],
    weak_topics: list[str],
    available_hours: float = 4.0,
) -> list[dict]:
    """Generate a personalized daily study plan."""
    system = (
        "You are an AI study planner for a VTU CS student. "
        "Create a focused daily study schedule. "
        "Output ONLY a valid JSON array of session objects with:\n"
        '  "time": "HH:MM" (24h format),\n'
        '  "subject": string,\n'
        '  "topic": string,\n'
        '  "duration": number (minutes),\n'
        '  "activity": "study"|"practice"|"review"|"quiz"\n'
        "Prioritize weak topics. Total duration should not exceed the available hours. "
        "No markdown, no extra text — just the JSON array."
    )
    user_msg = (
        f"Subjects: {', '.join(subjects)}\n"
        f"Weak topics needing focus: {', '.join(weak_topics) if weak_topics else 'None identified'}\n"
        f"Available study time today: {available_hours} hours"
    )
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user_msg},
    ]
    raw = chat(messages, max_tokens=800, temperature=0.6)

    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("\n", 1)[1] if "\n" in clean else clean[3:]
    if clean.endswith("```"):
        clean = clean[:-3]
    clean = clean.strip()

    try:
        plan = json.loads(clean)
        if isinstance(plan, list):
            return plan
    except json.JSONDecodeError:
        logger.warning(f"Failed to parse study plan JSON: {raw[:200]}")

    return []


def chatbot(message: str, history: list[dict] = None) -> str:
    """General chatbot for conversational AI tutor with history support."""
    system = (
        "You are AdaptLearn AI — a friendly, knowledgeable tutor for VTU Computer Science students. "
        "You help with programming, algorithms, databases, OS, networks, and software engineering. "
        "Be conversational but educational. Use markdown for code and formatting. "
        "If the student seems confused, break things down step by step. "
        "Keep responses concise (2-4 paragraphs max) unless they ask for detail."
    )
    messages = [{"role": "system", "content": system}]

    # Add conversation history
    if history:
        for h in history[-10:]:  # Keep last 10 messages for context
            messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})

    messages.append({"role": "user", "content": message})
    return chat(messages, max_tokens=800)


def is_available() -> bool:
    """Check if any AI service is configured."""
    return bool(settings.GEMINI_API_KEY or settings.OPENROUTER_API_KEY)


def is_gemini_available() -> bool:
    """Check if Gemini is configured (for AI Tutor)."""
    return bool(settings.GEMINI_API_KEY)


def is_openrouter_available() -> bool:
    """Check if OpenRouter is configured (for CodeJournal synthesis)."""
    return bool(settings.OPENROUTER_API_KEY)
