from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from backend.database import get_db
from backend.models.user import User
from backend.models.progress import UserStats, DailyActivity
from backend.schemas.user import UserOut, UserStatsOut
from sqlalchemy import func

router = APIRouter()

def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == "learner").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    
    today = datetime.now(timezone.utc).date()
    daily_activity = db.query(DailyActivity).filter(
        DailyActivity.user_id == current_user.id,
        DailyActivity.date == today
    ).first()
    
    daily_xp = daily_activity.xp_earned if daily_activity else 0
    if stats:
        stats.daily_xp = daily_xp
        
    user_dict = {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "avatar_url": current_user.avatar_url,
        "stats": stats
    }
    return user_dict

@router.get("/stats", response_model=UserStatsOut)
def get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    if not stats:
        raise HTTPException(status_code=404, detail="Stats not found")
        
    today = datetime.now(timezone.utc).date()
    daily_activity = db.query(DailyActivity).filter(
        DailyActivity.user_id == current_user.id,
        DailyActivity.date == today
    ).first()
    
    stats.daily_xp = daily_activity.xp_earned if daily_activity else 0
    return stats
