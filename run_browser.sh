#!/bin/bash

echo "====================================="
echo "Starting AI Powered Browser"
echo "====================================="

# Activate virtual environment (optional)
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Start AI Engine
echo "Starting AI Engine..."
cd ai-engine

uvicorn app:app --reload &

AI_PID=$!

cd ..

# Wait for AI engine to start
sleep 3

# Start Electron Browser
echo "Launching Electron Browser..."

npm start

# When browser closes, stop AI engine
echo "Stopping AI Engine..."
kill $AI_PID

echo "AI Browser Closed"