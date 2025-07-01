#!/bin/bash

# Start the React frontend development server
echo "Starting Developer Tools Research Frontend..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting development server on http://localhost:5173"
npm run dev
