from fastapi import FastAPI
from app.database import engine
from app.routes.jobs import router as jobs_router

app = FastAPI()


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(jobs_router)