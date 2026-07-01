"""
Admin endpoint tests.
"""

HEADERS = lambda token: {"Authorization": f"Bearer {token}"}


def test_admin_dashboard(client, admin_token):
    response = client.get("/api/admin/dashboard", headers=HEADERS(admin_token))
    assert response.status_code == 200
    data = response.json()
    assert "total_students" in data


def test_admin_students_list(client, admin_token):
    response = client.get("/api/admin/students", headers=HEADERS(admin_token))
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_admin_create_student(client, admin_token):
    response = client.post(
        "/api/admin/students",
        json={
            "email": "newstudent@gcem.edu",
            "username": "newstudent123",
            "password": "pass123",
            "full_name": "New Student",
            "usn": "1GD24CS999",
            "semester": 6,
            "section": "A",
        },
        headers=HEADERS(admin_token),
    )
    assert response.status_code in [200, 201]


def test_admin_update_student(client, admin_token):
    create_resp = client.post(
        "/api/admin/students",
        json={
            "email": "update@gcem.edu",
            "username": "updateuser",
            "password": "pass123",
            "full_name": "Update Me",
            "usn": "1GD24CS998",
            "semester": 6,
        },
        headers=HEADERS(admin_token),
    )
    if create_resp.status_code in [200, 201]:
        usn = create_resp.json().get("usn")
        if usn:
            response = client.put(
                f"/api/admin/students/{usn}",
                json={"full_name": "Updated Name"},
                headers=HEADERS(admin_token),
            )
            assert response.status_code == 200


def test_admin_subjects(client, admin_token):
    response = client.get("/api/admin/subjects", headers=HEADERS(admin_token))
    assert response.status_code == 200


def test_admin_anti_cheat_flags(client, admin_token):
    response = client.get("/api/admin/anti-cheat-flags", headers=HEADERS(admin_token))
    assert response.status_code == 200


def test_admin_class_analytics(client, admin_token):
    response = client.get("/api/admin/analytics", headers=HEADERS(admin_token))
    assert response.status_code == 200


def test_student_cannot_access_admin(client, student_token):
    response = client.get("/api/admin/dashboard", headers=HEADERS(student_token))
    assert response.status_code in [401, 403]
