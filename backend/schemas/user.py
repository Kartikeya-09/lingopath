from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserStatsOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    total_xp: int
    current_streak: int
    longest_streak: int
    hearts: int
    gems: int
    daily_xp: int
    daily_goal: int
    last_activity_date: Optional[datetime] = None
    streak_freeze_active: bool

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    username: str
    email: str
    avatar_url: Optional[str] = None
    stats: Optional[UserStatsOut] = None
