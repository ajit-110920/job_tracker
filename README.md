
# JobTrack — Job Application Management System

<p align="center">
  <strong>One workspace. Every opportunity. Better career decisions.</strong>
</p>

<p align="center">
  <a href="https://job-tracker-frontend-kd4o.onrender.com">Live Demo</a> •
  <a href="https://job-tracker-e8p3.onrender.com/docs">API Documentation</a>
</p>

---

## Overview

JobTrack is a full-stack job application management platform that helps users organize their job search.

Users can register, log in, track job applications, manage application statuses, and monitor their progress through a dashboard.

The application is built with React, FastAPI and PostgreSQL, with Docker-based deployment and automated CI pipelines.

## Live Application

| Component | Link |
|---|---|
| Frontend | https://job-tracker-frontend-kd4o.onrender.com |
| Backend API | https://job-tracker-e8p3.onrender.com |
| Swagger Docs | https://job-tracker-e8p3.onrender.com/docs |

## Features

- User registration and login
- JWT-based authentication
- Password hashing with Argon2
- Create, read, update and delete job applications
- Search and filter applications
- Pagination and sorting
- Application statistics dashboard
- Dark and light themes
- Responsive React interface
- PostgreSQL persistence
- Database migrations using Alembic

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS
- Nginx

**Backend**
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT
- Argon2

**Database**
- PostgreSQL
- Alembic

**DevOps**
- Docker
- Docker Compose
- GitHub Actions
- Render

## Architecture

```text
                 User
                  |
                  v
           React Frontend
                  |
                  v
             Nginx Proxy
                  |
                  v
             FastAPI API
                  |
          +-------+-------+
          |               |
          v               v
      JWT Auth       SQLAlchemy
                          |
                          v
                     PostgreSQL
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/ajit-110920/job_tracker.git
cd job_tracker
```

### 2. Create Python environment

```bash
python -m venv venv
```

Activate on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file using `.env.example` as a reference.

Configure your PostgreSQL connection and JWT secret.

Never commit `.env` or production secrets.

### 5. Run database migrations

```bash
alembic upgrade head
```

### 6. Start the backend

```bash
uvicorn app.main:app --reload
```

Backend: http://127.0.0.1:8000

API documentation: http://127.0.0.1:8000/docs

### 7. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Docker Setup

From the project root:

```bash
docker compose up --build
```

Access:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Testing

Backend:

```bash
python -m pytest -v
```

Frontend:

```bash
cd frontend
npm run lint
npm run test
npm run build
```

## Continuous Integration

GitHub Actions runs two independent jobs:

- Backend tests with PostgreSQL.
- Frontend linting, tests and production build.

Workflow runs automatically on pushes and pull requests to `main`.

## Screenshots

Add screenshots of the following:

- Login and registration
- Main dashboard
- Application management
- Add/edit application form

## Deployment

The application is deployed using Render:

- React frontend served by Nginx.
- FastAPI backend packaged with Docker.
- PostgreSQL database hosted on Render.

**Free-tier notice:** The current Render PostgreSQL demo database expires on December 9, 2026. This deployment is intended as a temporary portfolio demonstration.

## Future Improvements

- Automated reminders for application follow-ups
- Email notifications
- Advanced analytics
- Improved production authentication
- Persistent production database hosting

## Author

**Ajit Bhandekar**

Computer Engineering Student | AI Backend Engineering | Python | FastAPI | Data Engineering

GitHub: https://github.com/ajit-110920

LinkedIn: https://www.linkedin.com/in/ajit-bhandekar/

---

<p align="center">
  Built to learn, build, and solve real-world problems.
</p>
