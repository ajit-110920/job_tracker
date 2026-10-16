
def test_create_job(client):
    response = client.post(
        "/jobs",
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
    # First, create a job
    client.post(
        "/jobs",
        json={
            "company": "Google",
            "role": "Software Engineer Intern",
            "status": "Applied",
            "applied_date": "2026-10-16",
        },
    )

    # Then, retrieve all jobs
    response = client.get("/jobs")

    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
    assert data[0]["company"] == "Google"
    assert data[0]["role"] == "Software Engineer Intern"


def test_get_job_by_id(client):
    # Create a job
    create_response = client.post(
        "/jobs",
        json={
            "company": "Microsoft",
            "role": "Backend Developer Intern",
            "status": "Applied",
            "applied_date": "2026-10-16",
        },
    )

    # Get the ID of the newly created job
    job_id = create_response.json()["id"]

    # Retrieve that specific job
    response = client.get(f"/jobs/{job_id}")

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == job_id
    assert data["company"] == "Microsoft"
    assert data["role"] == "Backend Developer Intern"


def test_get_nonexistent_job(client):
    response = client.get("/jobs/999999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Job not found"


def test_update_job(client):
    # Create a job
    create_response = client.post(
        "/jobs",
        json={
            "company": "Google",
            "role": "Python Developer",
            "status": "Applied",
            "applied_date": "2026-10-16",
        },
    )

    job_id = create_response.json()["id"]

    # Update the job
    response = client.put(
        f"/jobs/{job_id}",
        json={
            "company": "Microsoft",
            "role": "Backend Developer",
            "status": "Interview",
            "applied_date": "2026-10-16",
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == job_id
    assert data["company"] == "Microsoft"
    assert data["role"] == "Backend Developer"
    assert data["status"] == "Interview"


def test_delete_job(client):
    # Create a job
    create_response = client.post(
        "/jobs",
        json={
            "company": "Amazon",
            "role": "Software Engineer",
            "status": "Applied",
            "applied_date": "2026-10-16",
        },
    )

    job_id = create_response.json()["id"]

    # Delete the job
    response = client.delete(f"/jobs/{job_id}")

    assert response.status_code == 204


def test_deleted_job_not_found(client):
    # Create a job
    create_response = client.post(
        "/jobs",
        json={
            "company": "Amazon",
            "role": "Software Engineer",
            "status": "Applied",
            "applied_date": "2026-10-16",
        },
    )

    job_id = create_response.json()["id"]

    # Delete the job
    delete_response = client.delete(f"/jobs/{job_id}")
    assert delete_response.status_code == 204

    # Try to retrieve the deleted job
    response = client.get(f"/jobs/{job_id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Job not found"


def test_create_job_missing_company(client):
    response = client.post(
        "/jobs",
        json={
            "role": "Backend Developer Intern",
            "status": "Applied",
            "applied_date": "2026-10-16",
        },
    )

    assert response.status_code == 422


def test_create_job_invalid_date(client):
    response = client.post(
        "/jobs",
        json={
            "company": "Google",
            "role": "Backend Developer Intern",
            "status": "Applied",
            "applied_date": "not-a-date",
        },
    )

    assert response.status_code == 422
