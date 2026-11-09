import logging

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.security import password_hash


logger = logging.getLogger(__name__)


def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = password_hash.hash(user.password)

    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    logger.info("User registered: %s", user.email)

    return new_user
