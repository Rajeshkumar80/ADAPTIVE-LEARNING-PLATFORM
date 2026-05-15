@echo off
cls
echo ========================================
echo  Adaptive Learning Platform
echo  Local Setup and Run
echo ========================================
echo.

:menu
echo.
echo Choose an option:
echo.
echo 1. First Time Setup (Backend)
echo 2. First Time Setup (Frontend)
echo 3. Start Backend Server
echo 4. Start Frontend Server
echo 5. Start Both (Opens 2 windows)
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto setup_backend
if "%choice%"=="2" goto setup_frontend
if "%choice%"=="3" goto start_backend
if "%choice%"=="4" goto start_frontend
if "%choice%"=="5" goto start_both
if "%choice%"=="6" goto end
goto menu

:setup_backend
echo.
echo Setting up Backend...
call setup-backend.bat
goto menu

:setup_frontend
echo.
echo Setting up Frontend...
call setup-frontend.bat
goto menu

:start_backend
echo.
echo Starting Backend...
start cmd /k start-backend.bat
echo Backend started in new window!
timeout /t 2 >nul
goto menu

:start_frontend
echo.
echo Starting Frontend...
start cmd /k start-frontend.bat
echo Frontend started in new window!
timeout /t 2 >nul
goto menu

:start_both
echo.
echo Starting Backend and Frontend...
start cmd /k start-backend.bat
timeout /t 2 >nul
start cmd /k start-frontend.bat
echo.
echo Both servers started in separate windows!
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
timeout /t 3 >nul
goto menu

:end
echo.
echo Goodbye!
timeout /t 1 >nul
exit
