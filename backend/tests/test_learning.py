"""
Learning endpoint tests.
"""

HEADERS = lambda token: {"Authorization": f"Bearer {token}"}


def test_due_today(client, student_token):
    response = client.get("/api/learning/due-today", headers=HEADERS(student_token))
    assert response.status_code == 200
    data = response.json()
    assert "due_count" in data or "topics" in data


def test_learning_dashboard(client, student_token):
    response = client.get("/api/learning/dashboard", headers=HEADERS(student_token))
    assert response.status_code == 200


def test_sm2_calculate(client, student_token):
    response = client.post(
        "/api/learning/sm2-calculate",
        json={"quality": 4, "repetitions": 2, "ease_factor": 2.5, "interval": 6},
        headers=HEADERS(student_token),
    )
    assert response.status_code == 200
    data = response.json()
    assert "input" in data or "output" in data
