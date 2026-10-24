
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

from app.auth import (
    get_current_user,
    create_access_token,
    JWT_SECRET_KEY,
    ALGORITHM,
)
from app.database import get_db
from app.models.user import User


def create_test_app(client):
    test_app = FastAPI()

    test_app.dependency_overrides[get_db] = (
        client.app.dependency_overrides[get_db]
    )

    @test_app.get("/me")
    def read_me(user: User = Depends(get_current_user)):
        return {"id": user.id, "email": user.email}

    return test_app


def test_current_user_from_valid_token(client):
    registration = client.post(
        "/auth/register",
        json={
            "email": "tokenuser@example.com",
            "password": "SecurePass123!",
        },
    )
    assert registration.status_code == 201

    user_id = registration.json()["id"]
    token = create_access_token(user_id)

    test_app = create_test_app(client)

    with TestClient(test_app) as test_client:
        response = test_client.get(
            "/me",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 200
    assert response.json()["id"] == user_id
    assert response.json()["email"] == "tokenuser@example.com"


def test_current_user_rejects_invalid_token(client):
    test_app = create_test_app(client)

    with TestClient(test_app) as test_client:
        response = test_client.get(
            "/me",
            headers={"Authorization": "Bearer invalid-token"},
        )

    assert response.status_code == 401


def test_current_user_rejects_wrong_signature(client):
    registration = client.post(
        "/auth/register",
        json={
            "email": "wrong-signature@example.com",
            "password": "SecurePass123!",
        },
    )
    assert registration.status_code == 201

    user_id = registration.json()["id"]

    token = jwt.encode(
        {
            "sub": str(user_id),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
        },
        "wrong-secret-key",
        algorithm=ALGORITHM,
    )

    test_app = create_test_app(client)

    with TestClient(test_app) as test_client:
        response = test_client.get(
            "/me",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 401


def test_current_user_rejects_expired_token(client):
    registration = client.post(
        "/auth/register",
        json={
            "email": "expired-token@example.com",
            "password": "SecurePass123!",
        },
    )
    assert registration.status_code == 201

    user_id = registration.json()["id"]

    token = jwt.encode(
        {
            "sub": str(user_id),
            "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
        },
        JWT_SECRET_KEY,
        algorithm=ALGORITHM,
    )

    test_app = create_test_app(client)

    with TestClient(test_app) as test_client:
        response = test_client.get(
            "/me",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 401


def test_get_jobs_requires_authentication(client):
    response = client.get("/jobs")

    assert response.status_code == 401
