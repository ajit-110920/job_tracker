from pydantic import BaseModel


class Job(BaseModel):
    company: str
    role: str
    status: str