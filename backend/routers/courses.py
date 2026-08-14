from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.models.course import Course, Unit, Skill, Lesson
from backend.schemas.course import CoursePathOut

router = APIRouter()

@router.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@router.get("/courses/{course_id}/path", response_model=CoursePathOut)
def get_course_path(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    # Return basic course info without user progress for public access
    course_dict = {
        "id": course.id,
        "title": course.title,
        "language_code": course.language_code,
        "flag_emoji": course.flag_emoji,
        "flag_image_url": course.flag_image_url,
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
                lesson_dict = {
                    "id": l.id,
                    "title": l.title,
                    "order_index": l.order_index,
                    "xp_reward": l.xp_reward,
                    "state": "locked"  # Default to locked for public access
                }
                skill_dict["lessons"].append(lesson_dict)
                
            unit_dict["skills"].append(skill_dict)
            
        course_dict["units"].append(unit_dict)
        
    return course_dict
