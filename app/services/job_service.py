import logging

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.job import Job as JobModel
from app.schemas.job import Job, JobUpdate


logger = logging.getLogger(__name__)


def create_job(db: Session, job: Job, user_id: int) -> JobModel:
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

    logger.info("Job created: id=%d user=%d", new_job.id, user_id)

    return new_job


def get_jobs(
    db: Session,
    user_id: int,
    status: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 10,
    sort_by: str = "id",
    order: str = "asc",
):
    query = db.query(JobModel).filter(
        JobModel.user_id == user_id
    )

    if status is not None:
        query = query.filter(JobModel.status == status)

    if search is not None:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            JobModel.company.ilike(search_term)
            | JobModel.role.ilike(search_term)
        )

    sort_column = {
        "id": JobModel.id,
        "company": JobModel.company,
        "applied_date": JobModel.applied_date,
    }.get(sort_by, JobModel.id)

    if order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

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


def patch_job(
    db: Session,
    job_id: int,
    patch: JobUpdate,
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

    update_data = patch.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)

    logger.info("Job patched: id=%d fields=%s", job_id, list(update_data.keys()))

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

    logger.info("Job deleted: id=%d user=%d", job_id, user_id)

    return job


def get_job_stats(db: Session, user_id: int) -> dict:
    """Get job statistics using a single GROUP BY query."""
    rows = (
        db.query(JobModel.status, func.count())
        .filter(JobModel.user_id == user_id)
        .group_by(JobModel.status)
        .all()
    )

    counts = {status: count for status, count in rows}
    total = sum(counts.values())

    return {
        "total": total,
        "applied": counts.get("Applied", 0),
        "interview": counts.get("Interview", 0),
        "offers": counts.get("Offer", 0),
        "rejected": counts.get("Rejected", 0),
    }
