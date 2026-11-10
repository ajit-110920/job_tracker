"""add created_at to users

Revision ID: eeea39c6ba47
Revises: c1bf1fd16805
Create Date: 2026-11-10 12:22:11.316175

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'eeea39c6ba47'
down_revision: Union[str, Sequence[str], None] = 'c1bf1fd16805'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "created_at")