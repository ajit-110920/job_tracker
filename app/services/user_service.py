
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()


def create_user(db: Session, user: UserCreate):
    hashed_password = password_hash.hash(user.password)

    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
