from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class LessonPathOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    order_index: int
    xp_reward: int
    state: str = "locked"

class SkillPathOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    description: Optional[str] = None
    icon_emoji: str
    order_index: int
    completed_lessons: int = 0
    total_lessons: int = 0
    lessons: List[LessonPathOut] = []

class UnitPathOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    description: Optional[str] = None
    order_index: int
    color_hex: str
    skills: List[SkillPathOut] = []

class CoursePathOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    language_code: str
    flag_emoji: str
    flag_image_url: Optional[str] = None
    description: Optional[str] = None
    total_learners: int
    units: List[UnitPathOut] = []
