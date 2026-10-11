"""baseline existing database

Revision ID: 20578ba3440f
Revises: 
Create Date: 2026-10-11 13:12:12.943407

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20578ba3440f'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Baseline the existing database schema."""
    pass


def downgrade() -> None:
    """Baseline migration has no schema changes to reverse."""
    pass
