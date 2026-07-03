# AdaptLearn — Adaptive Learning Platform

AI-powered adaptive learning platform for VTU CSE students (2022 Scheme). Built with Next.js 15 + Express/TypeScript + Prisma ORM. Features BKT knowledge tracing, SM-2 spaced repetition, topic dependency graphs, and adaptive study planning — all in TypeScript.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Backend (TypeScript)
```bash
cd backend-ts
npm install
npx prisma db push
npm run db:seed
npm run dev
```
Server runs at `http://localhost:8001`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:3000`

### Default Accounts
| Role | USN | Password |
|------|-----|----------|
| Admin | `admin@gcem.edu` | `admin123` |
| Student | `1GD23CS001` | `student123` |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | Zod |
| Algorithms | BKT (Bayesian Knowledge Tracing), SM-2 (Spaced Repetition) |

## Learning Algorithms

### BKT — Bayesian Knowledge Tracing
Estimates per-topic mastery probability using p(L₀), p(T), p(G), p(S) parameters. Updates after each quiz attempt via Bayes' theorem.

### SM-2 — Spaced Repetition
Schedules review cards using ease factor, interval, and repetition count. Quality 0-5 mapped from quiz scores.

### Study Plan Generator
Rule-based scheduler (DQN fallback): weak topics first → due reviews → new topics → reinforcement. Respects topic dependency graph (prerequisites must reach threshold before unlocking).

### Topic Dependency Graph
Adjacency list per subject — prerequisite topics must reach mastery threshold before next topic unlocks.

## API Endpoints

| Category | Endpoints |
|----------|-----------|
| Auth | `POST /api/auth/register`, `/login`, `/logout`, `/me` |
| Student | `GET /api/student/dashboard`, `/profile`, `/progress`, `/leaderboard` |
| Admin | `GET /api/admin/dashboard`, `/students`, `/analytics`, `/anti-cheat-flags` |
| Tests | `GET /api/tests/`, `/start`, `/submit`, `/violation` |
| Learning | `GET /api/learning/due-today`, `/update`, `/dashboard`, `/sm2-calculate` |
| Ingestion | `POST /api/ingestion/quiz-attempt`, `/time-spent` |
| Learning State | `GET /api/learning-state/:userId`, `POST /bkt-update` |
| Study Plan | `GET /api/study-plan/:userId`, `POST /complete-step` |
| AI Tutor | `POST /api/ai/chat`, `/ask`, `/explain` |
| VTU | `GET /api/vtu/subjects`, `/subjects/{code}` |
| Notifications | `GET /api/notifications/` |

## Testing

```bash
cd backend-ts
npm test
```

40 tests covering BKT algorithm, SM-2 algorithm, auth utilities, and study plan generation.

## Project Structure

```
├── backend-ts/           # TypeScript backend (Express + Prisma)
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # BKT, SM-2 algorithms
│   │   ├── middleware/    # Auth, RBAC
│   │   ├── utils/        # Password hashing, JWT
│   │   └── __tests__/    # Jest test suite
│   ├── prisma/           # Database schema
│   └── seed.ts           # Database seeder
├── frontend/             # Next.js 15 frontend
│   ├── src/app/          # Page routes
│   ├── src/components/   # React components
│   └── src/lib/          # API client, utilities
└── PROGRESS_LOG.md       # Development progress
```

## Environment Variables

Copy `.env.example` to `.env` in `backend-ts/` and configure:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-in-production"
JWT_EXPIRES_IN="24h"
PORT=8001
CORS_ORIGINS="http://localhost:3000"
GEMINI_API_KEY=""        # For AI features (optional)
OPENROUTER_API_KEY=""    # Fallback AI (optional)
```

## License

MIT
