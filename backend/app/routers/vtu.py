"""
VTU Data Integration — CSE 22 Scheme subjects, CO/PO, notes, resources.
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.auth import get_current_user, require_admin
from app.database import get_db
from app.models import User, Subject, Topic

logger = logging.getLogger("adaptlearn.vtu")
router = APIRouter()

# ── VTU CSE 22 Scheme Data ───────────────────────────────────────────────────

VTU_CSE_22_SCHEME = {
    1: [
        {"code": "22MAT11", "name": "Calculus and Linear Algebra", "credits": 4},
        {"code": "22PHY12", "name": "Engineering Physics", "credits": 4},
        {"code": "22ELE13", "name": "Basic Electrical Engineering", "credits": 3},
        {"code": "22EME14", "name": "Elements of Mechanical Engineering", "credits": 3},
        {"code": "22CIV15", "name": "Engineering Drawing", "credits": 3},
    ],
    2: [
        {"code": "22MAT21", "name": "Advanced Calculus and Numerical Methods", "credits": 4},
        {"code": "22CHE22", "name": "Engineering Chemistry", "credits": 4},
        {"code": "22CS23", "name": "Introduction to C Programming", "credits": 3},
        {"code": "22CS24", "name": "Digital Design and Computer Organization", "credits": 3},
        {"code": "22ME25", "name": "Introduction to IoT", "credits": 3},
    ],
    3: [
        {"code": "22CS31", "name": "Mathematics for Computer Science", "credits": 4},
        {"code": "22CS32", "name": "Data Structures and Applications", "credits": 4},
        {"code": "22CS33", "name": "Analog and Digital Electronics", "credits": 3},
        {"code": "22CS34", "name": "Computer Organization and Architecture", "credits": 3},
        {"code": "22CS35", "name": "Object Oriented Programming with Java", "credits": 3},
    ],
    4: [
        {"code": "22CS41", "name": "Analysis and Design of Algorithms", "credits": 4},
        {"code": "22CS42", "name": "Microcontrollers and Embedded Systems", "credits": 4},
        {"code": "22CS43", "name": "Operating Systems", "credits": 3},
        {"code": "22CS44", "name": "Database Management Systems", "credits": 3},
        {"code": "22CS45", "name": "Discrete Mathematical Structures", "credits": 3},
    ],
    5: [
        {"code": "22CS51", "name": "Computer Networks", "credits": 4},
        {"code": "22CS52", "name": "Automata Theory and Computability", "credits": 4},
        {"code": "22CS53", "name": "Software Engineering", "credits": 3},
        {"code": "22CS54", "name": "Machine Learning", "credits": 3},
        {"code": "22CS55", "name": "Full Stack Development", "credits": 3},
    ],
    6: [
        {"code": "22CS61", "name": "Data Structures & Algorithms", "credits": 4},
        {"code": "22CS62", "name": "Database Management Systems", "credits": 4},
        {"code": "22CS63", "name": "Operating Systems", "credits": 4},
        {"code": "22CS64", "name": "Computer Networks", "credits": 3},
        {"code": "22CS65", "name": "Software Engineering", "credits": 3},
        {"code": "22CS66", "name": "Artificial Intelligence", "credits": 4},
    ],
    7: [
        {"code": "22CS71", "name": "Cryptography and Network Security", "credits": 4},
        {"code": "22CS72", "name": "Cloud Computing", "credits": 3},
        {"code": "22CS73", "name": "Big Data Analytics", "credits": 3},
        {"code": "22CS74", "name": "Deep Learning", "credits": 3},
    ],
    8: [
        {"code": "22CS81", "name": "Internet of Things", "credits": 3},
        {"code": "22CS82", "name": "Project Work", "credits": 10},
    ],
}

# Course Outcomes for key subjects
VTU_COURSE_OUTCOMES = {
    "22CS61": [
        "CO1: Explain different data structures and their applications",
        "CO2: Apply linear and non-linear data structures to solve problems",
        "CO3: Implement searching and sorting algorithms",
        "CO4: Analyze time and space complexity of algorithms",
        "CO5: Design solutions using trees, graphs, and hashing",
    ],
    "22CS62": [
        "CO1: Explain the fundamentals of database systems",
        "CO2: Design ER diagrams and relational schemas",
        "CO3: Write SQL queries for data manipulation",
        "CO4: Apply normalization techniques",
        "CO5: Understand transaction management and concurrency",
    ],
    "22CS63": [
        "CO1: Explain OS concepts: processes, threads, scheduling",
        "CO2: Implement process synchronization mechanisms",
        "CO3: Analyze deadlock detection and prevention",
        "CO4: Explain memory management techniques",
        "CO5: Understand file systems and I/O management",
    ],
    "22CS64": [
        "CO1: Explain network architectures and protocols",
        "CO2: Analyze data link layer protocols",
        "CO3: Implement network layer routing algorithms",
        "CO4: Understand transport layer protocols (TCP/UDP)",
        "CO5: Explain application layer protocols",
    ],
    "22CS66": [
        "CO1: Explain AI problem-solving techniques",
        "CO2: Implement search algorithms (BFS, DFS, A*)",
        "CO3: Apply knowledge representation methods",
        "CO4: Understand machine learning fundamentals",
        "CO5: Implement basic neural network architectures",
    ],
}

# Program Outcomes
VTU_PROGRAM_OUTCOMES = [
    "PO1: Engineering Knowledge - Apply knowledge of mathematics, science, and engineering",
    "PO2: Problem Analysis - Identify, formulate, and analyze complex engineering problems",
    "PO3: Design/Development - Design solutions for complex engineering problems",
    "PO4: Investigation - Use research-based knowledge for complex problems",
    "PO5: Modern Tool Usage - Create, select, and apply appropriate techniques and tools",
    "PO6: Engineer and Society - Apply reasoning for societal context",
    "PO7: Environment and Sustainability - Understand impact of solutions",
    "PO8: Ethics - Apply ethical principles and professional responsibilities",
    "PO9: Individual and Team Work - Function effectively as individual and team member",
    "PO10: Communication - Communicate effectively on complex engineering activities",
    "PO11: Project Management - Apply engineering and management principles",
    "PO12: Life-long Learning - Recognize the need for independent and life-long learning",
]


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/subjects")
def get_vtu_subjects(
    semester: Optional[int] = Query(None, ge=1, le=8),
    _user: User = Depends(get_current_user),
):
    """Get VTU CSE 22 Scheme subjects, optionally filtered by semester."""
    if semester:
        subjects = VTU_CSE_22_SCHEME.get(semester, [])
        return {"semester": semester, "scheme": "22", "subjects": subjects}

    # Return all semesters
    return {
        "scheme": "22",
        "branch": "CSE",
        "semesters": {
            str(sem): subjects for sem, subjects in VTU_CSE_22_SCHEME.items()
        },
        "total_subjects": sum(len(s) for s in VTU_CSE_22_SCHEME.values()),
    }


@router.get("/subjects/{subject_code}")
def get_subject_details(
    subject_code: str,
    _user: User = Depends(get_current_user),
):
    """Get detailed info for a VTU subject including CO/PO mapping."""
    # Find subject
    subject = None
    subject_semester = None
    for sem, subjects in VTU_CSE_22_SCHEME.items():
        for s in subjects:
            if s["code"] == subject_code.upper():
                subject = s
                subject_semester = sem
                break

    if not subject:
        raise HTTPException(status_code=404, detail=f"Subject {subject_code} not found")

    cos = VTU_COURSE_OUTCOMES.get(subject_code.upper(), [])

    return {
        **subject,
        "semester": subject_semester,
        "scheme": "22",
        "branch": "CSE",
        "course_outcomes": cos,
        "program_outcomes": VTU_PROGRAM_OUTCOMES,
    }


@router.get("/program-outcomes")
def get_program_outcomes(_user: User = Depends(get_current_user)):
    """Get VTU CSE Program Outcomes (PO1-PO12)."""
    return {"program_outcomes": VTU_PROGRAM_OUTCOMES, "branch": "CSE", "scheme": "22"}


@router.post("/import")
def import_vtu_subjects(
    semester: Optional[int] = Query(None, ge=1, le=8),
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Import VTU subjects into the database (Admin only)."""
    semesters_to_import = [semester] if semester else list(VTU_CSE_22_SCHEME.keys())
    imported = 0

    for sem in semesters_to_import:
        for subj_data in VTU_CSE_22_SCHEME.get(sem, []):
            # Check if already exists
            existing = db.query(Subject).filter(Subject.code == subj_data["code"]).first()
            if existing:
                continue

            subject = Subject(
                code=subj_data["code"],
                name=subj_data["name"],
                semester=sem,
                credits=subj_data["credits"],
                description=f"VTU CSE 22 Scheme - Semester {sem}",
            )
            db.add(subject)
            imported += 1

            # Add topics from COs if available
            cos = VTU_COURSE_OUTCOMES.get(subj_data["code"], [])
            for i, co in enumerate(cos):
                topic_name = co.split(": ", 1)[1] if ": " in co else co
                db.add(Topic(
                    subject_id=subject.id if subject.id else None,
                    name=topic_name,
                    difficulty="medium",
                    order_index=i + 1,
                ))

    db.commit()
    logger.info(f"Imported {imported} VTU subjects")

    return {
        "message": f"Imported {imported} subjects",
        "imported": imported,
        "semesters": semesters_to_import,
    }
