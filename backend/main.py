import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.routers import users, courses, lessons, leaderboard, hearts, quests, achievements

app = FastAPI(title="Duolingo Clone API")

# Configure CORS based on environment
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",  # Alternative local port
    frontend_url
]

# Remove duplicates while preserving order
seen = set()
allowed_origins = [x for x in allowed_origins if not (x in seen or seen.add(x))]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

@app.get("/health")
async def health():
    return {"status": "ok"}

app.include_router(users.router, prefix="/api")
app.include_router(courses.router, prefix="/api")
app.include_router(lessons.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")
app.include_router(hearts.router, prefix="/api")
app.include_router(quests.router, prefix="/api")
app.include_router(achievements.router, prefix="/api")
