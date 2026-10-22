
import jwt

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
