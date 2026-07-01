"""
Input Validators — validation logic for various inputs.
"""

import re
from typing import Optional


def validate_usn(usn: str) -> bool:
    """
    Validate VTU USN format: 1XX##XX###
    Example: 1GD23CS001
    """
    pattern = r"^[1-4][A-Z]{2}\d{2}[A-Z]{2}\d{3}$"
    return bool(re.match(pattern, usn.upper()))


def validate_email(email: str) -> bool:
    """Basic email validation."""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def validate_password(password: str) -> dict:
    """
    Validate password strength.
    Returns dict with 'valid' and 'errors'.
    """
    errors = []

    if len(password) < 6:
        errors.append("Password must be at least 6 characters")
    if len(password) > 128:
        errors.append("Password must be less than 128 characters")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "strength": _password_strength(password),
    }


def validate_subject_code(code: str) -> bool:
    """Validate VTU subject code format (e.g., BCS613A, BCSL307, BMATS101)."""
    pattern = r"^[A-Z]{2,4}\d{3}[A-Z]?$"
    return bool(re.match(pattern, code.upper()))


def validate_semester(semester: int) -> bool:
    """Validate semester is between 1 and 8."""
    return 1 <= semester <= 8


def validate_section(section: str) -> bool:
    """Validate section is a single uppercase letter."""
    return len(section) == 1 and section.isalpha()


def sanitize_filename(filename: str) -> str:
    """Sanitize a filename to prevent path traversal."""
    # Remove path separators and dangerous characters
    filename = re.sub(r'[/\\:*?"<>|]', "_", filename)
    # Remove leading dots (hidden files)
    filename = filename.lstrip(".")
    # Limit length
    return filename[:255]


def _password_strength(password: str) -> str:
    """Estimate password strength."""
    score = 0
    if len(password) >= 8:
        score += 1
    if len(password) >= 12:
        score += 1
    if re.search(r"[A-Z]", password):
        score += 1
    if re.search(r"[a-z]", password):
        score += 1
    if re.search(r"\d", password):
        score += 1
    if re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        score += 1

    if score <= 2:
        return "weak"
    elif score <= 4:
        return "medium"
    else:
        return "strong"
