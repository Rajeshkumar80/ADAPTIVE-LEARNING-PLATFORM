from app.database import SessionLocal
from app.models import User
db = SessionLocal()
total = db.query(User).count()
students = db.query(User).filter(User.role == "student").count()
admins = db.query(User).filter(User.role == "admin").count()
print(f"Total users: {total}")
print(f"Students: {students}")
print(f"Admins: {admins}")
# Show Rajesh's login
rajesh = db.query(User).filter(User.usn == "1GD24CS407").first()
if rajesh:
    print(f"Rajesh login: {rajesh.email} / {rajesh.usn.lower()}")
db.close()
