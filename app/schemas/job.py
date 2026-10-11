from datetime import date
from pydantic import BaseModel


class Job(BaseModel):
    company: str
    role: str
    status: str
    applied_date: date | None = None


class JobResponse(BaseModel):
    id: int
    company: str
    role: str
    status: str
    applied_date: date | None

    model_config = {"from_attributes": True}