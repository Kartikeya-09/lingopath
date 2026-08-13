from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.user import User
from backend.models.progress import Achievement, UserAchievement
from backend.routers.users import get_current_user
from backend.schemas.gamification import AchievementOut

router = APIRouter()

@router.get("/achievements", response_model=List[AchievementOut])
def get_achievements(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    achievements = db.query(Achievement).all()
    user_achievements = db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()
    ach_map = {a.achievement_id: a for a in user_achievements}
    
    result = []
    for ach in achievements:
        ua = ach_map.get(ach.id)
        result.append({
            "id": ach.id,
            "title": ach.title,
            "description": ach.description,
            "icon_emoji": ach.icon_emoji,
            "threshold_value": ach.threshold_value,
            "achievement_type": ach.achievement_type,
            "unlocked": ua.unlocked if ua else False,
            "unlocked_at": ua.unlocked_at if ua else None
        })
    return result
