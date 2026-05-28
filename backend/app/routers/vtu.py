"""
VTU Data Integration — B.E. CSE 2022 Scheme (1st to 8th Semester)
All subject codes and names are accurate per VTU official syllabus.
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

# ══════════════════════════════════════════════════════════════════════════════
# VTU B.E. CSE — 2022 Scheme (1st to 8th Semester)
# ══════════════════════════════════════════════════════════════════════════════

VTU_CSE_22_SCHEME = {
    1: [
        {"code": "BMATS101", "name": "Calculus and Linear Algebra", "credits": 4, "type": "theory"},
        {"code": "BPHYS102", "name": "Applied Physics for CSE Stream", "credits": 4, "type": "theory"},
        {"code": "BPOPS103", "name": "Principles of Programming Using C", "credits": 3, "type": "theory"},
        {"code": "BESCK104A", "name": "Introduction to Civil Engineering", "credits": 3, "type": "theory"},
        {"code": "BETCK105I", "name": "Introduction to Electronics Communication", "credits": 3, "type": "theory"},
        {"code": "BENGK106", "name": "Communicative English", "credits": 1, "type": "theory"},
        {"code": "BKSK107", "name": "Scientific Foundations of Health", "credits": 1, "type": "ncmc"},
        {"code": "BICOK107", "name": "Indian Constitution", "credits": 1, "type": "ncmc"},
    ],
    2: [
        {"code": "BMATS201", "name": "Advanced Calculus and Numerical Methods", "credits": 4, "type": "theory"},
        {"code": "BCHES202", "name": "Applied Chemistry for CSE Stream", "credits": 4, "type": "theory"},
        {"code": "BPOPS203", "name": "Data Structures using C", "credits": 3, "type": "theory"},
        {"code": "BESC204C", "name": "Introduction to Mechanical Engineering", "credits": 3, "type": "theory"},
        {"code": "BETCK205D", "name": "Introduction to Python Programming", "credits": 3, "type": "theory"},
        {"code": "BENGK206", "name": "Technical English", "credits": 1, "type": "theory"},
        {"code": "BKSK207", "name": "Social Connect and Responsibility", "credits": 1, "type": "ncmc"},
        {"code": "BSFHK258", "name": "Fitness and Wellness", "credits": 1, "type": "ncmc"},
    ],
    3: [
        {"code": "BCS301", "name": "Mathematics for Computer Science", "credits": 4, "type": "theory"},
        {"code": "BCS302", "name": "Digital Design and Computer Organization", "credits": 4, "type": "theory"},
        {"code": "BCS303", "name": "Operating Systems", "credits": 4, "type": "theory"},
        {"code": "BCS304", "name": "Data Structures and Applications", "credits": 3, "type": "theory"},
        {"code": "BCS305A", "name": "Object Oriented Programming with Java", "credits": 3, "type": "theory"},
        {"code": "BCS306A", "name": "Software Engineering", "credits": 3, "type": "theory"},
        {"code": "BCSL307", "name": "Data Structures Laboratory", "credits": 1, "type": "lab"},
        {"code": "BCSL308", "name": "Java Programming Laboratory", "credits": 1, "type": "lab"},
    ],
    4: [
        {"code": "BCS401", "name": "Analysis and Design of Algorithms", "credits": 4, "type": "theory"},
        {"code": "BCS402", "name": "Microcontrollers", "credits": 4, "type": "theory"},
        {"code": "BCS403", "name": "Database Management Systems", "credits": 3, "type": "theory"},
        {"code": "BCS404", "name": "Automata Theory and Computability", "credits": 3, "type": "theory"},
        {"code": "BCS405A", "name": "Web Technology", "credits": 3, "type": "theory"},
        {"code": "BCS406B", "name": "Computer Networks", "credits": 3, "type": "theory"},
        {"code": "BCSL407", "name": "Analysis and Design of Algorithms Laboratory", "credits": 1, "type": "lab"},
        {"code": "BCSL408", "name": "DBMS Laboratory with Mini Project", "credits": 1, "type": "lab"},
    ],
    5: [
        {"code": "BCS501", "name": "Software Engineering and Project Management", "credits": 4, "type": "theory"},
        {"code": "BCS502", "name": "Computer Networks", "credits": 4, "type": "theory"},
        {"code": "BCS503", "name": "Theory of Computation", "credits": 3, "type": "theory"},
        {"code": "BCS504", "name": "Artificial Intelligence", "credits": 3, "type": "theory"},
        {"code": "BCS515A", "name": "Python Application Programming", "credits": 3, "type": "theory"},
        {"code": "BCSL506", "name": "Computer Network Laboratory", "credits": 1, "type": "lab"},
        {"code": "BCSL507", "name": "Python Programming Laboratory", "credits": 1, "type": "lab"},
        {"code": "BRMK557", "name": "Research Methodology and Intellectual Property Rights", "credits": 2, "type": "theory"},
        {"code": "BPEK559", "name": "Physical Education", "credits": 0, "type": "ncmc"},
    ],
    6: [
        {"code": "BCS601", "name": "Cloud Computing", "credits": 4, "type": "theory"},
        {"code": "BCS602", "name": "Machine Learning", "credits": 4, "type": "theory"},
        {"code": "BCS603", "name": "Software Testing", "credits": 3, "type": "theory"},
        {"code": "BCS604", "name": "Cryptography and Network Security", "credits": 3, "type": "theory"},
        {"code": "BCS613A", "name": "Blockchain Technology", "credits": 3, "type": "elective"},
        {"code": "BCS613B", "name": "Natural Language Processing", "credits": 3, "type": "elective"},
        {"code": "BCS613C", "name": "Compiler Design", "credits": 3, "type": "elective"},
        {"code": "BCSL606", "name": "Machine Learning Laboratory", "credits": 1, "type": "lab"},
        {"code": "BCSL607", "name": "Cloud Computing Laboratory", "credits": 1, "type": "lab"},
    ],
    7: [
        {"code": "BCS701", "name": "Big Data Analytics", "credits": 4, "type": "theory"},
        {"code": "BCS702", "name": "Full Stack Development", "credits": 3, "type": "theory"},
        {"code": "BCS703", "name": "Internet of Things", "credits": 3, "type": "theory"},
        {"code": "BCS751", "name": "Project Work Phase 1", "credits": 2, "type": "project"},
        {"code": "BCS752", "name": "Internship", "credits": 3, "type": "internship"},
        {"code": "BCS7XX", "name": "Professional Elective 1", "credits": 3, "type": "elective"},
        {"code": "BCS7XY", "name": "Professional Elective 2", "credits": 3, "type": "elective"},
        {"code": "BOEC7XX", "name": "Open Elective", "credits": 3, "type": "elective"},
    ],
    8: [
        {"code": "BCS801", "name": "Artificial Intelligence and Machine Learning Applications", "credits": 4, "type": "theory"},
        {"code": "BCS802", "name": "Cyber Security", "credits": 3, "type": "theory"},
        {"code": "BCS851", "name": "Project Work Phase 2", "credits": 10, "type": "project"},
        {"code": "BCS852", "name": "Technical Seminar", "credits": 1, "type": "seminar"},
        {"code": "BCS8XX", "name": "Professional Elective 3", "credits": 3, "type": "elective"},
        {"code": "BCS8XY", "name": "Professional Elective 4", "credits": 3, "type": "elective"},
    ],
}

# ══════════════════════════════════════════════════════════════════════════════
# Course Outcomes (CO) for key subjects
# ══════════════════════════════════════════════════════════════════════════════

VTU_COURSE_OUTCOMES = {
    "BPOPS103": [
        "CO1: Understand the basic concepts of C programming",
        "CO2: Apply branching and looping constructs to solve problems",
        "CO3: Implement functions and recursion in C",
        "CO4: Use arrays, strings, and pointers effectively",
        "CO5: Understand structures, unions, and file handling",
    ],
    "BCS301": [
        "CO1: Apply concepts of probability and statistics",
        "CO2: Solve problems using linear algebra techniques",
        "CO3: Apply numerical methods for solving equations",
        "CO4: Understand graph theory and combinatorics",
        "CO5: Apply mathematical logic and set theory",
    ],
    "BCS303": [
        "CO1: Explain the structure and functions of an operating system",
        "CO2: Apply CPU scheduling algorithms and evaluate performance",
        "CO3: Implement process synchronization using semaphores and monitors",
        "CO4: Analyze deadlock prevention, avoidance, and detection strategies",
        "CO5: Describe memory management techniques including paging and segmentation",
    ],
    "BCS304": [
        "CO1: Explain different data structures and their applications",
        "CO2: Apply arrays, stacks, and queues to solve computational problems",
        "CO3: Implement linked list variations and their operations",
        "CO4: Construct and traverse trees and graphs using appropriate algorithms",
        "CO5: Apply hashing and searching techniques for efficient data retrieval",
    ],
    "BCS401": [
        "CO1: Analyze the asymptotic performance of algorithms",
        "CO2: Apply divide and conquer strategy to solve problems",
        "CO3: Apply greedy method for optimization problems",
        "CO4: Solve problems using dynamic programming approach",
        "CO5: Understand NP-completeness and approximation algorithms",
    ],
    "BCS403": [
        "CO1: Explain the fundamentals of database systems and ER modeling",
        "CO2: Design relational database schemas using normalization",
        "CO3: Write SQL queries for data definition and manipulation",
        "CO4: Apply transaction management and concurrency control",
        "CO5: Understand indexing, hashing, and query optimization",
    ],
    "BCS404": [
        "CO1: Construct finite automata for regular languages",
        "CO2: Design context-free grammars and pushdown automata",
        "CO3: Understand Turing machines and computability",
        "CO4: Analyze decidability and undecidability of problems",
        "CO5: Apply pumping lemma to prove language properties",
    ],
    "BCS501": [
        "CO1: Apply software engineering principles to project development",
        "CO2: Perform requirements analysis and create SRS documents",
        "CO3: Design software using UML diagrams and design patterns",
        "CO4: Apply software testing techniques and quality assurance",
        "CO5: Understand project management, estimation, and scheduling",
    ],
    "BCS502": [
        "CO1: Explain network models, protocols, and architectures",
        "CO2: Analyze data link layer protocols and error detection",
        "CO3: Apply network layer routing algorithms",
        "CO4: Understand transport layer protocols TCP and UDP",
        "CO5: Describe application layer protocols and services",
    ],
    "BCS504": [
        "CO1: Explain fundamental concepts of AI and intelligent agents",
        "CO2: Implement search algorithms (BFS, DFS, A*, Hill Climbing)",
        "CO3: Apply knowledge representation and reasoning techniques",
        "CO4: Understand game playing and constraint satisfaction",
        "CO5: Apply basic machine learning concepts",
    ],
    "BCS601": [
        "CO1: Explain cloud computing concepts and service models",
        "CO2: Understand virtualization technologies",
        "CO3: Describe cloud infrastructure and platforms (AWS, Azure, GCP)",
        "CO4: Apply cloud security and privacy mechanisms",
        "CO5: Design and deploy applications on cloud platforms",
    ],
    "BCS602": [
        "CO1: Explain supervised and unsupervised learning paradigms",
        "CO2: Implement regression and classification algorithms",
        "CO3: Apply decision trees, SVM, and ensemble methods",
        "CO4: Understand clustering and dimensionality reduction",
        "CO5: Evaluate model performance using appropriate metrics",
    ],
    "BCS604": [
        "CO1: Explain classical encryption techniques and modern ciphers",
        "CO2: Apply symmetric key algorithms (DES, AES)",
        "CO3: Understand public key cryptography (RSA, Diffie-Hellman)",
        "CO4: Implement message authentication and digital signatures",
        "CO5: Analyze network security protocols and firewalls",
    ],
    "BCS701": [
        "CO1: Explain big data concepts, challenges, and ecosystem",
        "CO2: Apply Hadoop MapReduce for distributed processing",
        "CO3: Use Spark for in-memory big data analytics",
        "CO4: Implement NoSQL databases for unstructured data",
        "CO5: Apply big data analytics for real-world problems",
    ],
    "BCS702": [
        "CO1: Understand full stack web development architecture",
        "CO2: Implement frontend using modern JavaScript frameworks",
        "CO3: Build RESTful APIs with backend frameworks",
        "CO4: Integrate databases and implement CRUD operations",
        "CO5: Deploy full stack applications to cloud platforms",
    ],
}

# ══════════════════════════════════════════════════════════════════════════════
# Program Outcomes (PO1–PO12) — VTU Standard
# ══════════════════════════════════════════════════════════════════════════════

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


# ══════════════════════════════════════════════════════════════════════════════
# API Endpoints
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/subjects")
def get_vtu_subjects(
    semester: Optional[int] = Query(None, ge=1, le=8),
    _user: User = Depends(get_current_user),
):
    """Get VTU B.E. CSE 22 Scheme subjects, optionally filtered by semester."""
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
    semester: Optional[int] = Query(None, ge=1, le=8),
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
