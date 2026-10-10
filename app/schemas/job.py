from pydantic import BaseModel


class Job(BaseModel):
    company: str
    role: str
    status: str


class JobResponse(BaseModel):
    id: int
    company: str
    role: str
    status: str

    model_config = {"from_attributes": True}