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

echo "⚡ Starting frontend server with hot reload..."
# Start frontend with nodemon for better hot reloading
cd frontend
npm run dev &
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