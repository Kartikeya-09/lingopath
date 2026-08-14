#!/bin/bash

set -e

echo "Starting LingoPath backend..."
echo "Current directory: $(pwd)"

# Add parent directory to PYTHONPATH for Render
# This allows 'backend.' imports to work when running from backend/ directory
if [ -d "/opt/render/project" ]; then
    # Render: running from /opt/render/project/src/backend or /opt/render/project/backend
    # Add project root to PYTHONPATH so 'backend.' imports work
    if [ -d "/opt/render/project/src" ]; then
        export PYTHONPATH="/opt/render/project/src:${PYTHONPATH}"
    else
        export PYTHONPATH="/opt/render/project:${PYTHONPATH}"
    fi
    echo "PYTHONPATH set for Render: $PYTHONPATH"
fi

export DATABASE_URL="${DATABASE_URL:-sqlite:///./duolingo.db}"

echo "Running database seed..."
python seed.py

echo "Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"