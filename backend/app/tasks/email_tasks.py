"""
Email Tasks — background email sending.
"""

import logging
from typing import List

logger = logging.getLogger("adaptlearn.tasks.email")


async def send_test_notifications(
    test_id: int,
    student_emails: List[str],
    test_title: str,
    subject_name: str,
    duration: int,
    due_date: str,
) -> dict:
    """Send test assignment notifications to all assigned students."""
    from app.services.email_service import notify_test_assigned

    sent = 0
    failed = 0

    for email in student_emails:
        result = await notify_test_assigned(
            student_email=email,
            student_name=email.split("@")[0],
            test_title=test_title,
            subject_name=subject_name,
            duration=duration,
            due_date=due_date,
        )
        if result.get("success"):
            sent += 1
        else:
            failed += 1

    logger.info(f"Test notifications: {sent} sent, {failed} failed for test {test_id}")
    return {"sent": sent, "failed": failed}


async def send_result_notifications(
    test_id: int,
    results: List[dict],
) -> dict:
    """Send result notifications to students after grading."""
    from app.services.email_service import notify_results

    sent = 0
    failed = 0

    for r in results:
        result = await notify_results(
            student_email=r["email"],
            student_name=r["name"],
            test_title=r["test_title"],
            score=r["score"],
            total_marks=r["total_marks"],
            percentage=r["percentage"],
            passed=r["passed"],
        )
        if result.get("success"):
            sent += 1
        else:
            failed += 1

    logger.info(f"Result notifications: {sent} sent, {failed} failed for test {test_id}")
    return {"sent": sent, "failed": failed}


async def send_reminder(
    student_email: str,
    student_name: str,
    test_title: str,
    due_date: str,
) -> dict:
    """Send a test reminder to a single student."""
    from app.services.email_service import send_email, render_template

    subject, body = render_template(
        "test_reminder",
        student_name=student_name,
        test_title=test_title,
        due_date=due_date,
    )
    return await send_email(student_email, subject, body)
