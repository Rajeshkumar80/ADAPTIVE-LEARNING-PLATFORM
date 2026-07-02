# AdaptLearn — Adaptive Learning Platform

AI-powered adaptive learning platform for VTU CSE students (2022 Scheme). Built with Next.js 15 + FastAPI + SM-2 spaced repetition + Google Gemini AI.

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Server runs at `http://localhost:8000` | API docs at `http://localhost:8000/docs`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:3000`

### Default Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@gcem.edu` | `admin123` |
| Student | `<usn>@gcem.edu` | `<usn>` (e.g. `1gd23cs001@gcem.edu` / `1gd23cs001`) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Recharts |
| Backend | FastAPI, Python 3.11+, SQLAlchemy |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (python-jose), bcrypt |
| AI | Google Gemini + OpenRouter (fallback) |
| Scheduling | SM-2 Spaced Repetition Algorithm |

## Features

- **SM-2 Adaptive Scheduler** — Spaced repetition for optimal review timing
- **AI Tutor** — Gemini-powered chat with document upload (RAG)
- **VTU Integration** — All 8 semesters, 64 subjects, 205 course outcomes
- **Progress Tracker** — Module-by-module flowchart with topic completion
- **Anti-Cheat Tests** — Tab detection, auto-submit, violation logging
- **Gamification** — Certificates, achievements, leaderboard, streaks
- **Admin Dashboard** — Student management, analytics, test creation
- **Email Notifications** — Resend-powered notifications

## API Endpoints (68+ routes)

| Category | Endpoints |
|----------|-----------|
| Auth | `/api/auth/register`, `/login`, `/logout`, `/me` |
| Student | `/api/student/dashboard`, `/profile`, `/progress`, `/leaderboard` |
| Admin | `/api/admin/dashboard`, `/students`, `/analytics`, `/anti-cheat-flags` |
| Tests | `/api/tests/` (CRUD), `/start`, `/submit`, `/violation`, `/result` |
| AI Tutor | `/api/ai/chat`, `/ask`, `/explain`, `/generate-quiz`, `/status` |
| Planner | `/api/planner/today`, `/goals`, `/sessions/start`, `/sessions/end`, `/mastery` |
| Learning | `/api/learning/due-today`, `/update`, `/dashboard`, `/sm2-calculate` |
| Documents | `/api/documents/upload`, `/ask` (RAG) |
| VTU | `/api/vtu/subjects`, `/subjects/{code}`, `/program-outcomes`, `/import` |
| Notifications | `/api/notifications/`, `/send`, `/broadcast`, `/stats` |

## Testing

```bash
cd backend
pytest tests/ -v
```

63 tests across 9 test files covering auth, admin, student, tests, learning, VTU, and more.

## Docker

```bash
docker-compose up --build
```

## Environment Variables

Copy `.env.example` to `.env` in the backend directory and configure:

```env
DATABASE_URL=sqlite:///./adaptlearn.db
SECRET_KEY=change-this-in-production
GEMINI_API_KEY=your-key        # For AI features
OPENROUTER_API_KEY=your-key    # Fallback AI
RESEND_API_KEY=your-key        # For email notifications
```

## License

MIT
