"""
Test Configuration — shared fixtures for pytest.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

# Test database (in-memory SQLite)
TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """Create a test client with overridden database."""
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)

    with TestClient(app) as c:
        yield c

    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def student_token(client):
    """Register a student and return auth token."""
    response = client.post("/api/auth/register", json={
        "email": "test@student.com",
        "username": "teststudent",
        "password": "test123",
        "full_name": "Test Student",
        "role": "student",
    })
    return response.json()["access_token"]


@pytest.fixture
def admin_token(client):
    """Register an admin and return auth token."""
    response = client.post("/api/auth/register", json={
        "email": "test@admin.com",
        "username": "testadmin",
        "password": "admin123",
        "full_name": "Test Admin",
        "role": "admin",
        "employee_id": "EMP999",
    })
    return response.json()["access_token"]
