"""
Authentication endpoint tests.
"""


def test_register_student(client):
    response = client.post("/api/auth/register", json={
        "email": "new@student.com",
        "username": "newstudent",
        "password": "pass123",
        "full_name": "New Student",
        "role": "student",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "student"


def test_register_admin(client):
    response = client.post("/api/auth/register", json={
        "email": "new@admin.com",
        "username": "newadmin",
        "password": "admin123",
        "full_name": "New Admin",
        "role": "admin",
        "employee_id": "EMP100",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "admin"


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={
        "email": "dup@test.com",
        "username": "user1",
        "password": "pass123",
        "full_name": "User 1",
    })
    response = client.post("/api/auth/register", json={
        "email": "dup@test.com",
        "username": "user2",
        "password": "pass123",
        "full_name": "User 2",
    })
    assert response.status_code == 400


def test_login_success(client):
    # Register first
    client.post("/api/auth/register", json={
        "email": "login@test.com",
        "username": "loginuser",
        "password": "pass123",
        "full_name": "Login User",
    })
    # Login
    response = client.post("/api/auth/login", data={
        "username": "loginuser",
        "password": "pass123",
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "email": "wrong@test.com",
        "username": "wronguser",
        "password": "correct",
        "full_name": "Wrong User",
    })
    response = client.post("/api/auth/login", data={
        "username": "wronguser",
        "password": "incorrect",
    })
    assert response.status_code == 401


def test_get_me(client, student_token):
    response = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {student_token}"
    })
    assert response.status_code == 200
    assert response.json()["username"] == "teststudent"
