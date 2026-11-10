"""add job timestamps

Revision ID: 3847dc11cd78
Revises: eeea39c6ba47
Create Date: 2026-11-10 12:53:04.329420

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3847dc11cd78'
down_revision: Union[str, Sequence[str], None] = 'eeea39c6ba47'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "jobs",
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )

    op.add_column(
        "jobs",
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column("jobs", "updated_at")
    op.drop_column("jobs", "created_at")
