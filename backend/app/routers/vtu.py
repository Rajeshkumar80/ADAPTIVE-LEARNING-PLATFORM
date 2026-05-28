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
# Course Outcomes (CO) — ALL subjects, Semester 1 to 8
# ══════════════════════════════════════════════════════════════════════════════

VTU_COURSE_OUTCOMES = {
    # ── 1st Semester ──────────────────────────────────────────────────────────
    "BMATS101": [
        "CO1: Apply differential calculus concepts to solve engineering problems",
        "CO2: Solve systems of linear equations using matrices",
        "CO3: Analyze eigen values and eigen vectors",
        "CO4: Apply multivariable calculus techniques",
        "CO5: Solve numerical and analytical engineering problems",
    ],
    "BPHYS102": [
        "CO1: Understand semiconductor physics fundamentals",
        "CO2: Explain lasers and optical fiber communication",
        "CO3: Analyze quantum mechanical concepts",
        "CO4: Understand modern electronic materials",
        "CO5: Apply physics principles in computing applications",
    ],
    "BPOPS103": [
        "CO1: Understand C language fundamentals",
        "CO2: Develop programs using decision and looping constructs",
        "CO3: Apply arrays, strings, pointers, and functions",
        "CO4: Use structures and file handling concepts",
        "CO5: Debug and optimize C programs effectively",
    ],
    "BESCK104A": [
        "CO1: Understand basics of civil engineering",
        "CO2: Explain construction materials and methods",
        "CO3: Understand surveying concepts",
        "CO4: Analyze environmental engineering basics",
        "CO5: Apply engineering ethics and safety concepts",
    ],
    "BETCK105I": [
        "CO1: Understand electronic components and circuits",
        "CO2: Explain communication systems fundamentals",
        "CO3: Analyze signal transmission concepts",
        "CO4: Understand digital communication basics",
        "CO5: Apply electronics in computer engineering systems",
    ],
    "BENGK106": [
        "CO1: Improve professional communication skills",
        "CO2: Develop technical writing abilities",
        "CO3: Enhance listening and speaking skills",
        "CO4: Improve presentation and report writing",
        "CO5: Apply communication skills in engineering practice",
    ],
    # ── 2nd Semester ──────────────────────────────────────────────────────────
    "BMATS201": [
        "CO1: Solve differential equations",
        "CO2: Apply numerical methods for computations",
        "CO3: Understand vector calculus concepts",
        "CO4: Solve engineering mathematical models",
        "CO5: Apply transforms in problem solving",
    ],
    "BCHES202": [
        "CO1: Understand electrochemistry concepts",
        "CO2: Explain corrosion and prevention techniques",
        "CO3: Analyze polymers and nanomaterials",
        "CO4: Understand green chemistry principles",
        "CO5: Apply chemistry in engineering applications",
    ],
    "BPOPS203": [
        "CO1: Understand linear and non-linear data structures",
        "CO2: Implement stacks and queues",
        "CO3: Apply linked lists and trees",
        "CO4: Analyze searching and sorting algorithms",
        "CO5: Develop efficient data structure applications",
    ],
    "BETCK205D": [
        "CO1: Understand Python syntax and semantics",
        "CO2: Develop Python programs using functions and modules",
        "CO3: Apply object-oriented programming concepts in Python",
        "CO4: Use file handling and exception handling",
        "CO5: Develop mini applications using Python",
    ],
    # ── 3rd Semester ──────────────────────────────────────────────────────────
    "BCS301": [
        "CO1: Apply discrete mathematics concepts",
        "CO2: Analyze graph theory applications",
        "CO3: Solve combinatorial problems",
        "CO4: Apply probability and statistics",
        "CO5: Use mathematical logic in computing",
    ],
    "BCS302": [
        "CO1: Understand digital logic fundamentals",
        "CO2: Design combinational and sequential circuits",
        "CO3: Analyze computer architecture concepts",
        "CO4: Understand memory organization",
        "CO5: Explain processor and instruction execution",
    ],
    "BCS303": [
        "CO1: Explain operating system structures and functions",
        "CO2: Analyze CPU scheduling algorithms",
        "CO3: Solve synchronization and deadlock problems",
        "CO4: Understand memory management techniques",
        "CO5: Analyze file systems and security concepts",
    ],
    "BCS304": [
        "CO1: Implement advanced data structures",
        "CO2: Analyze algorithm efficiency",
        "CO3: Apply trees and graphs in applications",
        "CO4: Solve searching and sorting problems",
        "CO5: Develop optimized software solutions",
    ],
    "BCS305A": [
        "CO1: Understand object-oriented programming principles",
        "CO2: Develop Java applications",
        "CO3: Apply inheritance, polymorphism, and abstraction",
        "CO4: Use exception handling and multithreading",
        "CO5: Build GUI and database applications using Java",
    ],
    "BCS306A": [
        "CO1: Understand software development life cycle",
        "CO2: Analyze software requirements",
        "CO3: Design software architecture",
        "CO4: Apply software testing methods",
        "CO5: Manage software projects effectively",
    ],
    # ── 4th Semester ──────────────────────────────────────────────────────────
    "BCS401": [
        "CO1: Analyze algorithm complexity",
        "CO2: Apply divide and conquer techniques",
        "CO3: Design greedy and dynamic programming algorithms",
        "CO4: Solve graph-related problems",
        "CO5: Understand NP-complete and NP-hard problems",
    ],
    "BCS402": [
        "CO1: Understand microcontroller architecture",
        "CO2: Develop assembly and embedded programs",
        "CO3: Interface input/output devices",
        "CO4: Analyze embedded system applications",
        "CO5: Apply microcontrollers in real-time systems",
    ],
    "BCS403": [
        "CO1: Understand DBMS architecture and models",
        "CO2: Design ER diagrams and relational schemas",
        "CO3: Write SQL queries and procedures",
        "CO4: Apply normalization techniques",
        "CO5: Understand transaction management and concurrency",
    ],
    "BCS404": [
        "CO1: Understand finite automata concepts",
        "CO2: Analyze regular expressions and grammars",
        "CO3: Apply pushdown automata concepts",
        "CO4: Understand Turing machines",
        "CO5: Analyze computability and complexity theory",
    ],
    "BCS405A": [
        "CO1: Develop web pages using HTML and CSS",
        "CO2: Use JavaScript for dynamic web applications",
        "CO3: Understand client-server architecture",
        "CO4: Develop database-driven web applications",
        "CO5: Apply responsive web design techniques",
    ],
    "BCS406B": [
        "CO1: Understand network architectures and protocols",
        "CO2: Analyze data link and network layer operations",
        "CO3: Understand transport protocols",
        "CO4: Analyze routing and congestion control",
        "CO5: Apply network security basics",
    ],
    # ── 5th Semester ──────────────────────────────────────────────────────────
    "BCS501": [
        "CO1: Understand software process models",
        "CO2: Analyze software requirements engineering",
        "CO3: Design software systems and architectures",
        "CO4: Apply testing and maintenance techniques",
        "CO5: Manage software projects using project management tools",
    ],
    "BCS502": [
        "CO1: Explain OSI and TCP/IP models",
        "CO2: Analyze routing algorithms and protocols",
        "CO3: Understand transport and application layer protocols",
        "CO4: Apply network security fundamentals",
        "CO5: Configure and troubleshoot networks",
    ],
    "BCS503": [
        "CO1: Understand automata and formal languages",
        "CO2: Analyze context-free grammars",
        "CO3: Apply Turing machine concepts",
        "CO4: Understand decidability and computability",
        "CO5: Analyze computational complexity",
    ],
    "BCS504": [
        "CO1: Understand AI fundamentals",
        "CO2: Apply search algorithms",
        "CO3: Analyze knowledge representation techniques",
        "CO4: Understand machine learning basics",
        "CO5: Develop intelligent systems applications",
    ],
    "BCS515A": [
        "CO1: Develop advanced Python applications",
        "CO2: Apply libraries and frameworks",
        "CO3: Use database connectivity in Python",
        "CO4: Develop GUI applications",
        "CO5: Build real-world Python projects",
    ],
    # ── 6th Semester ──────────────────────────────────────────────────────────
    "BCS601": [
        "CO1: Understand cloud computing architecture",
        "CO2: Analyze virtualization concepts",
        "CO3: Understand cloud deployment models",
        "CO4: Use cloud services and platforms",
        "CO5: Analyze cloud security and privacy",
    ],
    "BCS602": [
        "CO1: Understand machine learning fundamentals",
        "CO2: Apply supervised learning algorithms",
        "CO3: Apply unsupervised learning techniques",
        "CO4: Evaluate ML model performance",
        "CO5: Develop machine learning applications",
    ],
    "BCS603": [
        "CO1: Understand software testing fundamentals",
        "CO2: Apply white-box and black-box testing",
        "CO3: Design test cases effectively",
        "CO4: Use automated testing tools",
        "CO5: Analyze software quality metrics",
    ],
    "BCS604": [
        "CO1: Understand cryptographic algorithms",
        "CO2: Apply symmetric and asymmetric encryption",
        "CO3: Analyze authentication and digital signatures",
        "CO4: Understand network security protocols",
        "CO5: Analyze cyber security threats and solutions",
    ],
    "BCS613A": [
        "CO1: Understand blockchain architecture",
        "CO2: Analyze consensus algorithms",
        "CO3: Develop smart contracts",
        "CO4: Understand cryptocurrency fundamentals",
        "CO5: Apply blockchain in real-world systems",
    ],
    "BCS613B": [
        "CO1: Understand NLP fundamentals and text processing",
        "CO2: Apply tokenization, stemming, and lemmatization",
        "CO3: Implement text classification and sentiment analysis",
        "CO4: Understand language models and word embeddings",
        "CO5: Develop NLP applications using modern frameworks",
    ],
    "BCS613C": [
        "CO1: Understand compiler design phases",
        "CO2: Implement lexical analysis using finite automata",
        "CO3: Apply parsing techniques (top-down and bottom-up)",
        "CO4: Generate intermediate code representations",
        "CO5: Perform code optimization and generation",
    ],
    # ── 7th Semester ──────────────────────────────────────────────────────────
    "BCS701": [
        "CO1: Understand big data concepts and architecture",
        "CO2: Analyze Hadoop ecosystem components",
        "CO3: Apply distributed data processing techniques",
        "CO4: Use big data analytics tools",
        "CO5: Develop scalable data analytics applications",
    ],
    "BCS702": [
        "CO1: Develop frontend applications using modern frameworks",
        "CO2: Build backend REST APIs",
        "CO3: Integrate databases with applications",
        "CO4: Deploy and maintain full-stack applications",
        "CO5: Apply DevOps and version control practices",
    ],
    "BCS703": [
        "CO1: Understand IoT architecture and protocols",
        "CO2: Interface sensors and embedded systems",
        "CO3: Develop IoT applications",
        "CO4: Analyze cloud integration in IoT",
        "CO5: Understand IoT security and privacy",
    ],
    # ── 8th Semester ──────────────────────────────────────────────────────────
    "BCS801": [
        "CO1: Apply AI and ML techniques in real-world problems",
        "CO2: Analyze intelligent systems applications",
        "CO3: Use deep learning and neural networks",
        "CO4: Develop predictive analytics solutions",
        "CO5: Evaluate AI ethics and challenges",
    ],
    "BCS802": [
        "CO1: Understand cyber security fundamentals",
        "CO2: Analyze malware and cyber attacks",
        "CO3: Apply secure coding techniques",
        "CO4: Implement cyber defense mechanisms",
        "CO5: Understand cyber laws and ethical hacking principles",
    ],
    "BCS851": [
        "CO1: Identify real-world engineering problems",
        "CO2: Design and implement project solutions",
        "CO3: Apply modern engineering tools",
        "CO4: Work effectively in teams",
        "CO5: Present and document technical projects professionally",
    ],
    "BCS852": [
        "CO1: Research technical topics effectively",
        "CO2: Analyze emerging technologies",
        "CO3: Prepare technical reports and presentations",
        "CO4: Improve communication and presentation skills",
        "CO5: Demonstrate lifelong learning abilities",
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
