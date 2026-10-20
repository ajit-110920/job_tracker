from fastapi import FastAPI
from app.database import engine
from app.routes.jobs import router as jobs_router
from app.routes import auth
app = FastAPI()


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(jobs_router)
app.include_router(auth.router)