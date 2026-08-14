#!/bin/bash

set -e

echo "Starting LingoPath backend..."
echo "Current directory: $(pwd)"

# Make current backend directory available for Python imports
export PYTHONPATH="$(pwd):${PYTHONPATH}"

# Use environment DATABASE_URL if provided.
# Otherwise use local SQLite in the backend directory.
export DATABASE_URL="${DATABASE_URL:-sqlite:///./duolingo.db}"

echo "Database URL configured."

echo "Running database seed..."
python seed.py

echo "Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"