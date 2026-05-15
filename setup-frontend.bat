@echo off
echo Setting up Frontend Environment
echo ==============================
cd frontend

echo Creating .env.local file...
if not exist .env.local (
    copy .env.local.example .env.local
    echo .env.local file created!
) else (
    echo .env.local file already exists.
)

echo.
echo ============================================
echo Frontend setup complete!
echo Dependencies already installed.
echo.
echo Next steps:
echo 1. Edit frontend\.env.local if needed
echo 2. Run: start-frontend.bat
echo ============================================
pause
