# AdaptLearn — Adaptive Learning Platform

AI-powered adaptive learning platform for VTU CSE students (2022 Scheme). Full-stack TypeScript: Next.js 15 frontend + Express backend + PostgreSQL + Prisma ORM. Features BKT knowledge tracing, SM-2 spaced repetition, DQN-inspired adaptive scheduling, topic dependency graphs, real-time WebSocket notifications, Redis caching, and Gemini 2.5 Flash AI tutoring.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Backend
```bash
cd backend-ts
cp ../.env.example .env   # Edit with your DB credentials + GEMINI_API_KEY + JWT_SECRET
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev                # http://localhost:8001
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                # http://localhost:3000
```

### Default Accounts

| Role | USN/Email | Password |
|------|-----------|----------|
| Admin | `admin@gcem.edu` | `admin123` |
| Student | `1GD23CS001` | `student123` |

### Running Tests
```bash
cd backend-ts && npm test  # 166 tests, 14 suites
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL 14+ |
| Auth | JWT (jsonwebtoken), bcryptjs |
| AI | Google Gemini 2.5 Flash (15s timeout, 3 retries, builtin fallback) |
| Cache | Redis (ioredis) with in-memory fallback |
| Real-time | Socket.io (JWT-authenticated WebSocket) |
| Algorithms | BKT, SM-2, DQN-inspired scheduler |
| Rate Limits | Global (500/15min), Auth (20/15min), AI (15/min) |

## Features

### Student
- **Dashboard** — Progress overview, streak, upcoming tests
- **AI Tutor** — Ask questions, get explanations, generate quizzes (Gemini 2.5 Flash)
- **Study Planner** — DQN-inspired adaptive daily schedule based on mastery gaps + spaced repetition
- **Topic Mastery** — Visual progress with dependency graph visualization
- **Tests & Assessments** — Timed tests with anti-cheat, achievement awarding on submission
- **Leaderboard** — Ranked by test score + CGPA with pagination
- **Journal** — Mood tracking, starred entries, search
- **Certificates** — Download earned certificates
- **Achievements** — 6 badge definitions with rarity levels
- **Notifications** — Real-time WebSocket alerts + paginated list

### Admin
- **Dashboard** — Student count, active tests, performance stats
- **Student Management** — Paginated list with search, add, edit, CSV import
- **Subject Management** — View VTU subjects and modules
- **Test Creation** — Create tests with anti-cheat options
- **Analytics** — Class performance, distribution charts
- **Notifications** — Send announcements (emits to WebSocket in real-time)
- **Reports** — Export performance/test/engagement CSVs

### Learning Algorithms
- **BKT** — Bayesian Knowledge Tracing: estimates mastery probability per topic
- **SM-2** — Spaced repetition: schedules optimal review intervals
- **DQN Scheduler** — Q-value approximation with 4-factor reward (mastery, forgetting, depth, exploration)
- **Dependency Graph** — Prerequisites gate topic unlock; visual CSS-based graph at `/mastery/graph`

## API Endpoints (75+)

| Category | Endpoints |
|----------|-----------|
| Auth | `POST /api/auth/register`, `/login`, `/logout`, `/me` |
| Student | `GET /api/student/dashboard`, `/profile`, `/progress`, `/leaderboard` (paginated) |
| Admin | `GET /api/admin/dashboard`, `/students` (paginated), `/analytics`, `/reports` |
| Tests | `GET /api/tests/`, `/start`, `/submit`, `/violation` |
| Learning | `GET /api/learning/due-today`, `/update`, `/dashboard` |
| AI | `POST /api/ai/chat`, `/ask`, `/explain`, `/generate-quiz` |
| Journal | `GET/POST /api/journal/`, `/stats/summary` (Zod validated) |
| Planner | `GET /api/planner/today` (DQN-powered), `/goals`, `/mastery` |
| Notifications | `GET/POST /api/notifications/`, `/send`, `/read-all` (paginated, WebSocket) |
| Documents | `GET/POST /api/documents/upload`, `/ask` |
| VTU | `GET /api/vtu/subjects`, `/subjects/{code}` |
| Learning State | `POST /api/learning-state/update` (BKT) |

## Security & Infrastructure

- **Rate limiting** — Global (500/15min), Auth (20/15min), AI (15/min), Upload (10/min)
- **Security headers** — X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS
- **Input validation** — Zod schemas on 6+ routes
- **JWT auth** — Fail-fast if `JWT_SECRET` missing; role-based access control
- **Redis cache** — Async caching with TTL; in-memory fallback when `REDIS_URL` unset
- **WebSocket auth** — Socket.io with JWT handshake verification
- **Error tracking** — Structured logging with Sentry-ready integration
- **Global error handler** — Frontend catches unhandled errors + unhandledrejection

## Project Structure

```
├── backend-ts/                    # TypeScript backend
│   ├── src/
│   │   ├── routes/               # 14 API route modules
│   │   ├── services/             # BKT, SM-2, DQN scheduler, achievements
│   │   ├── middleware/           # Auth, rate-limit, security, validation
│   │   ├── utils/               # JWT, password hashing
│   │   ├── cache.ts             # Redis with in-memory fallback
│   │   ├── websocket.ts         # Socket.io server + auth
│   │   ├── error-tracking.ts    # Sentry-ready error capture
│   │   └── __tests__/           # Jest suite (166 tests, 14 files)
│   ├── prisma/                   # Database schema (17 models)
│   └── seed.ts                   # Database seeder
├── frontend/                     # Next.js 15 frontend
│   ├── src/app/                  # 25+ page routes
│   ├── src/components/           # React components + error boundary
│   ├── src/contexts/             # Auth, Toast providers
│   └── src/lib/                  # API client (token in memory only)
├── .github/workflows/ci.yml     # CI with PostgreSQL service
└── docs/                         # Verification, rate limits, deployment plan
```

## Performance

- API response: 5-50ms across all endpoints
- Gzip compression enabled
- Redis caching with 30s TTL + in-memory fallback
- Batch DB queries with `Promise.all` / `createMany`
- Cascade deletes on all User relations (10 models)
- Database indexes on hot paths
- Next.js standalone build for production

## License

MIT
