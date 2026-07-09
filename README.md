# AdaptLearn — Adaptive Learning Platform

AI-powered adaptive learning platform for VTU CSE students (2022 Scheme). Built with Next.js 15 + Express/TypeScript + Prisma ORM + PostgreSQL. Features BKT knowledge tracing, SM-2 spaced repetition, topic dependency graphs, adaptive study planning, and AI tutoring — all in TypeScript.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Backend
```bash
cd backend-ts
cp ../.env.example .env  # Edit with your DB credentials
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
| Role | USN/Email | Password |
|------|-----------|----------|
| Admin | `admin@gcem.edu` | `admin123` |
| Student | `1GD23CS001` | `student123` |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL 14+ |
| Auth | JWT (jsonwebtoken), bcryptjs |
| AI | ZhipuAI GLM 5.2 (with builtin fallback) |
| Algorithms | BKT (Bayesian Knowledge Tracing), SM-2 (Spaced Repetition) |
| Process Mgr | pm2 |

## Features

### Student Features
- **Dashboard** — Progress overview, streak, upcoming tests
- **AI Tutor** — Ask questions, get explanations, generate quizzes
- **Study Planner** — Daily schedule based on mastery gaps
- **Topic Mastery** — Visual progress across all subjects
- **Tests & Assessments** — Timed tests with anti-cheat
- **Leaderboard** — Rank by test score and CGPA
- **Journal** — Mood tracking, starred entries, search
- **Certificates** — Download earned certificates
- **Achievements** — Badge collection with rarity levels
- **Notifications** — Real-time alerts and announcements

### Admin Features
- **Dashboard** — Student count, active tests, performance stats
- **Student Management** — Browse, add, edit, import students
- **Subject Management** — View VTU subjects and modules
- **Test Creation** — Create tests with anti-cheat options
- **Analytics** — Class performance, distribution charts
- **Notifications** — Send announcements to students
- **Reports** — Export performance/test/engagement CSVs

### Learning Algorithms
- **BKT** — Estimates mastery probability per topic
- **SM-2** — Schedules spaced repetition reviews
- **Dependency Graph** — Prerequisites unlock new topics
- **Adaptive Planner** — Prioritizes weak topics + due reviews

## API Endpoints (63+)

| Category | Endpoints |
|----------|-----------|
| Auth | `POST /api/auth/register`, `/login`, `/logout`, `/me` |
| Student | `GET /api/student/dashboard`, `/profile`, `/progress`, `/leaderboard` |
| Admin | `GET /api/admin/dashboard`, `/students`, `/analytics`, `/reports` |
| Tests | `GET /api/tests/`, `/start`, `/submit`, `/violation` |
| Learning | `GET /api/learning/due-today`, `/update`, `/dashboard` |
| AI | `POST /api/ai/chat`, `/ask`, `/explain`, `/generate-quiz` |
| Journal | `GET/POST /api/journal/`, `/stats/summary` |
| Planner | `GET /api/planner/today`, `/goals`, `/mastery` |
| Notifications | `GET/POST /api/notifications/`, `/send`, `/read-all` |
| Documents | `GET/POST /api/documents/upload`, `/ask` |
| VTU | `GET /api/vtu/subjects`, `/subjects/{code}` |

## Security

- Rate limiting (500 req/15min global, 20 req/15min auth, 15 req/min AI)
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- Input validation middleware
- JWT authentication with role-based access
- Request sanitization

## Testing

```bash
cd backend-ts
npm test
```
59 tests covering BKT, SM-2, auth, cache, and validation.

## Project Structure

```
├── backend-ts/              # TypeScript backend
│   ├── src/
│   │   ├── routes/          # 13 API route modules
│   │   ├── services/        # BKT, SM-2 algorithms
│   │   ├── middleware/       # Auth, rate-limit, security, validation
│   │   ├── utils/           # Password hashing, JWT
│   │   └── __tests__/       # Jest test suite (59 tests)
│   ├── prisma/              # Database schema (17 models)
│   └── seed.ts              # Database seeder
├── frontend/                # Next.js 15 frontend
│   ├── src/app/             # 25+ page routes
│   ├── src/components/      # React components + UI library
│   ├── src/contexts/        # Auth, Toast providers
│   └── src/lib/             # API client, utilities
└── .env.example             # Environment template
```

## Performance

- API response times: 5-50ms across all endpoints
- Gzip compression enabled
- In-memory caching with TTL (30s default)
- Batch database queries with Promise.all
- Database indexes on hot paths
- Next.js standalone build for production

## License

MIT
