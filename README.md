# 🎓 Adaptive Learning Platform

AI-powered learning platform for VTU students with adaptive scheduling, code journal, and smart assessments.

## 🚀 Quick Start

### 1. Install
- Python 3.11+
- Node.js 18+
- PostgreSQL 15

### 2. Setup Database
```bash
psql -U postgres
CREATE DATABASE adaptive_learning;
\q

psql -U postgres -d adaptive_learning -f database/schema.sql
```

### 3. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install --only-binary :all: psycopg2-binary
pip install fastapi uvicorn[standard] python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv sqlalchemy alembic pydantic pydantic-settings httpx python-dateutil pytest pytest-asyncio black
copy .env.example .env
uvicorn app.main:app --reload
```

### 4. Frontend
```bash
cd frontend
copy .env.local.example .env.local
npm run dev
```

### 5. Access
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📁 Structure

```
├── frontend/          # Next.js 15 + TypeScript
├── backend/           # FastAPI + Python
├── database/          # PostgreSQL schema
└── docs/              # Documentation
```

## 🛠️ Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui  
**Backend:** FastAPI, SQLAlchemy, PostgreSQL  
**Features:** JWT Auth, Code Journal, AI Tutor, Smart Tests

## 📝 Environment Variables

**backend/.env:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptive_learning
SECRET_KEY=your-secret-key
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptive_learning
```

## 📚 Docs

- [Task List](TASK_LIST.md) - All tasks
- [Progress](PROGRESS_SUMMARY.md) - Current status
- [Analysis](docs/learnings/PROJECT_ANALYSIS.md) - Technical details

---

**Version:** 2.0 | **Status:** Phase 1 - 85% Complete
