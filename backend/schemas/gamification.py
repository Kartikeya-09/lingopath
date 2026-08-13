from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class QuestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    description: Optional[str] = None
    target_value: int
    xp_reward: int
    gem_reward: int
    current_value: int = 0
    completed: bool = False
    claimed: bool = False

class AchievementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    description: Optional[str] = None
    icon_emoji: Optional[str] = None
    threshold_value: int
    achievement_type: str
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None

class LeaderboardEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    rank: int
    username: str
    avatar_url: Optional[str] = None
    total_xp: int
    is_current_user: bool = False
