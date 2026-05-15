@echo off
echo Starting Adaptive Learning Platform - Backend
echo ============================================
cd backend
call venv\Scripts\activate
echo.
echo Backend starting at http://localhost:8000
echo API Docs at http://localhost:8000/docs
echo.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
