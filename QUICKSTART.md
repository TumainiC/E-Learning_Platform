# 🚀 Quick Start Guide

Get your Mini E-Learning Platform up and running in minutes!

## 📋 Prerequisites

Before you begin, ensure you have:
- **Python 3.8+** installed
- **Node.js 16+** installed
- **MongoDB** running (local or cloud)
- **uv** package manager installed

### Install uv (if not already installed)
```bash
# On macOS and Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## ⚡ Quick Setup (2 Methods)

### Method 1: Automatic Startup (Recommended)

#### For Linux/macOS:
```bash
# Make startup script executable and run
chmod +x start_app.sh
./start_app.sh
```

#### For Windows:
```bash
# Run the batch file
start_app.bat
```

### Method 2: Manual Setup

#### Step 1: Install Backend Dependencies
```bash
# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
```

#### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

#### Step 3: Start the Backend
```bash
# From project root
uv run python main.py
```
✅ Backend running at: `http://localhost:8000`

#### Step 4: Start the Frontend (with Hot Reload)
```bash
# Open new terminal and navigate to frontend
cd frontend
npm run dev
```
✅ Frontend running at: `http://localhost:3000` with auto-reload enabled

## 🎯 Access Your Platform

1. **Open your browser** and go to: `http://localhost:3000`
2. **Create an account** by clicking "Sign Up"
3. **Log in** with your credentials
4. **Browse courses** and start learning!

## 🔧 Startup Scripts

### Linux/macOS Script (`start_app.sh`)
```bash
#!/bin/bash

echo "🚀 Starting Mini E-Learning Platform..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ uv is not installed. Please install it first."
    echo "Run: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Install backend dependencies if needed
if [ ! -d ".venv" ]; then
    echo "📦 Setting up Python virtual environment..."
    uv venv
fi

echo "📦 Installing backend dependencies..."
source .venv/bin/activate
uv pip install -r requirements.txt

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo "🔥 Starting backend server..."
# Start backend in background
uv run python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo "⚡ Starting frontend server..."
# Start frontend
cd frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Platform is starting up!"
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
```

### Windows Script (`start_app.bat`)
```batch
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

echo ⚡ Starting frontend server...
cd frontend
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo ✅ Platform is starting up!
echo 🔗 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:8000
echo.
echo Press any key to exit...
pause >nul
```

## 🛠 Development Commands

### Backend Commands
```bash
# Start development server
uv run python main.py

# Install new package
uv pip install package-name

# Run tests
uv run pytest

# Check Python version
uv run python --version
```

### Frontend Commands
```bash
cd frontend

# Start development server with hot reload (recommended)
npm run dev

# Alternative: Start standard development server
npm start

# Start with nodemon for enhanced file watching
npm run dev:nodemon

# Build for production
npm run build

# Run tests
npm test

# Install new package
npm install package-name
```

## 🔍 Troubleshooting

### Common Issues & Solutions

#### Backend won't start
- **Check MongoDB**: Ensure MongoDB is running
- **Check port**: Make sure port 8000 is not in use
- **Dependencies**: Run `uv pip install -r requirements.txt`

#### Frontend won't start
- **Check Node.js**: Ensure Node.js 16+ is installed
- **Clear cache**: Delete `node_modules` and run `npm install`
- **Check port**: Make sure port 3000 is not in use

#### Database connection errors
- **Local MongoDB**: Start with `mongod` or `brew services start mongodb`
- **Connection string**: Check `backend/config.py` for correct MongoDB URL

### Quick Fixes
```bash
# Reset backend environment
rm -rf .venv
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv pip install -r requirements.txt

# Reset frontend dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📊 Verify Installation

### Check if everything is working:

1. **Backend API Test**:
   ```bash
   curl http://localhost:8000/
   ```
   Should return: `{"message": "Mini E-Learning Platform API"}`

2. **Frontend Test**:
   - Open `http://localhost:3000` in browser
   - Should see the login/signup page

3. **Database Test**:
   - Try creating an account
   - Should successfully register and log in

## 🎉 You're Ready!

Your Mini E-Learning Platform is now running! 

### Next Steps:
1. **Create your first course** (if you're an admin)
2. **Register as a student** and explore courses
3. **Customize the platform** by modifying the code
4. **Deploy to production** when ready

### Useful URLs:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (FastAPI automatic docs)

## 💡 Tips for Development

- **Hot reload**: Both frontend and backend support hot reload during development
- **API Documentation**: Visit `http://localhost:8000/docs` for interactive API docs
- **Browser DevTools**: Use React DevTools for frontend debugging
- **Logs**: Check terminal output for error messages and logs

---

Happy learning! 🎓