"""
Seed initial data — runs once on startup if DB is empty.
Creates a default student, admin, subjects, achievements, certificates.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.auth import hash_password
from app.models import (
    User, Subject, Topic, Test, Question, JournalEntry,
    Certificate, Achievement, Notification,
)


def seed_database(db: Session):
    """Insert default data if DB is empty."""
    if db.query(User).count() > 0:
        return  # already seeded

    # ===== Users =====
    student = User(
        email="student@vtu.edu",
        username="student",
        full_name="Rajesh Kumar",
        hashed_password=hash_password("student123"),
        role="student",
        usn="1GD23CS001",
        semester=6,
        branch="Computer Science",
        section="A",
        cgpa=8.5,
    )
    admin = User(
        email="admin@vtu.edu",
        username="admin",
        full_name="Dr. Priya Sharma",
        hashed_password=hash_password("admin123"),
        role="admin",
        employee_id="EMP001",
        department="Computer Science",
    )
    db.add_all([student, admin])
    db.commit()
    db.refresh(student)
    db.refresh(admin)

    # ===== Subjects =====
    subjects = [
        Subject(code="CS501", name="Data Structures & Algorithms", credits=4),
        Subject(code="CS502", name="Database Management Systems", credits=4),
        Subject(code="CS503", name="Operating Systems", credits=4),
        Subject(code="CS504", name="Computer Networks", credits=3),
        Subject(code="CS505", name="Software Engineering", credits=3),
        Subject(code="CS506", name="Artificial Intelligence", credits=4),
    ]
    db.add_all(subjects)
    db.commit()
    for s in subjects:
        db.refresh(s)

    # ===== Topics for DSA =====
    topics = [
        Topic(subject_id=subjects[0].id, name="Arrays & Strings", difficulty="easy", order_index=1),
        Topic(subject_id=subjects[0].id, name="Linked Lists", difficulty="medium", order_index=2),
        Topic(subject_id=subjects[0].id, name="Trees & Graphs", difficulty="hard", order_index=3),
        Topic(subject_id=subjects[0].id, name="Dynamic Programming", difficulty="hard", order_index=4),
        Topic(subject_id=subjects[1].id, name="SQL Queries", difficulty="medium", order_index=1),
        Topic(subject_id=subjects[1].id, name="Normalization", difficulty="medium", order_index=2),
    ]
    db.add_all(topics)
    db.commit()

    # ===== Sample Test =====
    test = Test(
        subject_id=subjects[0].id,
        title="DSA Mid-Term",
        description="Comprehensive test on Data Structures",
        type="midterm",
        duration_minutes=90,
        total_marks=100,
        passing_marks=40,
    )
    db.add(test)
    db.commit()
    db.refresh(test)

    questions = [
        Question(
            test_id=test.id,
            question_text="What is the time complexity of binary search?",
            question_type="mcq",
            options={"a": "O(n)", "b": "O(log n)", "c": "O(n^2)", "d": "O(1)"},
            correct_answer="b",
            marks=2,
        ),
        Question(
            test_id=test.id,
            question_text="Which data structure uses LIFO?",
            question_type="mcq",
            options={"a": "Queue", "b": "Stack", "c": "Tree", "d": "Graph"},
            correct_answer="b",
            marks=2,
        ),
    ]
    db.add_all(questions)
    db.commit()

    # ===== Certificates =====
    certs = [
        Certificate(user_id=student.id, title="Data Structures Mastery", subject="DSA", type="excellence", score=92),
        Certificate(user_id=student.id, title="Database Expert", subject="DBMS", type="achievement", score=88),
        Certificate(user_id=student.id, title="OS Foundations", subject="Operating Systems", type="completion", score=85),
        Certificate(user_id=student.id, title="AI Workshop", subject="AI", type="excellence", score=95),
    ]
    db.add_all(certs)

    # ===== Achievements =====
    achs = [
        Achievement(user_id=student.id, title="7-Day Streak", description="Studied for 7 days in a row", icon="🔥", rarity="common"),
        Achievement(user_id=student.id, title="Perfect Score", description="Got 100% on a test", icon="⭐", rarity="rare"),
        Achievement(user_id=student.id, title="Code Warrior", description="Made 20 journal entries", icon="⚔️", rarity="epic"),
        Achievement(user_id=student.id, title="Top of Class", description="Ranked #1 in semester", icon="🏆", rarity="legendary"),
        Achievement(user_id=student.id, title="Quiz Master", description="Completed 10 quizzes", icon="🧠", rarity="common"),
        Achievement(user_id=student.id, title="Night Owl", description="Studied past midnight", icon="🌙", rarity="common"),
        Achievement(user_id=student.id, title="Speed Demon", description="Finished test in record time", icon="⚡", rarity="rare"),
        Achievement(user_id=student.id, title="AI Whisperer", description="Asked AI 50+ questions", icon="🤖", rarity="epic"),
    ]
    db.add_all(achs)

    # ===== Sample Journal Entries =====
    entries = [
        JournalEntry(
            user_id=student.id,
            title="Binary Search Implementation",
            code="def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
            language="Python",
            tags=["algorithm", "searching"],
            is_starred=True,
        ),
        JournalEntry(
            user_id=student.id,
            title="Quick Sort Algorithm",
            code="function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.slice(1).filter(x => x < pivot);\n  const right = arr.slice(1).filter(x => x >= pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}",
            language="JavaScript",
            tags=["algorithm", "sorting"],
        ),
    ]
    db.add_all(entries)

    # ===== Notifications =====
    notifications = [
        Notification(user_id=student.id, title="Welcome!", message="Welcome to AdaptLearn. Start your learning journey today.", type="info"),
        Notification(user_id=student.id, title="New test available", message="OS Mid-Term has been scheduled for May 18.", type="info"),
    ]
    db.add_all(notifications)

    db.commit()
    print("Database seeded successfully")
