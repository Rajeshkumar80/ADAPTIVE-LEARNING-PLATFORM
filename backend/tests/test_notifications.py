"""
Notification endpoint tests.
"""

HEADERS = lambda token: {"Authorization": f"Bearer {token}"}


def test_list_notifications(client, student_token):
    response = client.get("/api/notifications/", headers=HEADERS(student_token))
    assert response.status_code == 200


def test_notification_stats(client, student_token):
    response = client.get("/api/notifications/stats", headers=HEADERS(student_token))
    assert response.status_code == 200


def test_admin_send_notification(client, admin_token):
    response = client.post(
        "/api/notifications/send",
        json={
            "title": "Test Notification",
            "message": "Hello from tests",
            "type": "announcement",
        },
        headers=HEADERS(admin_token),
    )
    assert response.status_code in [200, 201]


def test_student_cannot_send_notification(client, student_token):
    response = client.post(
        "/api/notifications/send",
        json={"title": "Unauthorized", "message": "Should fail"},
        headers=HEADERS(student_token),
    )
    assert response.status_code in [401, 403]
