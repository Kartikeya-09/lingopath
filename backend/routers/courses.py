from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.course import Course, Unit, Skill, Lesson
from backend.models.progress import UserLessonProgress
from backend.models.user import User
from backend.routers.users import get_current_user
from backend.schemas.course import CoursePathOut
from backend.services.progress_service import resolve_lesson_state

router = APIRouter()

@router.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@router.get("/courses/{course_id}/path", response_model=CoursePathOut)
def get_course_path(course_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    all_progress = db.query(UserLessonProgress).filter(UserLessonProgress.user_id == current_user.id).all()
    progress_map = {p.lesson_id: p for p in all_progress}
    
    course_dict = {
        "id": course.id,
        "title": course.title,
        "language_code": course.language_code,
        "flag_emoji": course.flag_emoji,
        "description": course.description,
        "total_learners": course.total_learners,
        "units": []
    }
    
    units = db.query(Unit).filter(Unit.course_id == course.id).order_by(Unit.order_index).all()
    for u in units:
        unit_dict = {
            "id": u.id,
            "title": u.title,
            "description": u.description,
            "order_index": u.order_index,
            "color_hex": u.color_hex,
            "skills": []
        }
        
        skills = db.query(Skill).filter(Skill.unit_id == u.id).order_by(Skill.order_index).all()
        for s in skills:
            skill_dict = {
                "id": s.id,
                "title": s.title,
                "description": s.description,
                "icon_emoji": s.icon_emoji,
                "order_index": s.order_index,
                "completed_lessons": 0,
                "total_lessons": 0,
                "lessons": []
            }
            
            lessons = db.query(Lesson).filter(Lesson.skill_id == s.id).order_by(Lesson.order_index).all()
            skill_dict["total_lessons"] = len(lessons)
            
            for l in lessons:
                is_first_lesson = (u.order_index == 1 and s.order_index == 1 and l.order_index == 1)
                prog = progress_map.get(l.id)
                state = resolve_lesson_state(l.id, is_first_lesson, prog)
                
                if state in ("completed", "legendary"):
                    skill_dict["completed_lessons"] += 1
                    
                lesson_dict = {
                    "id": l.id,
                    "title": l.title,
                    "order_index": l.order_index,
                    "xp_reward": l.xp_reward,
                    "state": state
                }
                skill_dict["lessons"].append(lesson_dict)
                
            unit_dict["skills"].append(skill_dict)
            
        course_dict["units"].append(unit_dict)
        
    return course_dict
