from sqlalchemy.orm import Session

from app.models.job import Job as JobModel
from app.schemas.job import Job



def create_job(db: Session, job: Job, user_id: int):
    new_job = JobModel(
        company=job.company,
        role=job.role,
        status=job.status,
        applied_date=job.applied_date,
        user_id=user_id,
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job



def get_jobs(
    db: Session,
    user_id: int,
    status: str | None = None,
    skip: int = 0,
    limit: int = 10,
):
    query = db.query(JobModel).filter(JobModel.user_id == user_id)

    if status is not None:
        query = query.filter(JobModel.status == status)

    query = query.order_by(JobModel.id.asc())

    return query.offset(skip).limit(limit).all()





def get_job(db: Session, job_id: int, user_id: int):
    return (
        db.query(JobModel)
        .filter(
            JobModel.id == job_id,
            JobModel.user_id == user_id,
        )
        .first()
    )


def update_job(
    db: Session,
    job_id: int,
    updated_job: Job,
    user_id: int,
):
    job = (
        db.query(JobModel)
        .filter(
            JobModel.id == job_id,
            JobModel.user_id == user_id,
        )
        .first()
    )

    if job is None:
        return None

    job.company = updated_job.company
    job.role = updated_job.role
    job.status = updated_job.status
    job.applied_date = updated_job.applied_date

    db.commit()
    db.refresh(job)

    return job


def delete_job(db: Session, job_id: int, user_id: int):
    job = (
        db.query(JobModel)
        .filter(
            JobModel.id == job_id,
            JobModel.user_id == user_id,
        )
        .first()
    )

    if job is None:
        return None

    db.delete(job)
    db.commit()

    return job
