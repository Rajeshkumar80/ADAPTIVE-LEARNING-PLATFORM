"""
Student endpoint tests.
"""

HEADERS = lambda token: {"Authorization": f"Bearer {token}"}


def test_student_dashboard(client, student_token):
    response = client.get("/api/student/dashboard", headers=HEADERS(student_token))
    assert response.status_code == 200
    data = response.json()
    assert "streak" in data or "total_subjects" in data


def test_student_profile(client, student_token):
    response = client.get("/api/student/profile", headers=HEADERS(student_token))
    assert response.status_code == 200


def test_student_update_profile(client, student_token):
    response = client.put(
        "/api/student/profile?full_name=Updated+Name&semester=6",
        headers=HEADERS(student_token),
    )
    assert response.status_code == 200
    assert response.json()["user"]["full_name"] == "Updated Name"


def test_student_subjects(client, student_token):
    response = client.get("/api/student/subjects", headers=HEADERS(student_token))
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_student_progress(client, student_token):
    response = client.get("/api/student/progress", headers=HEADERS(student_token))
    assert response.status_code == 200


def test_student_leaderboard(client, student_token):
    response = client.get("/api/student/leaderboard", headers=HEADERS(student_token))
    assert response.status_code == 200
    data = response.json()
    assert "by_cgpa" in data or "by_test_score" in data


def test_student_achievements(client, student_token):
    response = client.get("/api/student/achievements", headers=HEADERS(student_token))
    assert response.status_code == 200


def test_student_certificates(client, student_token):
    response = client.get("/api/student/certificates", headers=HEADERS(student_token))
    assert response.status_code == 200


def test_unauthorized_access(client):
    response = client.get("/api/student/dashboard")
    assert response.status_code in [401, 403]
