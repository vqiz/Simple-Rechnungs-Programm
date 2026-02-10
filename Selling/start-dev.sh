#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Stopping Rechnix Development Environment..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM EXIT

echo "Starting Rechnix Development Environment..."

# Start Backend
echo "Starting Java Backend..."
cd Backend
./gradlew bootRun &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to initialize (optional, but cleaner log output)
sleep 5

# Start Frontend
echo "Starting Website (Docusaurus)..."
cd website
npm run start &
FRONTEND_PID=$!
cd ..

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop."

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
