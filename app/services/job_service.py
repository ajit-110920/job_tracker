from sqlalchemy.orm import Session

from app.models.job import Job as JobModel
from app.schemas.job import Job


def create_job(db: Session, job: Job):
    new_job = JobModel(
    company=job.company,
    role=job.role,
    status=job.status,
    applied_date=job.applied_date
)

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job

def get_jobs(db: Session):
    return db.query(JobModel).all()

def get_job(db: Session, job_id: int):
    return db.query(JobModel).filter(JobModel.id == job_id).first()

def update_job(db: Session, job_id: int, updated_job: Job):
    job = db.query(JobModel).filter(JobModel.id == job_id).first()

    if job is None:
        return None

    job.company = updated_job.company
    job.role = updated_job.role
    job.status = updated_job.status
    job.applied_date = updated_job.applied_date

    db.commit()
    db.refresh(job)

    return job

def delete_job(db: Session, job_id: int):
    job = db.query(JobModel).filter(JobModel.id == job_id).first()

    if job is None:
        return None

    db.delete(job)
    db.commit()

    return job