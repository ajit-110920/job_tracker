from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.job import Job
from app.models.job import Job as JobModel
from app.database import get_db
from app.services.job_service import (
    create_job,
    get_jobs,
    get_job,
    update_job,
    delete_job
)
router = APIRouter()


@router.post("/jobs")
def create_job_route(job: Job, db: Session = Depends(get_db)):
    return create_job(db, job)


@router.get("/jobs")
def get_jobs_route(db: Session = Depends(get_db)):
    return get_jobs(db)


@router.get("/jobs/{job_id}")
def get_job_route(job_id: int, db: Session = Depends(get_db)):
    job = get_job(db, job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return job


@router.put("/jobs/{job_id}")
def update_job_route(
    job_id: int,
    updated_job: Job,
    db: Session = Depends(get_db)
):
    job = update_job(db, job_id, updated_job)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return job


@router.delete("/jobs/{job_id}")
def delete_job_route(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = delete_job(db, job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"message": "Job deleted successfully"}