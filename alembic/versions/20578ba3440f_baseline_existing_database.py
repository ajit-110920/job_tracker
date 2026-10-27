
"""baseline existing database schema

Revision ID: 20578ba3440f
Revises:
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20578ba3440f"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("company", sa.String(length=100), nullable=False),
        sa.Column("role", sa.String(length=100), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_jobs_id",
        "jobs",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_jobs_id", table_name="jobs")
    op.drop_table("jobs")
