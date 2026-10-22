
def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 201

    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    payload = {
        "email": "duplicate@example.com",
        "password": "SecurePass123!",
    }

    first_response = client.post("/auth/register", json=payload)
    second_response = client.post("/auth/register", json=payload)

    assert first_response.status_code == 201
    assert second_response.status_code == 409


def test_register_invalid_email(client):
    response = client.post(
        "/auth/register",
        json={
            "email": "not-an-email",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 422


def test_register_short_password(client):
    response = client.post(
        "/auth/register",
        json={
            "email": "shortpass@example.com",
            "password": "abc",
        },
    )

    assert response.status_code == 422


def test_login_success(client):
    # Register a user first
    client.post(
        "/auth/register",
        json={
            "email": "loginuser@example.com",
            "password": "SecurePass123!",
        },
    )

    # Log in with the correct credentials
    response = client.post(
        "/auth/login",
        json={
            "email": "loginuser@example.com",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    # Register a user first
    client.post(
        "/auth/register",
        json={
            "email": "wrongpass@example.com",
            "password": "SecurePass123!",
        },
    )

    # Attempt login with an incorrect password
    response = client.post(
        "/auth/login",
        json={
            "email": "wrongpass@example.com",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401


def test_login_unknown_email(client):
    response = client.post(
        "/auth/login",
        json={
            "email": "unknown@example.com",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 401
