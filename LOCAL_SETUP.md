# 🚀 Local Setup Guide (No Docker)

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Python 3.11+** - [Download](https://www.python.org/downloads/)
3. **PostgreSQL 15** - [Download](https://www.postgresql.org/download/windows/)
4. **Redis** (Optional for now) - Can skip initially

---

## Step 1: Database Setup (PostgreSQL)

### Install PostgreSQL
1. Download PostgreSQL 15 for Windows
2. During installation, set password as `password` (or remember your password)
3. Keep default port `5432`

### Create Database
```bash
# Open Command Prompt or PowerShell
psql -U postgres

# In psql prompt:
CREATE DATABASE adaptive_learning;
\q
```

### Load Schema
```bash
cd "c:\Users\Rajesh\Desktop\ADAPTIVE LEARNING PLATFORM"
psql -U postgres -d adaptive_learning -f database\schema.sql
```

---

## Step 2: Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Create .env file
copy .env.example .env
```

### Edit backend/.env
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptive_learning
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-super-secret-key-change-in-production
DEBUG=True
ENVIRONMENT=development

# Optional (can add later)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

### Start Backend
```bash
# Make sure you're in backend folder with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will run at:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

---

## Step 3: Frontend Setup (Next.js)

Open a **new terminal** (keep backend running):

```bash
cd frontend

# Dependencies already installed ✅

# Create .env.local file
copy .env.local.example .env.local
```

### Edit frontend/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptive_learning
```

### Start Frontend
```bash
npm run dev
```

**Frontend will run at:** http://localhost:3000

---

## ✅ Quick Start Commands

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

---

## 🎯 Simplified Workflow (Without Redis/Celery)

For now, we'll skip:
- ❌ Redis (caching) - Not critical for development
- ❌ Celery (background tasks) - Can add later
- ❌ Email notifications - Can add later

This means:
- ✅ Backend API works
- ✅ Frontend works
- ✅ Database works
- ✅ Authentication works
- ⏳ Background tasks (manual for now)
- ⏳ Email (console logs for now)

---

## 🐛 Troubleshooting

### PostgreSQL Connection Error
```bash
# Check if PostgreSQL is running
# Windows: Open Services, find PostgreSQL, start it

# Test connection
psql -U postgres -d adaptive_learning
```

### Backend Import Errors
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Port Already in Use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

---

## 📝 Development Workflow

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn app.main:app --reload
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

4. **Make Changes**
   - Both auto-reload on file changes
   - No need to restart

---

## 🎉 You're Ready!

Just run these two commands in separate terminals:

**Terminal 1:**
```bash
cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
```

**Terminal 2:**
```bash
cd frontend && npm run dev
```

Then visit: http://localhost:3000

---

## Next Steps

1. ✅ Test backend: http://localhost:8000/docs
2. ✅ Test frontend: http://localhost:3000
3. ✅ Create database models
4. ✅ Build UI components
5. ✅ Implement authentication

---

**Last Updated:** May 15, 2025
