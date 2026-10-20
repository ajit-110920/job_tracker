"""add job ownership

Revision ID: 5203336163a9
Revises: 022c4de506c5
Create Date: 2026-10-20 17:08:39.190961

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5203336163a9'
down_revision: Union[str, Sequence[str], None] = '022c4de506c5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade() -> None:
    op.add_column(
        "jobs",
        sa.Column("user_id", sa.Integer(), nullable=True),
    )

    op.create_index(
        "ix_jobs_user_id",
        "jobs",
        ["user_id"],
        unique=False,
    )

    op.create_foreign_key(
        "fk_jobs_user_id_users",
        "jobs",
        "users",
        ["user_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_jobs_user_id_users",
        "jobs",
        type_="foreignkey",
    )

    op.drop_index("ix_jobs_user_id", table_name="jobs")

    op.drop_column("jobs", "user_id")
