# Run the Application

## Setup (First Time Only)

### 1. Database
```bash
psql -U postgres
CREATE DATABASE adaptive_learning;
\q

psql -U postgres -d adaptive_learning -f database/schema.sql
```

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend
Already done ✅

---

## Run (Every Time)

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

## Access
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/docs
