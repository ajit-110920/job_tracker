from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class Job(BaseModel):
    company: str
    role: str
    status: str


jobs = []


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/jobs")
def create_job(job: Job):
    job_data = job.model_dump()

    job_data["id"] = len(jobs) + 1

    jobs.append(job_data)

    return job_data


@app.get("/jobs")
def get_jobs():
    return jobs


@app.get("/jobs/{job_id}")
def get_job(job_id: int):

    for job in jobs:
        if job["id"] == job_id:
            return job

    raise HTTPException(status_code=404, detail="Job not found")


@app.put("/jobs/{job_id}")
def update_job(job_id: int, updated_job: Job):

    for job in jobs:

        if job["id"] == job_id:

            job["company"] = updated_job.company
            job["role"] = updated_job.role
            job["status"] = updated_job.status

            return job

    raise HTTPException(status_code=404, detail="Job not found")


@app.delete("/jobs/{job_id}")
def delete_job(job_id: int):

    for job in jobs:

        if job["id"] == job_id:

            jobs.remove(job)

            return {"message": "Job deleted successfully"}

    raise HTTPException(status_code=404, detail="Job not found")