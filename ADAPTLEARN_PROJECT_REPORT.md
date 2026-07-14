# AdaptLearn - Adaptive Learning Platform
## Project Report

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Completed Phases](#completed-phases)
4. [Commits Summary](#commits-summary)
5. [Architecture](#architecture)
6. [Security](#security)
7. [Testing](#testing)
8. [AI Integration](#ai-integration)
9. [Key Files & Structure](#key-files--structure)
10. [Known Issues & Next Steps](#known-issues--next-steps)
11. [How to Run](#how-to-run)

---

## Project Overview

**AdaptLearn** is a full-stack adaptive learning platform for **VTU CSE students**. It features:

- **Adaptive Quiz Engine** — BKT (Bayesian Knowledge Tracing) + SM-2 spaced repetition
- **AI Tutor** — Powered by **Google Gemini 2.5 Flash**
- **Study Planner** — Rule-based scheduling with dependency graphs
- **Learning Analytics** — Dashboard with real-time metrics
- **Role-based Access** — Student, Admin, Faculty roles
- **Anti-Cheat System** — Tab-switch detection, time anomalies

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Language** | TypeScript (end-to-end) |
| **Backend** | Express.js + Prisma ORM |
| **Database** | PostgreSQL |
| **Frontend** | Next.js 15 (React) |
| **Styling** | Tailwind CSS |
| **State** | React Context API |
| **Auth** | JWT (JSON Web Tokens) |
| **AI** | Google Gemini 2.5 Flash |
| **Testing** | Jest (59 tests, all passing) |

---

## Completed Phases

### Phase 0-7: Core Development
- Full backend migration from FastAPI → Express/TypeScript
- 40/40 Jest tests passing
- PostgreSQL migration (from SQLite)
- JWT authentication system
- 14 route groups, 75 route handlers

### Phase 1: Performance Optimization (Commits 1-12)
| Commit | Description | Status |
|--------|-------------|--------|
| 1 | Database indexes on hot paths | ✅ Done |
| 2 | Response timing headers | ✅ Done |
| 3 | Batch queries (Promise.all) | ✅ Done |
| 4 | In-memory cache with TTL | ✅ Done |
| 5 | Cache invalidation | ✅ Done |
| 6 | Notifications batching | ✅ Done |
| 7 | Ingestion caching | ✅ Done |
| 8 | Real planner plans | ✅ Done |
| 9 | Gzip compression | ✅ Done |
| 10 | Analytics parallelization | ✅ Done |
| 11 | Health check with DB stats | ✅ Done |
| 12 | Cache stats endpoint | ✅ Done |

### Phase 2: Security & Polish (Commits 13-16)
| Commit | Description | Status |
|--------|-------------|--------|
| 13 | Error boundary, loading skeleton, documents API | ✅ Done |
| 14 | Rate limiting (500/15min global, 20/15min auth, 15/min AI) | ✅ Done |
| 15 | Security headers, input sanitization | ✅ Done |
| 16 | Validation middleware (Zod schemas) | ✅ Done |

### Phase 3: UI/UX & Testing
| Feature | Status |
|---------|--------|
| Toast notification system (ToastContext) | ✅ Done |
| Empty state component | ✅ Done |
| 59 tests total (all passing) | ✅ Done |
| Next.js standalone build | ✅ Done |
| Security headers | ✅ Done |
| Prisma singleton + graceful disconnect | ✅ Done |

### Phase 4: AI Migration
| Change | Status |
|--------|--------|
| OpenRouter → ZhipuAI GLM 5.2 | ❌ Replaced |
| ZhipuAI → **Gemini 2.5 Flash** | ✅ Active |
| Builtin fallback on failure | ✅ Implemented |

---

## Commits Summary

```
5d65ce8 fix: Switch AI tutor to Gemini 2.5 Flash (latest)
0af01a4 feat: Phase 8 - Document route fixes, push all
e77a923 feat: Phase 7 - Updated README, .env.example
f3d28f0 feat: Phase 6 - Next.js standalone, security headers
b93c441 feat: Phase 5 - Cache tests, validation tests
a4d56d5 feat: Phase 4 - Toast notifications, empty state
1e0b3de feat: Phase 3 - Validation middleware
3a6e6c2 feat: Phase 2 - Rate limiting, security headers
9b9d255 feat: Phase 1 - Error boundary, loading skeleton
950cf70 feat: Phase 0 - Core audit improvements
0b3d51e fix: Backend startup scripts
f5c8c66 fix: Added frontend/start.cjs to .gitignore
... (16 total commits on main)
```

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend (3000)                │
│              Next.js 15 + Tailwind              │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐              │
│  │   Auth      │  │   Toast     │              │
│  │   Context   │  │   Context   │              │
│  └─────────────┘  └─────────────┘              │
└─────────────────────┬───────────────────────────┘
                      │ API Proxy (/api/*)
                      ▼
┌─────────────────────────────────────────────────┐
│                Backend (8001)                   │
│           Express + Prisma + PostgreSQL          │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Rate    │ │  Auth    │ │  Cache   │       │
│  │ Limiter  │ │  JWT     │ │  TTL     │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
│  14 Route Groups:                               │
│  ├─ /api/auth        (login, register)         │
│  ├─ /api/tests       (CRUD, start, submit)     │
│  ├─ /api/study-plan  (generate, schedule)      │
│  ├─ /api/analytics   (dashboard, history)      │
│  ├─ /api/admin       (users, tests, reports)   │
│  ├─ /api/ai          (tutor chat)              │
│  ├─ /api/progress    (BKT, mastery)            │
│  ├─ /api/ingestion   (quiz attempts, time)     │
│  ├─ /api/student     (dashboard, due-today)    │
│  ├─ /api/syllabus    (topics, dependencies)    │
│  ├─ /api/planner     (daily plan, progress)    │
│  ├─ /api/documents   (upload, ask)             │
│  ├─ /api/notifications (read, clear)           │
│  └─ /api/health      (status, stats)          │
│                                                 │
│  ┌──────────────────────────────────┐          │
│  │         Gemini 2.5 Flash         │          │
│  │      (AI Tutor + Quiz Gen)      │          │
│  └──────────────────────────────────┘          │
└─────────────────────┬───────────────────────────┘
                      │ Prisma ORM (parameterized)
                      ▼
┌─────────────────────────────────────────────────┐
│              PostgreSQL Database                 │
│                                                 │
│  Tables:                                        │
│  ├─ users (id, email, role, semester)          │
│  ├─ subjects (code, name, credits)             │
│  ├─ topics (name, subjectId, difficulty)       │
│  ├─ questions (text, options, correct)         │
│  ├─ tests (title, duration, marks)            │
│  ├─ test_attempts (userId, testId, score)     │
│  ├─ user_topic_progress (mastery, bkt)        │
│  ├─ study_plans (userId, date, tasks)         │
│  ├─ notifications (type, message, read)       │
│  ├─ documents (title, path, userId)           │
│  └─ ... (17 models total)                     │
│                                                 │
│  Indexes:                                       │
│  ├─ [userId, isCompleted]                      │
│  ├─ [userId, startedAt]                        │
│  ├─ [userId, createdAt]                        │
│  ├─ [semester]                                 │
│  └─ [role]                                     │
└─────────────────────────────────────────────────┘
```

---

## Security

### Implemented ✅
- **JWT Authentication** — 24h expiry, bcrypt hash(12)
- **Role-based Access** — `authenticate`, `requireAdmin`, `requireStudent` middleware
- **Rate Limiting** — Global (500/15min), Auth (20/15min), AI (15/min)
- **Security Headers** — X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **Input Sanitization** — Request logging, input trimming
- **Parameterized Queries** — All via Prisma (no SQL injection)
- **CORS Restricted** — Only `localhost:3000`

### Known Issues ⚠️
- JWT secret has hardcoded fallback: `'change-this-in-production-please'`
- No refresh token flow (only 24h access token)
- Frontend stores JWT in localStorage (XSS vulnerable)
- Documents routes use `authenticate` only (no role check)
- No file type/size validation on document upload
- Frontend `ws` vulnerability (npm audit: 13 vulnerabilities)

---

## Testing

### Test Status: 59/59 Passing ✅

| Test Suite | Tests | Status |
|------------|-------|--------|
| BKT Algorithm | 8 | ✅ Passing |
| SM-2 Spaced Repetition | 6 | ✅ Passing |
| Auth System | 12 | ✅ Passing |
| Cache | 8 | ✅ Passing |
| Validation | 12 | ✅ Passing |
| API Routes | 13 | ✅ Passing |
| **Total** | **59** | **✅ All Passing** |

### IDOR Test Passed
- Student gets 403 on `/api/admin/students`
- Student gets 403 on `/api/admin/analytics`

---

## AI Integration

### Current: Gemini 2.5 Flash ✅

```typescript
// backend-ts/src/routes/ai.ts
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';

// Features:
// - Builtin fallback on API failure
// - Rate limiting: 15 requests/minute
// - Input validation (Zod schemas)
// - Context-aware responses
```

### Migration History
1. **OpenRouter** ❌ → No API key
2. **ZhipuAI GLM 5.2** ❌ → Failed (API error)
3. **Gemini 2.0 Flash** ❌ → Quota exhausted
4. **Gemini 2.5 Flash** ✅ → Working

---

## Key Files & Structure

```
ADAPTIVE-LEARNING-PLATFORM/
├── backend-ts/
│   ├── prisma/
│   │   └── schema.prisma          # 17 models, PostgreSQL
│   ├── src/
│   │   ├── index.ts               # Express server, middleware
│   │   ├── cache.ts               # In-memory cache with TTL
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT + role middleware
│   │   │   ├── rate-limit.ts      # Rate limiters
│   │   │   ├── security.ts        # Security headers
│   │   │   └── validation.ts      # Zod schemas
│   │   ├── routes/
│   │   │   ├── ai.ts              # Gemini 2.5 Flash
│   │   │   ├── tests.ts           # Test CRUD
│   │   │   ├── student.ts         # Student endpoints
│   │   │   ├── admin.ts           # Admin endpoints
│   │   │   ├── documents.ts       # Document upload
│   │   │   └── ... (14 total)
│   │   └── utils/
│   │       └── auth.ts            # JWT + bcrypt
│   ├── .env                       # PostgreSQL + Gemini config
│   ├── package.json
│   └── start.cjs                  # Startup script
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── login/             # Auth pages
│   │   │   ├── register/
│   │   │   ├── dashboard/         # Student dashboard
│   │   │   ├── admin/             # Admin panel
│   │   │   ├── ai-tutor/          # AI chat
│   │   │   ├── tests/             # Quiz/test pages
│   │   │   ├── study-plan/        # Study planner
│   │   │   └── ... (25+ pages)
│   │   ├── components/
│   │   │   ├── error-boundary.tsx
│   │   │   ├── loading-skeleton.tsx
│   │   │   ├── empty-state.tsx
│   │   │   └── ... (20+ components)
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx     # JWT storage
│   │   │   └── ToastContext.tsx    # Notifications
│   │   └── lib/
│   │       └── api.ts             # API client
│   ├── next.config.ts             # Proxy + security headers
│   └── package.json
├── .gitignore
├── .env.example
└── README.md
```

---

## Known Issues & Next Steps

### Immediate (Address First)
| Issue | Severity | Priority |
|-------|----------|----------|
| Write audit response file | Medium | 🔴 High |
| Remove mockDB dependency from admin/students | Medium | 🔴 High |
| Fix hardcoded JWT secret fallback | High | 🔴 High |
| Add refresh token flow | High | 🟡 Medium |

### Security Hardening
| Issue | Severity | Priority |
|-------|----------|----------|
| Documents routes need role checks | High | 🔴 High |
| Add file type/size validation | Medium | 🟡 Medium |
| Fix localStorage JWT storage (use httpOnly cookies) | High | 🟡 Medium |
| Fix 13 npm audit vulnerabilities | Low | 🟢 Low |

### Feature Gaps
| Issue | Severity | Priority |
|-------|----------|----------|
| Add pagination to list endpoints | Medium | 🟡 Medium |
| Add Zod validation to remaining POST routes | Medium | 🟡 Medium |
| Verify all frontend pages work end-to-end | Medium | 🟡 Medium |

### Infrastructure
| Issue | Severity | Priority |
|-------|----------|----------|
| No CI/CD pipeline | Low | 🟢 Low |
| No `.env` committed (confirmed) | ✅ | ✅ |
| No `$queryRawUnsafe` usage (confirmed) | ✅ | ✅ |

---

## How to Run

### Prerequisites
- Node.js 18+
- PostgreSQL (running on localhost:5432)

### Setup
```bash
# 1. Clone repo
git clone https://github.com/Rajeshkumar80/ADAPTIVE-LEARNING-PLATFORM.git

# 2. Backend setup
cd backend-ts
npm install
cp .env.example .env   # Edit with your PostgreSQL credentials
npx prisma migrate dev --name init
npx prisma db seed

# 3. Frontend setup
cd ../frontend
npm install
```

### Start (Manual)
```bash
# Terminal 1 - Backend
cd backend-ts
npm run dev
# Runs on http://localhost:8001

# Terminal 2 - Frontend
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Default Accounts
| Role | Email | Password |
|------|-------|----------|
| Student | `1GD23CS001` | `student123` |
| Admin | `admin@gcem.edu` | `admin123` |

### Run Tests
```bash
cd backend-ts
npm test
# 59 tests, all passing
```

---

## API Performance (Measured)

| Endpoint | Avg Response Time | Status |
|----------|-------------------|--------|
| POST /api/auth/login | 293ms | ✅ (rate-limited) |
| GET /api/student/dashboard | 22ms | ✅ |
| GET /api/admin/analytics | 68ms | ✅ |
| GET /api/student/due-today | 22ms | ✅ |
| GET /api/planner/today | 48ms | ✅ |
| POST /api/ai/chat | ~2s | ✅ (Gemini) |

---

## Repository Info

- **GitHub**: https://github.com/Rajeshkumar80/ADAPTIVE-LEARNING-PLATFORM.git
- **Branch**: `main`
- **Latest Commit**: `5d65ce8` (fix: Switch AI tutor to Gemini 2.5 Flash)
- **Total Commits**: 16+
- **Last Updated**: July 11, 2026

---

*Report generated: July 11, 2026*
