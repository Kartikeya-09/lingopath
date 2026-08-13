from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class ExerciseOptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    text: str
    order_index: int

class ExerciseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    type: str
    prompt: str
    order_index: int
    exercise_options: List[ExerciseOptionOut] = []

class LessonDetailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    xp_reward: int
    exercises: List[ExerciseOut] = []

class AnswerResponseOut(BaseModel):
    correct: bool
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    hearts_remaining: Optional[int] = None
    out_of_hearts: Optional[bool] = None

class CompleteResponseOut(BaseModel):
    xp_earned: int
    total_xp: int
    streak: int
    perfect: bool
    lesson_completed: bool
