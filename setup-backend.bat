@echo off
echo Setting up Backend Environment
echo ==============================
cd backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit it with your database credentials.
) else (
    echo .env file already exists.
)

echo.
echo ============================================
echo Backend setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env with your database URL
echo 2. Run: start-backend.bat
echo ============================================
pause
