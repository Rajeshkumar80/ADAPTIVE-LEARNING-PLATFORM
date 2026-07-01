"""
Test management endpoint tests.
"""

HEADERS = lambda token: {"Authorization": f"Bearer {token}"}


def test_list_tests(client, student_token):
    response = client.get("/api/tests/", headers=HEADERS(student_token))
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_test_as_admin(client, admin_token):
    response = client.post(
        "/api/tests/",
        json={
            "title": "Test Quiz",
            "description": "A test quiz",
            "subject_id": 1,
            "duration_minutes": 30,
            "total_marks": 10,
            "passing_marks": 5,
            "questions": [
                {
                    "question_text": "What is 2+2?",
                    "question_type": "mcq",
                    "options": {"a": "3", "b": "4", "c": "5", "d": "6"},
                    "correct_answer": "4",
                    "marks": 5,
                },
            ],
        },
        headers=HEADERS(admin_token),
    )
    assert response.status_code in [200, 201]


def test_student_cannot_create_test(client, student_token):
    response = client.post(
        "/api/tests/",
        json={"title": "Unauthorized Test"},
        headers=HEADERS(student_token),
    )
    assert response.status_code in [401, 403]


def test_my_attempts(client, student_token):
    response = client.get("/api/tests/my-attempts", headers=HEADERS(student_token))
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_upcoming_tests(client, student_token):
    response = client.get("/api/tests/upcoming", headers=HEADERS(student_token))
    assert response.status_code == 200
