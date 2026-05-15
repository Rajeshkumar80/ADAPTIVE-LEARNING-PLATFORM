# 🚀 Start Here - Simple Setup

## What You Need
1. Python 3.11+ installed
2. Node.js 18+ installed  
3. PostgreSQL 15 installed and running

---

## Step 1: Setup Database (One Time Only)

Open a new terminal and run:
```bash
psql -U postgres
```

Then in PostgreSQL prompt:
```sql
CREATE DATABASE adaptive_learning;
\q
```

Load the schema:
```bash
psql -U postgres -d adaptive_learning -f database/schema.sql
```

---

## Step 2: Install Backend (One Time Only)

Open PowerShell in this folder and run:

```bash
cd backend
venv\Scripts\activate
python -m pip install --upgrade pip
pip install --only-binary :all: psycopg2-binary
pip install fastapi uvicorn[standard] python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv sqlalchemy alembic pydantic pydantic-settings httpx python-dateutil pytest pytest-asyncio black
```

---

## Step 3: Install Frontend (One Time Only)

Open a NEW terminal and run:
```bash
cd frontend
npm install
```

---

## Step 4: Run Backend (Every Time)

In backend terminal:
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Backend will run at: http://localhost:8000
API Docs at: http://localhost:8000/docs

---

## Step 5: Run Frontend (Every Time)

In frontend terminal:
```bash
cd frontend
npm run dev
```

Frontend will run at: http://localhost:3000

---

## ✅ Done!

Open http://localhost:3000 in your browser!

---

## Troubleshooting

**If psycopg2-binary fails:**
- Make sure you used `--only-binary :all:` flag
- Try: `pip install --upgrade pip setuptools wheel` first

**If database connection fails:**
- Check PostgreSQL is running
- Update password in `backend/.env` if needed

**If frontend fails:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
