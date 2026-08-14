#!/bin/bash

set -e  # Exit on error

# Detect if running on Render
if [ -n "$RENDER" ] || [ -d "/opt/render/project" ]; then
    echo "Running in Render environment"
    
    # Navigate to the project root (parent of backend directory)
    cd /opt/render/project
    
    # Add project root to Python path for imports
    export PYTHONPATH=/opt/render/project:$PYTHONPATH
    
    # Use persistent disk if available, otherwise use local SQLite
    if [ -d "/opt/render/project/data" ]; then
        export DATABASE_URL="sqlite:////opt/render/project/data/duolingo.db"
        echo "Using persistent disk for database"
    else
        export DATABASE_URL="sqlite:///./backend/duolingo.db"
        echo "Using ephemeral storage for database (free tier)"
    fi
    
    # Run seed script from project root
    echo "Running database seed..."
    python backend/seed.py
    
    # Start the server from backend directory
    cd backend
    echo "Starting FastAPI server..."
    uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
else
    # Local development
    echo "Running in local development environment"
    
    # Run seed script
    echo "Running database seed..."
    python seed.py
    
    # Start the server
    echo "Starting FastAPI server..."
    uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
fi
