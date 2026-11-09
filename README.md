# JobTrack — Job Application Management SaaS

<p align="center">
  <strong>A full-stack, production-grade job application tracker built for ambitious job seekers.</strong>
</p>

<p align="center">
  <a href="https://job-tracker-frontend-kd4o.onrender.com"><img src="https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo" /></a>
  <a href="https://job-tracker-e8p3.onrender.com/docs"><img src="https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger Docs" /></a>
  <a href="https://github.com/ajit-110920/job_tracker/actions"><img src="https://img.shields.io/github/actions/workflow/status/ajit-110920/job_tracker/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white" alt="CI Status" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-0.141-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## 📌 Overview

**JobTrack** is a modern, high-performance web application designed to help candidates organize, track, and analyze their job search pipeline in one place. 

It provides an end-to-end workflow: secure registration, JWT-authenticated access, pipeline stage tracking (Applied, Interview, Offer, Rejected), real-time search and status filtering, metrics overview, and responsive desktop and mobile dashboards.

The application adheres to clean architecture principles:
- **Backend**: Layered FastAPI service (Routes → Services → Models/Schemas) powered by PostgreSQL and Alembic migrations.
- **Frontend**: Component-driven React 19 application with custom SaaS design tokens, dark/light themes, and zero bulky UI frameworks.
- **Infrastructure**: Fully containerized with multi-stage Docker builds, Nginx reverse proxy, and automated GitHub Actions CI/CD.

---

## 🌐 Live Deployments

| Service | Link | Description |
|---|---|---|
| **Web Application** | [job-tracker-frontend-kd4o.onrender.com](https://job-tracker-frontend-kd4o.onrender.com) | Production React SPA served via Nginx |
| **Backend REST API** | [job-tracker-e8p3.onrender.com](https://job-tracker-e8p3.onrender.com) | FastAPI cloud service running on Docker |
| **Interactive API Docs** | [job-tracker-e8p3.onrender.com/docs](https://job-tracker-e8p3.onrender.com/docs) | Swagger UI for interactive API exploration |
| **Alternative Docs** | [job-tracker-e8p3.onrender.com/redoc](https://job-tracker-e8p3.onrender.com/redoc) | ReDoc API specification |

---

## ✨ Key Features

### 🎨 Frontend & UX
- **Refined SaaS Design System**: Built with CSS custom properties (tokens) for consistent spacing, colors, elevations, and typography without heavy CSS dependencies.
- **Dark & Light Mode**: Seamless theme switching with system preference detection and `localStorage` persistence.
- **5-Metric Analytics Grid**: Instant counts for *Total Applications*, *Applied*, *Interviews*, *Offers*, and *Rejected*.
- **Live Search & Status Filtering**: Instant client-side search across company names and role titles, paired with status tab counters.
- **Accessible Modal Flows**: Custom accessible modals for adding/editing opportunities and a confirmation dialog for deletions.
- **State Feedback**: Animated skeleton loading placeholders and auto-dismissing toast notifications.
- **Visible Session Management**: Dedicated sidebar sign-out button that purges JWT credentials and clears user state.
- **Mobile Responsive**: Slide-out drawer navigation and adaptive data layouts tailored for mobile devices and tablets.

### ⚙️ Backend & Architecture
- **Layered Architecture**: Strict separation of concerns between HTTP routing, business logic services, SQLAlchemy ORM models, and Pydantic schemas.
- **Secure Authentication**: Password hashing via modern **Argon2** (`pwdlib`) and Stateless **JWT tokens** (`HS256`).
- **Complete User Isolation**: Every database query filters on authenticated `user_id`, preventing cross-tenant access.
- **Optimized Database Aggregations**: Dashboard metrics calculated in a single database `GROUP BY` query rather than multiple count operations.
- **RESTful Endpoints**: Full CRUD support including selective partial updates via `PATCH`.
- **Database Migrations**: Version-controlled schema migrations using Alembic.
- **Security Hardening**: Docker container runs as a non-root `appuser`, pre-ping connection pool checks, CORS middleware, and global exception handlers.

---

## 🏗️ Architecture

```
                            ┌────────────────────────┐
                            │      Web Browser       │
                            │   (Desktop / Mobile)   │
                            └───────────┬────────────┘
                                        │ HTTPS
                                        ▼
                            ┌────────────────────────┐
                            │   Nginx Reverse Proxy  │
                            │   (Static Assets &     │
                            │    /api Proxy Pass)    │
                            └───────────┬────────────┘
                                        │ HTTP /api/*
                                        ▼
                            ┌────────────────────────┐
                            │    FastAPI Backend     │
                            │ (Uvicorn ASGI Server)  │
                            └─────┬────────────┬─────┘
                                  │            │
                      JWT Verify  │            │ SQLAlchemy ORM
                                  ▼            ▼
                           ┌─────────────┐  ┌──────────────────┐
                           │ Auth Engine │  │ PostgreSQL 16 DB │
                           │  (Argon2)   │  │ (Alembic Schema) │
                           └─────────────┘  └──────────────────┘
```

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, Lucide React, Modern CSS Tokens, Vitest, Testing Library |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy 2.0, Pydantic v2, PyJWT, Argon2, Uvicorn |
| **Database** | PostgreSQL 16, Alembic Migrations |
| **DevOps & CI/CD** | Docker (Multi-stage), Docker Compose, Nginx, GitHub Actions, Render Cloud |

---

## 📁 Project Structure

```text
job_tracker/
├── app/                        # FastAPI Backend Application
│   ├── models/                 # SQLAlchemy ORM Database Models
│   │   ├── job.py              # Job model with timestamps and relations
│   │   └── user.py             # User model with authentication data
│   ├── routes/                 # API Route Controllers
│   │   ├── auth.py             # Registration and Login routes
│   │   └── jobs.py             # CRUD and Stats routes
│   ├── schemas/                # Pydantic Request/Response DTOs
│   │   ├── job.py              # Job schemas and status enum
│   │   └── user.py             # User schemas and token models
│   ├── services/               # Business Logic Layer
│   │   ├── job_service.py      # Database queries and aggregations
│   │   └── user_service.py     # User creation and authentication
│   ├── auth.py                 # JWT generation and current-user dependency
│   ├── database.py             # Engine, sessionmaker, and get_db dependency
│   ├── main.py                 # FastAPI application initialization & CORS
│   └── security.py             # Shared Argon2 password hasher
├── alembic/                    # Database Migration Scripts
├── frontend/                   # React 19 Frontend Application
│   ├── src/
│   │   ├── api/client.js       # Unified API client & proxy handler
│   │   ├── components/
│   │   │   ├── Auth/           # Login & Registration views
│   │   │   ├── Dashboard/      # Sidebar, Header, Stats, Table, Filters
│   │   │   ├── Modals/         # Create/Edit and Delete Confirmation dialogs
│   │   │   └── UI/             # Buttons, Badges, Toasts, Skeletons
│   │   ├── styles/
│   │   │   ├── tokens.css      # SaaS color, typography, spacing tokens
│   │   │   └── components.css  # Component stylesheets
│   │   ├── JobTracker.jsx      # Main application state orchestrator
│   │   └── JobTracker.test.jsx # Vitest suite for UI & auth flows
│   ├── Dockerfile              # Multi-stage production container (Node → Nginx)
│   └── nginx.conf              # Nginx proxy configuration
├── tests/                      # Pytest Backend Test Suite
├── .github/workflows/ci.yml    # Automated CI Pipeline
├── docker-compose.yml          # Local multi-container development environment
├── Dockerfile                  # Backend container specification
└── requirements.txt            # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Git**
- **Python 3.12+**
- **Node.js 20+** and **npm**
- **PostgreSQL 16** (or **Docker**)

---

### Option A: Running with Docker Compose (Recommended)

The fastest way to run the entire stack (Frontend + Backend + PostgreSQL) locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ajit-110920/job_tracker.git
   cd job_tracker
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to define your `POSTGRES_PASSWORD` and `JWT_SECRET_KEY`.*

3. **Start all services:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - 🌐 Frontend: [http://localhost:3000](http://localhost:3000)
   - ⚡ Backend API: [http://localhost:8000](http://localhost:8000)
   - 📖 API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option B: Local Manual Setup

#### 1. Backend Setup

```bash
# 1. Create and activate a Python virtual environment
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your local PostgreSQL credentials and JWT secret

# 4. Run database migrations
alembic upgrade head

# 5. Start the development server
uvicorn app.main:app --reload
```
*Backend runs on `http://127.0.0.1:8000`.*

#### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev
```
*Frontend runs on `http://localhost:5173` (Vite automatically proxies `/api` calls to `http://127.0.0.1:8000`).*

---

## 📡 API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Authenticate and obtain JWT Bearer token | No |

### Jobs Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/jobs` | List user's jobs (supports search, sort, pagination) | **Yes** |
| `POST` | `/jobs` | Create a new job application | **Yes** |
| `GET` | `/jobs/stats` | Retrieve aggregated pipeline statistics | **Yes** |
| `GET` | `/jobs/{id}` | Get details of a specific job | **Yes** |
| `PUT` | `/jobs/{id}` | Full update of a job application | **Yes** |
| `PATCH` | `/jobs/{id}` | Partial update of specific job fields | **Yes** |
| `DELETE` | `/jobs/{id}` | Delete a job application | **Yes** |
| `GET` | `/health` | Health check probe | No |

---

## 🧪 Testing & Verification

Both frontend and backend are covered by automated tests.

### Backend Tests
Tests cover registration, login, JWT validation, cross-user data isolation, pagination, sorting, and CRUD operations:

```bash
python -m pytest -v
```

### Frontend Tests & Quality Checks
Tests verify login rendering, view switching, password toggle, authenticated job display, and session logout:

```bash
cd frontend

# Run unit & component tests
npm run test

# Run ESLint validation
npm run lint

# Verify production build bundle
npm run build
```

---

## 🔄 Continuous Integration

The repository features automated CI via **GitHub Actions** (`.github/workflows/ci.yml`). On every push or pull request to `main`, the pipeline executes:

1. **Backend Job**:
   - Boots up an isolated PostgreSQL 16 service container.
   - Installs dependencies.
   - Executes database migrations and runs the `pytest` test suite.
2. **Frontend Job**:
   - Sets up Node.js 22 with dependency caching.
   - Runs ESLint validation.
   - Runs Vitest component tests.
   - Validates the production Vite build.

---

## 👨‍💻 Author

**Ajit Bhandekar**  
Computer Engineering Student | AI Backend Engineering | Python | FastAPI | Data Engineering

- **GitHub**: [@ajit-110920](https://github.com/ajit-110920)
- **LinkedIn**: [linkedin.com/in/ajit-bhandekar](https://www.linkedin.com/in/ajit-bhandekar/)

---

<p align="center">
  <sub>Built with care to solve real-world career workflow challenges. Contributions and feedback are welcome!</sub>
</p>
