from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from backend.database import get_db
from backend.models.course import Lesson, Skill, Exercise, ExerciseOption
from backend.models.progress import UserLessonProgress, LessonState, UserStats, DailyActivity, XpTransaction
from backend.models.user import User
from backend.routers.users import get_current_user
from backend.schemas.lesson import LessonDetailOut, AnswerResponseOut, CompleteResponseOut
from backend.services.heart_service import decrement_hearts
from backend.services.xp_service import calculate_xp_award
from backend.services.streak_service import calculate_streak
from backend.services.progress_service import unlock_next_lesson
from backend.services.quest_service import increment_quest_progress
from pydantic import BaseModel

router = APIRouter()

class AnswerRequest(BaseModel):
    exercise_id: int
    answer: str

class CompleteRequest(BaseModel):
    errors: int
    time_seconds: int

@router.get("/lessons/{lesson_id}", response_model=LessonDetailOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
        
    lesson_dict = {
        "id": lesson.id,
        "title": lesson.title,
        "xp_reward": lesson.xp_reward,
        "exercises": []
    }
    
    exercises = db.query(Exercise).filter(Exercise.lesson_id == lesson.id).order_by(Exercise.order_index).all()
    for ex in exercises:
        ex_dict = {
            "id": ex.id,
            "type": ex.type.value,
            "prompt": ex.prompt,
            "order_index": ex.order_index,
            "exercise_options": []
        }
        options = db.query(ExerciseOption).filter(ExerciseOption.exercise_id == ex.id).order_by(ExerciseOption.order_index).all()
        for opt in options:
            ex_dict["exercise_options"].append({
                "id": opt.id,
                "text": opt.text,
                "order_index": opt.order_index
            })
        lesson_dict["exercises"].append(ex_dict)
        
    return lesson_dict

@router.post("/lessons/{lesson_id}/start")
def start_lesson(lesson_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
        
    prog = db.query(UserLessonProgress).filter_by(user_id=current_user.id, lesson_id=lesson_id).first()
    if not prog:
        prog = UserLessonProgress(user_id=current_user.id, lesson_id=lesson_id, state=LessonState.in_progress)
        db.add(prog)
    elif prog.state not in (LessonState.completed, LessonState.legendary):
        prog.state = LessonState.in_progress
        
    db.commit()
    return {"lesson_id": lesson_id, "state": prog.state.value}

@router.post("/lessons/{lesson_id}/answer", response_model=AnswerResponseOut)
def answer_exercise(lesson_id: int, req: AnswerRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ex = db.query(Exercise).filter(Exercise.id == req.exercise_id, Exercise.lesson_id == lesson_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exercise not found")
        
    correct = (ex.correct_answer.lower() == req.answer.lower())
    
    if correct:
        return {"correct": True, "correct_answer": ex.correct_answer, "explanation": ex.explanation}
        
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    if not stats:
        raise HTTPException(status_code=404, detail="Stats not found")
        
    if stats.hearts <= 0:
        return {"correct": False, "hearts_remaining": 0, "out_of_hearts": True}
        
    stats.hearts = decrement_hearts(stats.hearts)
    db.commit()
    
    return {"correct": False, "correct_answer": ex.correct_answer, "explanation": ex.explanation, "hearts_remaining": stats.hearts}

@router.post("/lessons/{lesson_id}/complete", response_model=CompleteResponseOut)
def complete_lesson(lesson_id: int, req: CompleteRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
        
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    
    prog = db.query(UserLessonProgress).filter_by(user_id=current_user.id, lesson_id=lesson_id).first()
    if not prog:
        prog = UserLessonProgress(user_id=current_user.id, lesson_id=lesson_id)
        db.add(prog)
    prog.state = LessonState.completed
    prog.completed_at = datetime.now(timezone.utc)
    
    xp_earned, perfect = calculate_xp_award(lesson.xp_reward, req.errors)
    stats.total_xp += xp_earned
    
    today = datetime.now(timezone.utc).date()
    daily = db.query(DailyActivity).filter_by(user_id=current_user.id, date=today).first()
    if not daily:
        daily = DailyActivity(user_id=current_user.id, date=today, xp_earned=0)
        db.add(daily)
    daily.xp_earned += xp_earned
    
    stats.daily_xp = daily.xp_earned
    
    tx = XpTransaction(user_id=current_user.id, amount=xp_earned, reason="lesson_complete")
    db.add(tx)
    
    new_streak, updated = calculate_streak(
        stats.last_activity_date.date() if stats.last_activity_date else None, 
        stats.current_streak, 
        today
    )
    if updated:
        stats.current_streak = new_streak
        stats.longest_streak = max(stats.longest_streak, new_streak)
        
    stats.last_activity_date = datetime.now(timezone.utc)
    
    unlock_next_lesson(db, current_user.id, lesson)
    increment_quest_progress(db, current_user.id)
    
    db.commit()
    
    return {
        "xp_earned": xp_earned,
        "total_xp": stats.total_xp,
        "streak": stats.current_streak,
        "perfect": perfect,
        "lesson_completed": True
    }
