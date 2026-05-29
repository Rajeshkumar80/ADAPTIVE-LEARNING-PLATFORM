"""
Admin endpoints — students management, analytics, anti-cheat.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.auth import require_admin
from app.database import get_db
from app.models import User, Test, AntiCheatFlag, Subject
from app.schemas import AdminDashboard, UserResponse, SubjectResponse

router = APIRouter()


@router.get("/dashboard", response_model=AdminDashboard)
def get_dashboard(
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    total_students = db.query(User).filter(User.role == "student").count()
    active_tests = db.query(Test).filter(Test.is_active == True).count()
    flags_count = db.query(AntiCheatFlag).count()

    from app.models import TestAttempt
    from sqlalchemy import func
    avg_perf = db.query(func.avg(TestAttempt.score)).filter(TestAttempt.is_completed == True).scalar()
    
    return {
        "total_students": total_students,
        "active_tests": active_tests,
        "flags_count": flags_count,
        "avg_performance": round(avg_perf, 1) if avg_perf else 0.0,
    }


@router.get("/students", response_model=list[UserResponse])
def list_students(
    section: Optional[str] = Query(None),
    semester: Optional[int] = Query(None),
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(User).filter(User.role == "student")
    if section:
        query = query.filter(User.section == section)
    if semester:
        query = query.filter(User.semester == semester)
    return query.all()


@router.get("/students/{usn}", response_model=UserResponse)
def get_student(
    usn: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    student = db.query(User).filter(User.usn == usn, User.role == "student").first()
    if not student:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.get("/subjects", response_model=list[SubjectResponse])
def list_subjects(
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(Subject).all()


@router.get("/anti-cheat-flags")
def list_flags(
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    flags = db.query(AntiCheatFlag).order_by(AntiCheatFlag.created_at.desc()).limit(50).all()
    return [
        {
            "id": f.id,
            "user_id": f.user_id,
            "severity": f.severity,
            "violation": f.violation,
            "count": f.count,
            "created_at": f.created_at,
        }
        for f in flags
    ]


@router.get("/analytics")
def class_analytics(
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    from app.models import TestAttempt, User
    from sqlalchemy import func
    avg_s = db.query(func.avg(TestAttempt.score)).filter(TestAttempt.is_completed == True).scalar()
    
    # Top 5 students based on CGPA
    top_students = db.query(User).filter(User.role == "student").order_by(User.cgpa.desc()).limit(5).all()
    
    return {
        "total_students": db.query(User).filter(User.role == "student").count(),
        "total_tests": db.query(Test).count(),
        "avg_score": round(avg_s, 1) if avg_s else 0.0,
        "top_performers": [{"usn": u.usn, "name": u.full_name, "cgpa": u.cgpa} for u in top_students],
    }


@router.post("/import-class-data")
def import_class_data(
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Import all GCEM CSE 6th sem students into the database."""
    from app.auth import hash_password
    from app.data.class_data import GCEM_CSE_6TH_SEM
    import random

    imported = 0
    for student_data in GCEM_CSE_6TH_SEM:
        usn = student_data["usn"]
        name = student_data["name"]

        # Skip if already exists
        existing = db.query(User).filter(User.usn == usn).first()
        if existing:
            continue

        # Determine section based on USN range
        usn_num = int(usn[7:]) if usn.startswith("1GD23CS") else 0
        section = "A" if usn_num <= 62 else "B"
        if usn.startswith("1GD24"):
            section = "A"  # Lateral entry

        user = User(
            email=f"{usn.lower()}@gcem.edu",
            username=usn.lower(),
            full_name=name,
            hashed_password=hash_password("student123"),
            role="student",
            usn=usn,
            semester=6,
            branch="Computer Science",
            section=section,
            cgpa=round(random.uniform(6.5, 9.5), 2),
        )
        db.add(user)
        imported += 1

    db.commit()
    return {"message": f"Imported {imported} students", "total": imported}
