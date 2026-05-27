"""
Anti-Cheat Service — server-side validation and violation management.
Implements 3-strike policy with auto-submission.
"""

from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.test import TestAttempt, AntiCheatFlag

# Maximum violations before auto-submission
MAX_VIOLATIONS = 3

VIOLATION_TYPES = {
    "tab_switch": {"severity": "warning", "description": "Tab switch detected"},
    "copy_paste": {"severity": "critical", "description": "Copy/paste attempt"},
    "right_click": {"severity": "info", "description": "Right-click attempt"},
    "keyboard_shortcut": {"severity": "warning", "description": "Blocked keyboard shortcut"},
    "suspicious_timing": {"severity": "critical", "description": "Suspicious answer timing"},
}


def record_violation(
    db: Session,
    attempt_id: int,
    user_id: int,
    violation_type: str,
    details: str = "",
) -> dict:
    """
    Record a violation and check if auto-submission should trigger.

    Returns:
        dict with 'auto_submit' flag and violation count.
    """
    vtype = VIOLATION_TYPES.get(violation_type, {
        "severity": "info",
        "description": violation_type,
    })

    flag = AntiCheatFlag(
        test_attempt_id=attempt_id,
        user_id=user_id,
        severity=vtype["severity"],
        violation=vtype["description"],
    )
    db.add(flag)
    db.commit()

    # Count total violations for this attempt
    total_violations = db.query(AntiCheatFlag).filter(
        AntiCheatFlag.test_attempt_id == attempt_id,
        AntiCheatFlag.severity.in_(["warning", "critical"]),
    ).count()

    should_auto_submit = total_violations >= MAX_VIOLATIONS

    return {
        "violation_logged": True,
        "violation_count": total_violations,
        "max_violations": MAX_VIOLATIONS,
        "auto_submit": should_auto_submit,
        "severity": vtype["severity"],
    }


def auto_submit_attempt(db: Session, attempt_id: int) -> dict:
    """Force-submit an attempt due to anti-cheat violations."""
    attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id).first()
    if not attempt or attempt.is_completed:
        return {"error": "Attempt not found or already submitted"}

    attempt.is_completed = True
    attempt.submitted_at = datetime.now(timezone.utc)
    attempt.anti_cheat_flags = {
        "auto_submitted": True,
        "reason": "Maximum violations exceeded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    db.commit()

    return {
        "auto_submitted": True,
        "attempt_id": attempt_id,
        "submitted_at": attempt.submitted_at,
    }


def get_violation_summary(db: Session, attempt_id: int) -> dict:
    """Get a summary of all violations for an attempt."""
    flags = db.query(AntiCheatFlag).filter(
        AntiCheatFlag.test_attempt_id == attempt_id
    ).all()

    return {
        "total_violations": len(flags),
        "critical": sum(1 for f in flags if f.severity == "critical"),
        "warnings": sum(1 for f in flags if f.severity == "warning"),
        "info": sum(1 for f in flags if f.severity == "info"),
        "violations": [
            {
                "id": f.id,
                "severity": f.severity,
                "violation": f.violation,
                "timestamp": f.created_at.isoformat() if f.created_at else None,
            }
            for f in flags
        ],
    }
