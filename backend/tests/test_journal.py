"""
Journal endpoint tests.
"""

HEADERS = lambda token: {"Authorization": f"Bearer {token}"}


def test_list_journal_entries(client, student_token):
    response = client.get("/api/journal/", headers=HEADERS(student_token))
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_journal_entry(client, student_token):
    response = client.post(
        "/api/journal/",
        json={
            "title": "My First Entry",
            "code": "print('hello')",
            "language": "python",
            "description": "A hello world program",
            "tags": ["beginner", "python"],
        },
        headers=HEADERS(student_token),
    )
    assert response.status_code in [200, 201]


def test_journal_stats(client, student_token):
    response = client.get("/api/journal/stats/summary", headers=HEADERS(student_token))
    assert response.status_code == 200
    data = response.json()
    assert "total_entries" in data
