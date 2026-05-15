"""
Student Router
Handles student dashboard, progress, subjects
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

@router.get("/dashboard")
async def get_student_dashboard(db: Session = Depends(get_db)):
    """Get student dashboard data"""
    return {
        "overall_mastery": 0.65,
        "total_study_hours": 45,
        "tests_completed": 8,
        "upcoming_tests": 3,
        "current_streak": 7
    }

@router.get("/progress")
async def get_progress(db: Session = Depends(get_db)):
    """Get learning progress overview"""
    return {
        "subjects": [],
        "mastery_by_module": {},
        "weekly_progress": []
    }

@router.get("/upcoming-tests")
async def get_upcoming_tests(db: Session = Depends(get_db)):
    """Get list of upcoming tests"""
    return {"tests": []}

@router.get("/notifications")
async def get_notifications(db: Session = Depends(get_db)):
    """Get student notifications"""
    return {"notifications": []}

@router.get("/subjects")
async def get_subjects(db: Session = Depends(get_db)):
    """Get student's selected subjects"""
    return {"subjects": []}

@router.post("/subjects/select")
async def select_subjects(db: Session = Depends(get_db)):
    """Select subjects for the semester"""
    return {"message": "Subjects selected successfully"}
