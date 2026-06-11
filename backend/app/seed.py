"""
Seed initial data — runs once on startup if DB is empty.
Creates all 121 GCEM CSE 6th sem students + admin.
Login: email = usn@gcem.edu, password = usn (lowercase)
"""

import random
from sqlalchemy.orm import Session

from app.auth import hash_password
from app.models import (
    User, Subject, Topic, Test, Question,
    Certificate, Achievement, Notification,
)

# All 121 GCEM CSE 6th Sem students
GCEM_STUDENTS = [
    # Section A
    {"usn": "1GD23CS001", "name": "A S Pallavi",                "section": "A"},
    {"usn": "1GD23CS002", "name": "Abdul Shuaib",               "section": "A"},
    {"usn": "1GD23CS003", "name": "Abhishek Mannatharaj",       "section": "A"},
    {"usn": "1GD23CS004", "name": "Abhishek R",                 "section": "A"},
    {"usn": "1GD23CS005", "name": "Adithya D H",                "section": "A"},
    {"usn": "1GD23CS006", "name": "Aishwarya R S",              "section": "A"},
    {"usn": "1GD23CS007", "name": "Akash",                      "section": "A"},
    {"usn": "1GD23CS008", "name": "Akshay Adaka",               "section": "A"},
    {"usn": "1GD23CS009", "name": "Ambrish R",                  "section": "A"},
    {"usn": "1GD23CS010", "name": "Angel Beulah K",             "section": "A"},
    {"usn": "1GD23CS011", "name": "Anusha S",                   "section": "A"},
    {"usn": "1GD23CS012", "name": "Anushree M N",               "section": "A"},
    {"usn": "1GD23CS013", "name": "Ayushman Kumar",             "section": "A"},
    {"usn": "1GD23CS014", "name": "B Brunda",                   "section": "A"},
    {"usn": "1GD23CS015", "name": "Bindhushree M",              "section": "A"},
    {"usn": "1GD23CS016", "name": "C S Pavan Kumar",            "section": "A"},
    {"usn": "1GD23CS017", "name": "Challa Himasree",            "section": "A"},
    {"usn": "1GD23CS018", "name": "Challa Janaki Ram Reddy",    "section": "A"},
    {"usn": "1GD23CS020", "name": "Chandana D",                 "section": "A"},
    {"usn": "1GD23CS021", "name": "Chandra Prakash V",          "section": "A"},
    {"usn": "1GD23CS023", "name": "Chetan G M",                 "section": "A"},
    {"usn": "1GD23CS024", "name": "Chiranjeevi A",              "section": "A"},
    {"usn": "1GD23CS025", "name": "Chitra V Gowda",             "section": "A"},
    {"usn": "1GD23CS026", "name": "Darshan A",                  "section": "A"},
    {"usn": "1GD23CS028", "name": "Devadhar S Murthy",          "section": "A"},
    {"usn": "1GD23CS029", "name": "Divya D K",                  "section": "A"},
    {"usn": "1GD23CS030", "name": "Divyashree C",               "section": "A"},
    {"usn": "1GD23CS031", "name": "Divyashree R M",             "section": "A"},
    {"usn": "1GD23CS032", "name": "Fayaz",                      "section": "A"},
    {"usn": "1GD23CS033", "name": "Gagana C",                   "section": "A"},
    {"usn": "1GD23CS034", "name": "Harini S",                   "section": "A"},
    {"usn": "1GD23CS035", "name": "Harshit Raj",                "section": "A"},
    {"usn": "1GD23CS036", "name": "Harshith H R",               "section": "A"},
    {"usn": "1GD23CS037", "name": "Harshitha B A",              "section": "A"},
    {"usn": "1GD23CS038", "name": "Himani Sadanala",            "section": "A"},
    {"usn": "1GD23CS039", "name": "Jahnavi N",                  "section": "A"},
    {"usn": "1GD23CS040", "name": "Janani B M",                 "section": "A"},
    {"usn": "1GD23CS042", "name": "Jyesht M",                   "section": "A"},
    {"usn": "1GD23CS043", "name": "K Harshini Priya",           "section": "A"},
    {"usn": "1GD23CS044", "name": "K S Bhavana",                "section": "A"},
    {"usn": "1GD23CS045", "name": "K Tarunisri Reddy",          "section": "A"},
    {"usn": "1GD23CS046", "name": "Karthik V C",                "section": "A"},
    {"usn": "1GD23CS048", "name": "Kavya S Irannanavar",        "section": "A"},
    {"usn": "1GD23CS049", "name": "Kavyashree Ponnurangam",     "section": "A"},
    {"usn": "1GD23CS050", "name": "Keerthi K P",                "section": "A"},
    {"usn": "1GD23CS051", "name": "Kondapalli Sirisha",         "section": "A"},
    {"usn": "1GD23CS052", "name": "Kreshika M",                 "section": "A"},
    {"usn": "1GD23CS053", "name": "Kruthin H",                  "section": "A"},
    {"usn": "1GD23CS054", "name": "Kusuma T P",                 "section": "A"},
    {"usn": "1GD23CS056", "name": "M M Bharath",                "section": "A"},
    {"usn": "1GD23CS057", "name": "M Vivek",                    "section": "A"},
    {"usn": "1GD23CS058", "name": "Maddela Tarun",              "section": "A"},
    {"usn": "1GD23CS059", "name": "Madhushalini",               "section": "A"},
    {"usn": "1GD23CS060", "name": "Madhuvathi K L",             "section": "A"},
    {"usn": "1GD23CS061", "name": "Mallikarjun",                "section": "A"},
    {"usn": "1GD23CS062", "name": "Manoj",                      "section": "A"},
    # Section A lateral
    {"usn": "1GD24CS400", "name": "Bhuvan Gowda",               "section": "A"},
    {"usn": "1GD24CS402", "name": "Dixit V",                    "section": "A"},
    {"usn": "1GD24CS403", "name": "Girish S V",                 "section": "A"},
    {"usn": "1GD24CS407", "name": "Rajesh G",                   "section": "A"},
    {"usn": "1GD24CS408", "name": "Shivannda Swamy",            "section": "A"},
    {"usn": "1GD24CS409", "name": "Supriya",                    "section": "A"},
    # Section B
    {"usn": "1GD23CS063", "name": "Maria Anushka S",            "section": "B"},
    {"usn": "1GD23CS064", "name": "Mohith S",                   "section": "B"},
    {"usn": "1GD23CS065", "name": "Monalisha Nayak",            "section": "B"},
    {"usn": "1GD23CS066", "name": "Monitha Lokesh K",           "section": "B"},
    {"usn": "1GD23CS067", "name": "Mounika D G",                "section": "B"},
    {"usn": "1GD23CS068", "name": "Navya Shree S",              "section": "B"},
    {"usn": "1GD23CS069", "name": "Neha Hegde",                 "section": "B"},
    {"usn": "1GD23CS070", "name": "Nithelan Jayakumar",         "section": "B"},
    {"usn": "1GD23CS072", "name": "Nithin S",                   "section": "B"},
    {"usn": "1GD23CS073", "name": "Om Prakash Sahoo",           "section": "B"},
    {"usn": "1GD23CS074", "name": "P Mohan",                    "section": "B"},
    {"usn": "1GD23CS075", "name": "Pavan S",                    "section": "B"},
    {"usn": "1GD23CS076", "name": "P Yagna Priya",              "section": "B"},
    {"usn": "1GD23CS077", "name": "Ponnarasi",                  "section": "B"},
    {"usn": "1GD23CS079", "name": "Preethi Jangir",             "section": "B"},
    {"usn": "1GD23CS080", "name": "Prince Kumar",               "section": "B"},
    {"usn": "1GD23CS081", "name": "Priya R P",                  "section": "B"},
    {"usn": "1GD23CS082", "name": "Punith T N",                 "section": "B"},
    {"usn": "1GD23CS083", "name": "R Gambheer",                 "section": "B"},
    {"usn": "1GD23CS084", "name": "Rachana M",                  "section": "B"},
    {"usn": "1GD23CS085", "name": "Rajini K R",                 "section": "B"},
    {"usn": "1GD23CS086", "name": "Rakshitha M",                "section": "B"},
    {"usn": "1GD23CS087", "name": "Rakshitha M",                "section": "B"},
    {"usn": "1GD23CS088", "name": "Ranjita J B",                "section": "B"},
    {"usn": "1GD23CS089", "name": "Rithika B",                  "section": "B"},
    {"usn": "1GD23CS091", "name": "Rupa Shree H V",             "section": "B"},
    {"usn": "1GD23CS092", "name": "Sahana N Reddy",             "section": "B"},
    {"usn": "1GD23CS093", "name": "Sakshi Sharma",              "section": "B"},
    {"usn": "1GD23CS094", "name": "Sakthi Mageswari V",         "section": "B"},
    {"usn": "1GD23CS098", "name": "Shreeka K",                  "section": "B"},
    {"usn": "1GD23CS099", "name": "Shreeya R",                  "section": "B"},
    {"usn": "1GD23CS100", "name": "Shubhashree S V",            "section": "B"},
    {"usn": "1GD23CS101", "name": "Sinchana A Padmashree",      "section": "B"},
    {"usn": "1GD23CS102", "name": "Sindhu K N",                 "section": "B"},
    {"usn": "1GD23CS104", "name": "Soujanya",                   "section": "B"},
    {"usn": "1GD23CS105", "name": "Spurthi G",                  "section": "B"},
    {"usn": "1GD23CS106", "name": "Srujan H R",                 "section": "B"},
    {"usn": "1GD23CS107", "name": "Sugain Ahamed A",            "section": "B"},
    {"usn": "1GD23CS108", "name": "Sunny Kumar Sharma",         "section": "B"},
    {"usn": "1GD23CS109", "name": "Tarun Kumar Pathak",         "section": "B"},
    {"usn": "1GD23CS111", "name": "Thanishasri S S",            "section": "B"},
    {"usn": "1GD23CS112", "name": "Thirupathi Avinash",         "section": "B"},
    {"usn": "1GD23CS113", "name": "Ujwala T S",                 "section": "B"},
    {"usn": "1GD23CS114", "name": "V Sanjay",                   "section": "B"},
    {"usn": "1GD23CS115", "name": "V Sushma",                   "section": "B"},
    {"usn": "1GD23CS116", "name": "Varun M L",                  "section": "B"},
    {"usn": "1GD23CS117", "name": "Vennela G",                  "section": "B"},
    {"usn": "1GD23CS118", "name": "Venu M",                     "section": "B"},
    {"usn": "1GD23CS119", "name": "Vijay Kumar K L",            "section": "B"},
    {"usn": "1GD23CS120", "name": "Vinay S",                    "section": "B"},
    {"usn": "1GD23CS121", "name": "Vinayaka V",                 "section": "B"},
    {"usn": "1GD23CS122", "name": "Vishakha S Panchgalle",      "section": "B"},
    {"usn": "1GD23CS123", "name": "Vivek S Kashyap",            "section": "B"},
    {"usn": "1GD23CS124", "name": "Thanusha Y P",               "section": "B"},
    {"usn": "1GD23CS125", "name": "Yogesh S",                   "section": "B"},
    {"usn": "1GD23CS126", "name": "Yogesh Shankar",             "section": "B"},
    # Section B lateral
    {"usn": "1GD24CS401", "name": "Chandushree D S",            "section": "B"},
    {"usn": "1GD24CS404", "name": "Keerthana A",                "section": "B"},
    {"usn": "1GD24CS405", "name": "Kumari N",                   "section": "B"},
]


def seed_database(db: Session):
    """Insert default data, checking for existing records to prevent conflicts."""
    rng = random.Random(42)

    # ===== Admin =====
    admin = db.query(User).filter(
        (User.email == "admin@gcem.edu") | (User.username == "admin")
    ).first()
    if not admin:
        admin = User(
            email="admin@gcem.edu",
            username="admin",
            full_name="Dr. Priya Sharma",
            hashed_password=hash_password("admin123"),
            role="admin",
            employee_id="EMP001",
            department="Computer Science",
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

    # ===== 121 Students — email = usn@gcem.edu, password = usn (lowercase) =====
    student_users = []
    for s in GCEM_STUDENTS:
        usn = s["usn"]
        email = f"{usn.lower()}@gcem.edu"
        username = usn.lower()

        # Check if already exists
        user = db.query(User).filter(
            (User.usn == usn) | (User.email == email) | (User.username == username)
        ).first()

        if not user:
            cgpa = round(rng.uniform(6.5, 9.5), 2)
            # Boost Rajesh G, K S Bhavana, Janani B M
            if usn == "1GD24CS407":
                cgpa = 8.75
            elif usn == "1GD23CS044":
                cgpa = 9.52
            elif usn == "1GD23CS040":
                cgpa = 9.21

            user = User(
                email=email,
                username=username,
                full_name=s["name"],
                hashed_password=hash_password(usn.lower()),  # password = usn
                role="student",
                usn=usn,
                semester=6,
                branch="Computer Science",
                section=s["section"],
                cgpa=cgpa,
            )
            db.add(user)
        student_users.append((user, s))

    db.commit()
    for u, _ in student_users:
        try:
            db.refresh(u)
        except Exception:
            pass

    # ===== Subjects =====
    default_subjects = [
        {"code": "BCS601", "name": "Cloud Computing", "credits": 4},
        {"code": "BCS602", "name": "Machine Learning", "credits": 4},
        {"code": "BCS603", "name": "Software Testing", "credits": 3},
        {"code": "BCS604", "name": "Cryptography and Network Security", "credits": 3},
        {"code": "BCS613A", "name": "Blockchain Technology", "credits": 3},
        {"code": "BCS613C", "name": "Compiler Design", "credits": 3},
    ]
    subjects = []
    for sub_data in default_subjects:
        sub = db.query(Subject).filter(Subject.code == sub_data["code"]).first()
        if not sub:
            sub = Subject(code=sub_data["code"], name=sub_data["name"], credits=sub_data["credits"])
            db.add(sub)
            db.commit()
            db.refresh(sub)
        subjects.append(sub)

    # ===== Topics =====
    default_topics = [
        {"subject_code": "BCS601", "name": "Virtualization Concepts", "difficulty": "medium", "order_index": 1},
        {"subject_code": "BCS601", "name": "Cloud Architecture", "difficulty": "medium", "order_index": 2},
        {"subject_code": "BCS601", "name": "Cloud Security", "difficulty": "hard", "order_index": 3},
        {"subject_code": "BCS602", "name": "Supervised Learning", "difficulty": "medium", "order_index": 1},
        {"subject_code": "BCS602", "name": "Neural Networks", "difficulty": "hard", "order_index": 2},
        {"subject_code": "BCS604", "name": "RSA Algorithm", "difficulty": "hard", "order_index": 1},
        {"subject_code": "BCS604", "name": "Digital Signatures", "difficulty": "medium", "order_index": 2},
    ]
    for top_data in default_topics:
        sub = next((s for s in subjects if s.code == top_data["subject_code"]), None)
        if not sub:
            continue
        topic = db.query(Topic).filter(Topic.subject_id == sub.id, Topic.name == top_data["name"]).first()
        if not topic:
            topic = Topic(
                subject_id=sub.id,
                name=top_data["name"],
                difficulty=top_data["difficulty"],
                order_index=top_data["order_index"]
            )
            db.add(topic)
    db.commit()

    # ===== Sample Test =====
    sub_cc = next((s for s in subjects if s.code == "BCS601"), None)
    test = None
    if sub_cc:
        test = db.query(Test).filter(Test.subject_id == sub_cc.id, Test.title == "Cloud Computing Mid-Term").first()
        if not test:
            test = Test(
                subject_id=sub_cc.id,
                title="Cloud Computing Mid-Term",
                description="BCS601 - Covers Modules 1-3",
                type="midterm",
                duration_minutes=90,
                total_marks=50,
                passing_marks=20,
            )
            db.add(test)
            db.commit()
            db.refresh(test)

    # ===== Questions =====
    if test:
        q1 = db.query(Question).filter(Question.test_id == test.id, Question.question_text == "Which is NOT a cloud service model?").first()
        if not q1:
            q1 = Question(
                test_id=test.id,
                question_text="Which is NOT a cloud service model?",
                question_type="mcq",
                options={"a": "IaaS", "b": "PaaS", "c": "SaaS", "d": "DaaS"},
                correct_answer="d",
                marks=2
            )
            db.add(q1)

        q2 = db.query(Question).filter(Question.test_id == test.id, Question.question_text == "Type 1 hypervisor runs on?").first()
        if not q2:
            q2 = Question(
                test_id=test.id,
                question_text="Type 1 hypervisor runs on?",
                question_type="mcq",
                options={"a": "Hardware", "b": "OS", "c": "Virtual machine", "d": "Container"},
                correct_answer="a",
                marks=2
            )
            db.add(q2)
        db.commit()

    # ===== Notifications / Achievements / Certificates for Rajesh G =====
    rajesh = next((u for u, s in student_users if s["usn"] == "1GD24CS407"), None)
    if rajesh:
        from app.models import Notification, Certificate, Achievement
        
        # Check welcome notification
        welcome_notif = db.query(Notification).filter(Notification.user_id == rajesh.id, Notification.title == "Welcome!").first()
        if not welcome_notif:
            notifs = [
                Notification(user_id=rajesh.id, title="Welcome!", message="Welcome to AdaptLearn GCEM. Start your learning journey today.", type="info"),
                Notification(user_id=rajesh.id, title="Cloud Computing Test Scheduled", message="BCS601 Mid-Term on June 5, 2026 at 10:00 AM.", type="info"),
            ]
            db.add_all(notifs)

        # Check certificates
        cert1 = db.query(Certificate).filter(Certificate.user_id == rajesh.id, Certificate.title == "Cloud Computing Excellence").first()
        if not cert1:
            certs = [
                Certificate(user_id=rajesh.id, title="Cloud Computing Excellence", subject="BCS601", type="excellence", score=94),
                Certificate(user_id=rajesh.id, title="Machine Learning Achievement", subject="BCS602", type="achievement", score=88),
            ]
            db.add_all(certs)

        # Check achievements
        ach1 = db.query(Achievement).filter(Achievement.user_id == rajesh.id, Achievement.title == "7-Day Streak").first()
        if not ach1:
            achs = [
                Achievement(user_id=rajesh.id, title="7-Day Streak", description="Studied 7 days in a row", icon="🔥", rarity="common"),
                Achievement(user_id=rajesh.id, title="Quiz Master", description="Completed 10 tests", icon="🧠", rarity="rare"),
                Achievement(user_id=rajesh.id, title="Top Performer", description="CGPA above 8.5", icon="🏆", rarity="epic"),
            ]
            db.add_all(achs)

        db.commit()

    print(f"Seeded {len(GCEM_STUDENTS)} students + 1 admin")
    print("  Login: email = usn@gcem.edu  |  password = usn (e.g. 1gd24cs407@gcem.edu / 1gd24cs407)")
    print("  Admin: admin@gcem.edu / admin123")
