# 🚀 Run Locally (No Docker) - Super Simple

## ⚡ Quick Start (3 Steps)

### Step 1: Install Prerequisites
1. **Python 3.11+** - [Download](https://www.python.org/downloads/)
2. **Node.js 18+** - [Download](https://nodejs.org/)
3. **PostgreSQL 15** - [Download](https://www.postgresql.org/download/windows/)

### Step 2: Setup Database
```bash
# Open Command Prompt
psql -U postgres

# Create database
CREATE DATABASE adaptive_learning;
\q

# Load schema
cd "c:\Users\Rajesh\Desktop\ADAPTIVE LEARNING PLATFORM"
psql -U postgres -d adaptive_learning -f database\schema.sql
```

### Step 3: Run the Application
**Double-click:** `SETUP_AND_RUN.bat`

Then choose:
- Option 1: Setup Backend (first time only)
- Option 2: Setup Frontend (first time only)
- Option 5: Start Both Servers

---

## 🎯 Even Simpler (Manual)

### First Time Setup

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

**Frontend:**
```bash
cd frontend
copy .env.local.example .env.local
```

### Every Time You Want to Run

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📍 Access Your Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

---

## ✅ What Works Without Docker

- ✅ Full Backend API (40+ endpoints)
- ✅ Full Frontend (Next.js 15)
- ✅ Database (PostgreSQL)
- ✅ Authentication
- ✅ All CRUD operations
- ⏳ Background tasks (manual for now)
- ⏳ Email (console logs for now)

---

## 🐛 Common Issues

### "psql is not recognized"
Add PostgreSQL to PATH:
- Find: `C:\Program Files\PostgreSQL\15\bin`
- Add to System Environment Variables

### "python is not recognized"
Add Python to PATH during installation or:
- Find: `C:\Users\YourName\AppData\Local\Programs\Python\Python311`
- Add to System Environment Variables

### Port Already in Use
```bash
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
uvicorn app.main:app --reload --port 8001
```

---

## 📝 Configuration Files

### backend/.env
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptive_learning
SECRET_KEY=your-secret-key
DEBUG=True
```

### frontend/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptive_learning
```

---

## 🎉 That's It!

Just run `SETUP_AND_RUN.bat` and choose option 5 to start everything!

---

**Last Updated:** May 15, 2025
