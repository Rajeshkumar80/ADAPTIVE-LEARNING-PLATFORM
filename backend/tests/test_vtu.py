"""
VTU data endpoint tests.
"""

HEADERS = lambda token: {"Authorization": f"Bearer {token}"}


def test_list_vtu_subjects(client, student_token):
    response = client.get("/api/vtu/subjects", headers=HEADERS(student_token))
    assert response.status_code == 200
    data = response.json()
    assert "semesters" in data or "total_subjects" in data


def test_vtu_subject_by_code(client, student_token):
    response = client.get("/api/vtu/subjects/BCS601", headers=HEADERS(student_token))
    assert response.status_code == 200


def test_vtu_program_outcomes(client, student_token):
    response = client.get("/api/vtu/program-outcomes", headers=HEADERS(student_token))
    assert response.status_code == 200
    data = response.json()
    assert "program_outcomes" in data
