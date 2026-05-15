# Backend - AdaptLearn API

## Quick Start

```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at **http://localhost:8000**
API docs at **http://localhost:8000/docs**

## What's Inside

- **SQLite database** — auto-created at `backend/adaptlearn.db`, no setup needed
- **Auto-seeded data** — student, admin, subjects, certificates, achievements
- **JWT authentication** — bcrypt password hashing
- **8 routers** with full CRUD on all resources

## Default Accounts (auto-seeded)

| Role | Username | Password |
|------|----------|----------|
| Student | `student` | `student123` |
| Admin | `admin` | `admin123` |

## Endpoints Overview

### Auth (`/api/auth`)
- `POST /register` — register new user (student or admin)
- `POST /login` — OAuth2 password flow
- `POST /logout`
- `GET /me`

### Student (`/api/student`)
- `GET /dashboard` — counts and metrics
- `GET /subjects` — all subjects
- `GET /certificates` — earned certificates
- `GET /achievements` — earned achievements
- `GET /progress` — subject-wise progress

### Admin (`/api/admin`)
- `GET /dashboard` — admin overview
- `GET /students` — list all students (filter: section, semester)
- `GET /students/{usn}` — specific student
- `GET /subjects`
- `GET /anti-cheat-flags`
- `GET /analytics`

### Tests (`/api/tests`)
- `GET /` — list active tests
- `GET /{id}` — get test details
- `POST /` — create test (admin)
- `POST /{id}/start` — student starts a test
- `POST /{attempt_id}/submit` — submit answers
- `POST /{attempt_id}/violation` — log anti-cheat flag
- `GET /{attempt_id}/result` — view result

### Journal (`/api/journal`)
- `GET /` — list entries (filter: q, starred)
- `POST /` — create entry
- `GET /{id}`, `PUT /{id}`, `DELETE /{id}`
- `GET /stats/summary`

### AI Tutor (`/api/ai`)
- `POST /ask` — ask the AI (uses OpenAI if `OPENAI_API_KEY` is set, else fallback)
- `POST /explain`
- `POST /generate-quiz`

### Planner (`/api/planner`)
- `GET /today` — today's schedule
- `GET /goals` — weekly goals
- `POST /sessions/start`, `POST /sessions/{id}/end`
- `GET /mastery` — topic mastery levels

### Notifications (`/api/notifications`)
- `GET /` — list user notifications
- `PUT /{id}/read`, `PUT /read-all`
- `POST /send` — admin broadcasts

## Frontend Integration

The frontend (`frontend/src/lib/api.ts`) has a complete API client. The `AuthContext` will:
1. Try the real backend first
2. Fall back to localStorage `mockDB` if backend is offline

This means the app works even without the backend running.

## Configuration (`backend/.env`)

```env
DATABASE_URL=sqlite:///./adaptlearn.db
SECRET_KEY=change-this-secret-in-production-please
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
OPENAI_API_KEY=  # optional
```

## Switching to Postgres Later

When ready, just change `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptlearn
```

The same models work with both. You'll need to run `pip install psycopg2-binary` first.

## Architecture

```
backend/
├── app/
│   ├── main.py          # FastAPI app + lifespan
│   ├── config.py        # Settings (Pydantic)
│   ├── database.py      # SQLAlchemy setup
│   ├── auth.py          # JWT + bcrypt helpers
│   ├── models.py        # 11 SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── seed.py          # Initial data
│   └── routers/
│       ├── auth.py
│       ├── student.py
│       ├── admin.py
│       ├── tests.py
│       ├── journal.py
│       ├── ai.py
│       ├── planner.py
│       └── notifications.py
├── requirements.txt
├── .env
└── adaptlearn.db        # auto-created SQLite database
```

## Models

- **User** — students and admins in one table with role discrimination
- **Subject** — courses
- **Topic** — subject sub-topics
- **Test** + **Question** + **TestAttempt**
- **JournalEntry** — code journal
- **Certificate** + **Achievement**
- **StudySession** + **TopicMastery**
- **Notification**
- **AntiCheatFlag**
