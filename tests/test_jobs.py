
from datetime import date

from app.auth import create_access_token


def get_auth_headers(client):
    """Register a test user and return authentication headers."""
    response = client.post(
        "/auth/register",
        json={
            "email": "jobs-test@example.com",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 201

    user_id = response.json()["id"]
    token = create_access_token(user_id)

    return {"Authorization": f"Bearer {token}"}


def test_create_job(client):
    headers = get_auth_headers(client)

    response = client.post(
        "/jobs",
        headers=headers,
        json={
            "company": "Test Company",
            "role": "Backend Developer Intern",
            "status": "Applied",
            "applied_date": "2026-10-16",
        },
    )

    assert response.status_code == 201

    data = response.json()
    assert data["company"] == "Test Company"
    assert data["role"] == "Backend Developer Intern"
    assert data["status"] == "Applied"
    assert data["applied_date"] == "2026-10-16"
    assert "id" in data


def test_get_jobs(client):
    headers = get_auth_headers(client)

    client.post(
        "/jobs",
        headers=headers,
        json={
            "company": "Google",
            "role": "Software Engineer",
            "status": "Applied",
            "applied_date": "2026-10-10",
        },
    )

    response = client.get("/jobs", headers=headers)

    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
    assert data[0]["company"] == "Google"


def test_get_job_by_id(client):
    headers = get_auth_headers(client)

    create_response = client.post(
        "/jobs",
        headers=headers,
        json={
            "company": "Microsoft",
            "role": "Data Analyst Intern",
            "status": "Applied",
            "applied_date": "2026-10-12",
        },
    )

    assert create_response.status_code == 201
    job_id = create_response.json()["id"]

    response = client.get(f"/jobs/{job_id}", headers=headers)

    assert response.status_code == 200
    assert response.json()["id"] == job_id
    assert response.json()["company"] == "Microsoft"


def test_get_nonexistent_job(client):
    headers = get_auth_headers(client)

    response = client.get("/jobs/99999", headers=headers)

    assert response.status_code == 404


def test_update_job(client):
    headers = get_auth_headers(client)

    create_response = client.post(
        "/jobs",
        headers=headers,
        json={
            "company": "Amazon",
            "role": "Python Developer",
            "status": "Applied",
            "applied_date": "2026-10-10",
        },
    )

    assert create_response.status_code == 201
    job_id = create_response.json()["id"]

    response = client.put(
        f"/jobs/{job_id}",
        headers=headers,
        json={
            "company": "Amazon",
            "role": "Backend Developer",
            "status": "Interview",
            "applied_date": "2026-10-15",
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert data["company"] == "Amazon"
    assert data["role"] == "Backend Developer"
    assert data["status"] == "Interview"


def test_delete_job(client):
    headers = get_auth_headers(client)

    create_response = client.post(
        "/jobs",
        headers=headers,
        json={
            "company": "Netflix",
            "role": "Data Engineer",
            "status": "Applied",
            "applied_date": "2026-10-10",
        },
    )

    assert create_response.status_code == 201
    job_id = create_response.json()["id"]

    response = client.delete(
        f"/jobs/{job_id}",
        headers=headers,
    )

    assert response.status_code in (200, 204)


def test_deleted_job_not_found(client):
    headers = get_auth_headers(client)

    create_response = client.post(
        "/jobs",
        headers=headers,
        json={
            "company": "Adobe",
            "role": "ML Intern",
            "status": "Applied",
            "applied_date": "2026-10-10",
        },
    )

    assert create_response.status_code == 201
    job_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/jobs/{job_id}",
        headers=headers,
    )

    assert delete_response.status_code in (200, 204)

    get_response = client.get(
        f"/jobs/{job_id}",
        headers=headers,
    )

    assert get_response.status_code == 404


def test_create_job_missing_company(client):
    headers = get_auth_headers(client)

    response = client.post(
        "/jobs",
        headers=headers,
        json={
            "role": "Backend Developer",
            "status": "Applied",
            "applied_date": "2026-10-16",
        },
    )

    assert response.status_code == 422


def test_create_job_invalid_date(client):
    headers = get_auth_headers(client)

    response = client.post(
        "/jobs",
        headers=headers,
        json={
            "company": "Test Company",
            "role": "Backend Developer",
            "status": "Applied",
            "applied_date": "not-a-date",
        },
    )

    assert response.status_code == 422


def test_filter_jobs_by_status(client):
    headers = get_auth_headers(client)

    jobs = [
        {
            "company": "Google",
            "role": "Software Engineer",
            "status": "Applied",
            "applied_date": "2026-10-10",
        },
        {
            "company": "Microsoft",
            "role": "Backend Developer",
            "status": "Interview",
            "applied_date": "2026-10-11",
        },
        {
            "company": "Amazon",
            "role": "Data Analyst",
            "status": "Applied",
            "applied_date": "2026-10-12",
        },
    ]

    for job in jobs:
        response = client.post(
            "/jobs",
            headers=headers,
            json=job,
        )
        assert response.status_code == 201

    response = client.get(
        "/jobs?status=Applied",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()
    assert len(data) == 2
    assert all(job["status"] == "Applied" for job in data)


def test_jobs_pagination(client):
    headers = get_auth_headers(client)

    for i in range(5):
        response = client.post(
            "/jobs",
            headers=headers,
            json={
                "company": f"Company {i}",
                "role": f"Role {i}",
                "status": "Applied",
                "applied_date": "2026-10-10",
            },
        )
        assert response.status_code == 201

    response = client.get(
        "/jobs?skip=0&limit=2",
        headers=headers,
    )

    assert response.status_code == 200
    assert len(response.json()) == 2

    response = client.get(
        "/jobs?skip=2&limit=2",
        headers=headers,
    )

    assert response.status_code == 200
    assert len(response.json()) == 2


def test_jobs_reject_negative_skip(client):
    headers = get_auth_headers(client)

    response = client.get(
        "/jobs?skip=-1",
        headers=headers,
    )

    assert response.status_code == 422


def test_jobs_reject_limit_over_100(client):
    headers = get_auth_headers(client)

    response = client.get(
        "/jobs?limit=101",
        headers=headers,
    )

    assert response.status_code == 422


def test_get_jobs_requires_authentication(client):
    response = client.get("/jobs")

    assert response.status_code == 401


def test_create_job_requires_authentication(client):
    response = client.post(
        "/jobs",
        json={
            "company": "Test Company",
            "role": "Backend Developer",
            "status": "Applied",
            "applied_date": "2026-10-16",
        },
    )

    assert response.status_code == 401
