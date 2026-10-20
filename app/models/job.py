
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    applied_date = Column(Date, nullable=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )
