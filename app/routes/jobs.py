
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Literal
from app.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.job import Job, JobResponse
from app.services.job_service import (
    create_job,
    get_jobs,
    get_job,
    update_job,
    delete_job,
    get_job_stats,
)

router = APIRouter()


@router.post("/jobs", response_model=JobResponse, status_code=201)
def create_job_route(
    job: Job,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_job(db, job, user_id=current_user.id)


@router.get("/jobs", response_model=list[JobResponse])
def get_jobs_route(
    status: str | None = None,
    search: str | None = None,
    sort_by: Literal["id", "company", "applied_date"] = "id",
    order: Literal["asc", "desc"] = "asc",
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_jobs(
        db,
        user_id=current_user.id,
        status=status,
        search=search,
        sort_by=sort_by,
        order=order,
        skip=skip,
        limit=limit,
    )


@router.get("/jobs/stats")
def get_job_stats_route(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_job_stats(
        db,
        user_id=current_user.id,
    )


@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job_route(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = get_job(db, job_id, user_id=current_user.id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return job


@router.put("/jobs/{job_id}", response_model=JobResponse)
def update_job_route(
    job_id: int,
    updated_job: Job,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = update_job(
        db,
        job_id,
        updated_job,
        user_id=current_user.id,
    )

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return job


@router.delete("/jobs/{job_id}", status_code=204)
def delete_job_route(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = delete_job(db, job_id, user_id=current_user.id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return None



