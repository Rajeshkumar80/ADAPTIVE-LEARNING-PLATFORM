"""
Planner endpoint tests.
"""

HEADERS = lambda token: {"Authorization": f"Bearer {token}"}


def test_today_plan(client, student_token):
    response = client.get("/api/planner/today", headers=HEADERS(student_token))
    assert response.status_code == 200


def test_planner_goals(client, student_token):
    response = client.get("/api/planner/goals", headers=HEADERS(student_token))
    assert response.status_code == 200


def test_planner_mastery(client, student_token):
    response = client.get("/api/planner/mastery", headers=HEADERS(student_token))
    assert response.status_code == 200
