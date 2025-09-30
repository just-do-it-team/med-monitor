"""create tables

Revision ID: 9ee761846539
Revises: 
Create Date: 2025-09-20 21:16:09.762803

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision: str = '9ee761846539'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('doctors',
                    sa.Column('id', sa.BigInteger(), sa.Identity(always=False), nullable=False),
                    sa.Column('lastName', sa.String(), nullable=False),
                    sa.Column('name', sa.String(), nullable=False),
                    sa.Column('surname', sa.String(), nullable=False),
                    sa.PrimaryKeyConstraint('id'),
                    )
    op.create_table('patients',
                    sa.Column('id', sa.BigInteger(), sa.Identity(always=False), nullable=False),
                    sa.Column('lastName', sa.String(), nullable=False),
                    sa.Column('name', sa.String(), nullable=False),
                    sa.Column('surname', sa.String(), nullable=False),
                    sa.Column('type', sa.String(), nullable=False),
                    sa.Column('folderId', sa.Integer(), nullable=False),
                    sa.Column('birthDate', sa.Date(), nullable=False),
                    sa.Column('diagnosis', sa.String(), nullable=True),
                    sa.PrimaryKeyConstraint('id'),
                    )
    op.create_table('ctg',
                    sa.Column('id', sa.BigInteger(), sa.Identity(always=False), nullable=False),
                    sa.Column('patientId', sa.BigInteger(), nullable=False),
                    sa.Column('createDate', sa.DateTime(), nullable=False),
                    sa.Column('valid', sa.Boolean(), nullable=False),
                    sa.Column('status', sa.String(), nullable=True),
                    sa.Column('basal', sa.Integer(), nullable=True),
                    sa.Column('variability', sa.Integer(), nullable=True),
                    sa.Column('accels', sa.Integer(), nullable=True),
                    sa.Column('decelsEarly', sa.Integer(), nullable=True),
                    sa.Column('decelsLate', sa.Integer(), nullable=True),
                    sa.Column('decelsVarGood', sa.Integer(), nullable=True),
                    sa.Column('decelsVarBad', sa.Integer(), nullable=True),
                    sa.Column('analysis', JSONB, nullable=True),
                    sa.Column('filename', sa.String(), nullable=False),
                    sa.PrimaryKeyConstraint('id'),
                    )


def downgrade() -> None:
    pass
