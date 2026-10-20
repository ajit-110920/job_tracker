"""create users table

Revision ID: 022c4de506c5
Revises: 708148e742eb
Create Date: 2026-10-19 16:09:52.296331

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '022c4de506c5'
down_revision: Union[str, Sequence[str], None] = '708148e742eb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_users_email"),
        "users",
        ["email"],
        unique=True,
    )

    op.create_index(
        op.f("ix_users_id"),
        "users",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")

