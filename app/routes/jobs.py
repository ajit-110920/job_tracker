from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.job import Job
from app.models.job import Job as JobModel
from app.database import get_db

router = APIRouter()


@router.post("/jobs")
def create_job(
    job: Job,
    db: Session = Depends(get_db)
):
    new_job = JobModel(
        company=job.company,
        role=job.role,
        status=job.status
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


@router.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    return db.query(JobModel).all()


@router.get("/jobs/{job_id}")
def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = db.query(JobModel).filter(JobModel.id == job_id).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


@router.put("/jobs/{job_id}")
def update_job(
    job_id: int,
    updated_job: Job,
    db: Session = Depends(get_db)
):
    job = db.query(JobModel).filter(JobModel.id == job_id).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    job.company = updated_job.company
    job.role = updated_job.role
    job.status = updated_job.status

    db.commit()
    db.refresh(job)

    return job


@router.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = db.query(JobModel).filter(JobModel.id == job_id).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully"
    }