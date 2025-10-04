@echo off
echo 🚀 Starting Mini E-Learning Platform...

REM Check if uv is installed
where uv >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ uv is not installed. Please install it first.
    echo Run: powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo 📦 Setting up Python virtual environment...
    uv venv
)

echo 📦 Installing backend dependencies...
call .venv\Scripts\activate
uv pip install -r requirements.txt

REM Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

echo 🔥 Starting backend server...
start "Backend Server" cmd /k "uv run python main.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo ⚡ Starting frontend server with hot reload...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ✅ Platform is starting up!
echo 🔗 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:8000
echo.
echo Press any key to exit...
pause >nul