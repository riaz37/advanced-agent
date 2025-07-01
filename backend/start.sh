#!/bin/bash

# Start the FastAPI backend server
echo "Starting Developer Tools Research API..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found. Please copy .env.example to .env and configure your API keys."
    echo "cp .env.example .env"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting server on http://localhost:8000"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
