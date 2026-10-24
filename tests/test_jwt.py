
from datetime import datetime, timedelta, timezone

import jwt
import pytest

from app.auth import (
    JWT_SECRET_KEY,
    ALGORITHM,
    create_access_token,
)


def test_create_access_token():
    token = create_access_token(user_id=123)

    payload = jwt.decode(
        token,
        JWT_SECRET_KEY,
        algorithms=[ALGORITHM],
    )

    assert payload["sub"] == "123"
    assert "exp" in payload


def test_invalid_signature_is_rejected():
    token = create_access_token(user_id=123)

    with pytest.raises(jwt.InvalidTokenError):
        jwt.decode(
            token,
            "wrong-secret-key",
            algorithms=[ALGORITHM],
        )


def test_expired_token_is_rejected():
    expired_payload = {
        "sub": "123",
        "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
    }

    token = jwt.encode(
        expired_payload,
        JWT_SECRET_KEY,
        algorithm=ALGORITHM,
    )

    with pytest.raises(jwt.ExpiredSignatureError):
        jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[ALGORITHM],
        )


def test_malformed_token_is_rejected():
    token = "this.is.not-a-valid-jwt"

    with pytest.raises(jwt.InvalidTokenError):
        jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[ALGORITHM],
        )
