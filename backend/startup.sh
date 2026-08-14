#!/bin/bash

set -e  # Exit on error

# Determine working directory and database path
if [ -d "/opt/render/project/backend" ]; then
    # Render deployment
    cd /opt/render/project/backend
    echo "Running in Render environment"
    
    # Use persistent disk if available, otherwise use local SQLite
    if [ -d "/opt/render/project/data" ]; then
        export DATABASE_URL="sqlite:////opt/render/project/data/duolingo.db"
        echo "Using persistent disk for database"
    else
        export DATABASE_URL="sqlite:///./duolingo.db"
        echo "Using ephemeral storage for database (free tier)"
    fi
else
    # Local development
    echo "Running in local development environment"
fi

# Run seed script (it handles idempotency internally)
echo "Running database seed..."
python seed.py

# Start the server
echo "Starting FastAPI server..."
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
