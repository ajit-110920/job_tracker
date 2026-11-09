from datetime import date
from enum import Enum

from pydantic import BaseModel


class JobStatus(str, Enum):
    APPLIED = "Applied"
    INTERVIEW = "Interview"
    OFFER = "Offer"
    REJECTED = "Rejected"


class Job(BaseModel):
    company: str
    role: str
    status: JobStatus
    applied_date: date | None = None


class JobUpdate(BaseModel):
    """Schema for PATCH — every field is optional."""

    company: str | None = None
    role: str | None = None
    status: JobStatus | None = None
    applied_date: date | None = None


class JobResponse(BaseModel):
    id: int
    company: str
    role: str
    status: JobStatus
    applied_date: date | None

    model_config = {"from_attributes": True}


class JobStatsResponse(BaseModel):
    total: int
    applied: int
    interview: int
    offers: int
    rejected: int
