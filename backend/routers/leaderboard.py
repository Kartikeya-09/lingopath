from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.user import User
from backend.models.progress import UserStats
from backend.routers.users import get_current_user
from backend.schemas.gamification import LeaderboardEntryOut

router = APIRouter()

@router.get("/leaderboard", response_model=List[LeaderboardEntryOut])
def get_leaderboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    users_with_stats = db.query(User, UserStats).join(UserStats, User.id == UserStats.user_id).order_by(UserStats.total_xp.desc()).limit(50).all()
    
    leaderboard = []
    for rank, (u, stats) in enumerate(users_with_stats, start=1):
        leaderboard.append({
            "rank": rank,
            "username": u.username,
            "avatar_url": u.avatar_url,
            "total_xp": stats.total_xp,
            "is_current_user": (u.id == current_user.id)
        })
        
    return leaderboard
