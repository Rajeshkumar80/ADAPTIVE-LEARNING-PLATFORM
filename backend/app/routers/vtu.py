"""
VTU Data Integration — CSE 22 Scheme subjects, CO/PO, notes, resources.
Data sourced from VTU official syllabus and VTU Circle.
Subject codes follow VTU 2022 scheme format: BCS3XX, BCS4XX, BCS5XX, BCS6XX, BCS7XX
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

# ── VTU CSE 22 Scheme Data (Accurate) ────────────────────────────────────────
# Source: VTU Official Syllabus + VTU Circle (vtucircle.com)
# Code format: B<DEPT><SEM><SERIAL> e.g. BCS301 = B.E CSE Sem3 Subject01

VTU_CSE_22_SCHEME = {
    3: [
        {"code": "BCS301", "name": "Mathematics for Computer Science", "credits": 4, "type": "theory"},
        {"code": "BCS302", "name": "Digital Design and Computer Organization", "credits": 4, "type": "theory"},
        {"code": "BCS303", "name": "Operating Systems", "credits": 4, "type": "theory"},
        {"code": "BCS304", "name": "Data Structures and Applications", "credits": 3, "type": "theory"},
        {"code": "BCS306A", "name": "Object Oriented Programming with Java", "credits": 3, "type": "theory"},
        {"code": "BCSL305", "name": "Data Structures Laboratory", "credits": 1, "type": "lab"},
        {"code": "BSCK307", "name": "Social Connect and Responsibility", "credits": 1, "type": "ncmc"},
    ],
    4: [
        {"code": "BCS401", "name": "Mathematics for Computer Science - IV", "credits": 4, "type": "theory"},
        {"code": "BCS402", "name": "Computer Networks", "credits": 4, "type": "theory"},
        {"code": "BCS403", "name": "Design and Analysis of Algorithms", "credits": 3, "type": "theory"},
        {"code": "BCS404", "name": "Microcontrollers and Embedded Systems", "credits": 3, "type": "theory"},
        {"code": "BCS405B", "name": "Database Management Systems", "credits": 3, "type": "theory"},
        {"code": "BCSL404", "name": "Design and Analysis of Algorithms Laboratory", "credits": 1, "type": "lab"},
        {"code": "BSCK407", "name": "Social Connect and Responsibility", "credits": 1, "type": "ncmc"},
    ],
    5: [
        {"code": "BCS501", "name": "Software Engineering and Project Management", "credits": 4, "type": "theory"},
        {"code": "BCS502", "name": "Computer Networks - II", "credits": 4, "type": "theory"},
        {"code": "BCS503", "name": "Theory of Computation", "credits": 3, "type": "theory"},
        {"code": "BCS504", "name": "Artificial Intelligence and Machine Learning", "credits": 3, "type": "theory"},
        {"code": "BCS515A", "name": "Full Stack Development", "credits": 3, "type": "theory"},
        {"code": "BCSL505", "name": "DBMS Laboratory with Mini Project", "credits": 1, "type": "lab"},
        {"code": "BCS586", "name": "Mini Project", "credits": 2, "type": "project"},
    ],
    6: [
        {"code": "BCS601", "name": "System Software and Compiler Design", "credits": 4, "type": "theory"},
        {"code": "BCS602", "name": "Computer Graphics and Visualization", "credits": 4, "type": "theory"},
        {"code": "BCS603", "name": "Data Science and its Applications", "credits": 3, "type": "theory"},
        {"code": "BCS604", "name": "Cryptography and Network Security", "credits": 3, "type": "theory"},
        {"code": "BCS613D", "name": "Cloud Computing", "credits": 3, "type": "theory"},
        {"code": "BCSL606", "name": "System Software and OS Laboratory", "credits": 1, "type": "lab"},
        {"code": "BAT601", "name": "Research Methodology and IPR", "credits": 2, "type": "theory"},
    ],
    7: [
        {"code": "BCS701", "name": "Artificial Intelligence and Machine Learning", "credits": 4, "type": "theory"},
        {"code": "BCS702", "name": "Parallel Computing", "credits": 3, "type": "theory"},
        {"code": "BCS703", "name": "Information and Network Security", "credits": 3, "type": "theory"},
        {"code": "BCS714A", "name": "Deep Learning", "credits": 3, "type": "theory"},
        {"code": "BCS755A", "name": "Internet of Things", "credits": 3, "type": "theory"},
        {"code": "BCSL708", "name": "AI/ML Laboratory", "credits": 1, "type": "lab"},
        {"code": "BCS709", "name": "Project Work Phase - I", "credits": 2, "type": "project"},
    ],
    8: [
        {"code": "BCS801", "name": "Project Work Phase - II", "credits": 10, "type": "project"},
        {"code": "BCS802", "name": "Technical Seminar", "credits": 1, "type": "seminar"},
        {"code": "BCS803", "name": "Internship / Professional Practice", "credits": 3, "type": "internship"},
    ],
}

# Course Outcomes for key subjects (accurate per VTU syllabus)
VTU_COURSE_OUTCOMES = {
    "BCS303": [
        "CO1: Explain the structure and functions of an operating system",
        "CO2: Apply CPU scheduling algorithms and evaluate their performance",
        "CO3: Implement process synchronization using semaphores and monitors",
        "CO4: Analyze deadlock prevention, avoidance, and detection strategies",
        "CO5: Describe memory management techniques including paging and segmentation",
    ],
    "BCS304": [
        "CO1: Explain different data structures and their applications",
        "CO2: Apply arrays, stacks, and queues to solve computational problems",
        "CO3: Implement linked list variations and their operations",
        "CO4: Construct and traverse trees and graphs using appropriate algorithms",
        "CO5: Apply hashing and indexing techniques for efficient data retrieval",
    ],
    "BCS403": [
        "CO1: Analyze the asymptotic performance of algorithms",
        "CO2: Apply divide and conquer strategy to solve problems",
        "CO3: Apply greedy method for optimization problems",
        "CO4: Solve problems using dynamic programming approach",
        "CO5: Understand NP-completeness and approximation algorithms",
    ],
    "BCS405B": [
        "CO1: Explain the fundamentals of database systems and ER modeling",
        "CO2: Design relational database schemas using normalization",
        "CO3: Write SQL queries for data definition and manipulation",
        "CO4: Apply transaction management and concurrency control",
        "CO5: Understand indexing, hashing, and query optimization",
    ],
    "BCS402": [
        "CO1: Explain network models, protocols, and architectures",
        "CO2: Analyze data link layer protocols and error detection",
        "CO3: Apply network layer routing algorithms",
        "CO4: Understand transport layer protocols TCP and UDP",
        "CO5: Describe application layer protocols and services",
    ],
    "BCS501": [
        "CO1: Apply software engineering principles to project development",
        "CO2: Perform requirements analysis and create SRS documents",
        "CO3: Design software using UML diagrams and design patterns",
        "CO4: Apply software testing techniques and quality assurance",
        "CO5: Understand project management, estimation, and scheduling",
    ],
    "BCS504": [
        "CO1: Explain fundamental concepts of AI and intelligent agents",
        "CO2: Implement search algorithms (BFS, DFS, A*, Hill Climbing)",
        "CO3: Apply knowledge representation and reasoning techniques",
        "CO4: Understand supervised and unsupervised machine learning",
        "CO5: Implement basic classification and regression algorithms",
    ],
    "BCS601": [
        "CO1: Explain the design of assemblers, loaders, and linkers",
        "CO2: Describe the phases of a compiler",
        "CO3: Implement lexical analysis using finite automata",
        "CO4: Apply parsing techniques (top-down and bottom-up)",
        "CO5: Generate intermediate code and perform code optimization",
    ],
    "BCS604": [
        "CO1: Explain classical encryption techniques and modern ciphers",
        "CO2: Apply symmetric key algorithms (DES, AES)",
        "CO3: Understand public key cryptography (RSA, Diffie-Hellman)",
        "CO4: Implement message authentication and digital signatures",
        "CO5: Analyze network security protocols and firewalls",
    ],
}

# Program Outcomes (VTU standard PO1-PO12)
VTU_PROGRAM_OUTCOMES = [
    "PO1: Engineering Knowledge - Apply mathematics, science, and engineering fundamentals",
    "PO2: Problem Analysis - Identify, formulate, and analyze complex engineering problems",
    "PO3: Design/Development - Design solutions for complex problems meeting specifications",
    "PO4: Conduct Investigations - Use research-based knowledge including design of experiments",
    "PO5: Modern Tool Usage - Create, select, and apply appropriate techniques and IT tools",
    "PO6: Engineer and Society - Apply reasoning informed by contextual knowledge",
    "PO7: Environment and Sustainability - Understand impact of engineering solutions",
    "PO8: Ethics - Apply ethical principles and commit to professional ethics",
    "PO9: Individual and Team Work - Function effectively as individual, member, or leader",
    "PO10: Communication - Communicate effectively on complex engineering activities",
    "PO11: Project Management and Finance - Apply engineering and management principles",
    "PO12: Life-long Learning - Recognize the need for and engage in independent learning",
]


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/subjects")
def get_vtu_subjects(
    semester: Optional[int] = Query(None, ge=3, le=8),
    _user: User = Depends(get_current_user),
):
    """Get VTU CSE 22 Scheme subjects, optionally filtered by semester."""
    if semester:
        subjects = VTU_CSE_22_SCHEME.get(semester, [])
        return {"semester": semester, "scheme": "22", "branch": "CSE", "subjects": subjects}

    return {
        "scheme": "22",
        "branch": "CSE",
        "university": "Visvesvaraya Technological University, Belagavi",
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
    subject = None
    subject_semester = None
    for sem, subjects in VTU_CSE_22_SCHEME.items():
        for s in subjects:
            if s["code"].upper() == subject_code.upper():
                subject = s
                subject_semester = sem
                break

    if not subject:
        raise HTTPException(status_code=404, detail=f"Subject {subject_code} not found in CSE 22 Scheme")

    cos = VTU_COURSE_OUTCOMES.get(subject_code.upper(), [])

    return {
        **subject,
        "semester": subject_semester,
        "scheme": "22",
        "branch": "CSE",
        "university": "VTU Belagavi",
        "course_outcomes": cos,
        "program_outcomes": VTU_PROGRAM_OUTCOMES,
    }


@router.get("/program-outcomes")
def get_program_outcomes(_user: User = Depends(get_current_user)):
    """Get VTU CSE Program Outcomes (PO1-PO12)."""
    return {
        "program_outcomes": VTU_PROGRAM_OUTCOMES,
        "branch": "CSE",
        "scheme": "22",
        "university": "Visvesvaraya Technological University, Belagavi",
    }


@router.post("/import")
def import_vtu_subjects(
    semester: Optional[int] = Query(None, ge=3, le=8),
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Import VTU subjects into the database (Admin only)."""
    semesters_to_import = [semester] if semester else list(VTU_CSE_22_SCHEME.keys())
    imported = 0

    for sem in semesters_to_import:
        for subj_data in VTU_CSE_22_SCHEME.get(sem, []):
            existing = db.query(Subject).filter(Subject.code == subj_data["code"]).first()
            if existing:
                continue

            subject = Subject(
                code=subj_data["code"],
                name=subj_data["name"],
                semester=sem,
                credits=subj_data["credits"],
                description=f"VTU CSE 22 Scheme - Semester {sem} - {subj_data['type'].title()}",
            )
            db.add(subject)
            db.flush()
            imported += 1

            # Add topics from COs if available
            cos = VTU_COURSE_OUTCOMES.get(subj_data["code"], [])
            for i, co in enumerate(cos):
                topic_name = co.split(": ", 1)[1] if ": " in co else co
                db.add(Topic(
                    subject_id=subject.id,
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
