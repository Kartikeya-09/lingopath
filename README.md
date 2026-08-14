# Duolingo Clone

A full-stack Duolingo clone built with Next.js and FastAPI.

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment.
4. Install dependencies: `pip install -r requirements.txt`
5. Seed the database: `python seed.py`
6. Run the server: `uvicorn main:app --reload`

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Deployment

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Backend deployment on Render
- Frontend deployment on Vercel
- Environment configuration
- Troubleshooting guide
