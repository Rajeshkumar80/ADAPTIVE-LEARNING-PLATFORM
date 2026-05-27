"""
Email Service — handles sending notifications via Resend API.
Supports test assignments, reminders, and result notifications.
"""

import logging
from typing import Optional, List

from app.config import settings

logger = logging.getLogger("adaptlearn.email")

# Email templates
TEMPLATES = {
    "test_assigned": {
        "subject": "New Test Assigned: {test_title}",
        "body": """
Hi {student_name},

A new test has been assigned to you:

📝 Test: {test_title}
📚 Subject: {subject_name}
⏰ Duration: {duration} minutes
📅 Due: {due_date}

Login to AdaptLearn to start the test.

Good luck!
— AdaptLearn Team
""",
    },
    "test_reminder": {
        "subject": "Reminder: {test_title} due soon",
        "body": """
Hi {student_name},

This is a reminder that your test is due soon:

📝 Test: {test_title}
📅 Due: {due_date}

Don't forget to complete it before the deadline.

— AdaptLearn Team
""",
    },
    "results_published": {
        "subject": "Results Published: {test_title}",
        "body": """
Hi {student_name},

Your results for {test_title} are now available:

📊 Score: {score}/{total_marks}
📈 Percentage: {percentage}%
{status}

Login to AdaptLearn to view detailed results.

— AdaptLearn Team
""",
    },
}


def is_configured() -> bool:
    """Check if email service is configured."""
    return bool(getattr(settings, "RESEND_API_KEY", ""))


async def send_email(
    to: str,
    subject: str,
    body: str,
    from_email: Optional[str] = None,
) -> dict:
    """Send an email via Resend API."""
    if not is_configured():
        logger.warning("Email service not configured (RESEND_API_KEY missing)")
        return {"success": False, "error": "Email service not configured"}

    try:
        import httpx

        from_addr = from_email or getattr(settings, "FROM_EMAIL", "noreply@adaptlearn.com")

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": from_addr,
                    "to": [to],
                    "subject": subject,
                    "text": body,
                },
            )

        if response.status_code == 200:
            logger.info(f"Email sent to {to}: {subject}")
            return {"success": True, "id": response.json().get("id")}
        else:
            logger.error(f"Email failed: {response.status_code} {response.text}")
            return {"success": False, "error": response.text}

    except Exception as e:
        logger.error(f"Email send error: {e}")
        return {"success": False, "error": str(e)}


def render_template(template_name: str, **kwargs) -> tuple:
    """Render an email template with variables. Returns (subject, body)."""
    template = TEMPLATES.get(template_name)
    if not template:
        return (f"Notification from AdaptLearn", f"You have a new notification.")

    subject = template["subject"].format(**kwargs)
    body = template["body"].format(**kwargs)
    return subject, body


async def notify_test_assigned(
    student_email: str,
    student_name: str,
    test_title: str,
    subject_name: str,
    duration: int,
    due_date: str,
) -> dict:
    """Send test assignment notification."""
    subject, body = render_template(
        "test_assigned",
        student_name=student_name,
        test_title=test_title,
        subject_name=subject_name,
        duration=duration,
        due_date=due_date,
    )
    return await send_email(student_email, subject, body)


async def notify_results(
    student_email: str,
    student_name: str,
    test_title: str,
    score: float,
    total_marks: float,
    percentage: float,
    passed: bool,
) -> dict:
    """Send results notification."""
    status = "✅ PASSED" if passed else "❌ FAILED"
    subject, body = render_template(
        "results_published",
        student_name=student_name,
        test_title=test_title,
        score=score,
        total_marks=total_marks,
        percentage=round(percentage, 1),
        status=status,
    )
    return await send_email(student_email, subject, body)
