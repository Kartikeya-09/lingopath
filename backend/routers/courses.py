from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.models.course import Course, Unit, Skill, Lesson
from backend.models.progress import UserLessonProgress, LessonState
from backend.models.user import User
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

    # Get the learner user (hardcoded for demo)
    learner = db.query(User).filter(User.username == "learner").first()
    if not learner:
        # If no learner exists, return path without progress (all locked)
        return get_course_path_without_progress(course, db)

    # Get user's lesson progress
    user_progress = db.query(UserLessonProgress).filter(
        UserLessonProgress.user_id == learner.id
    ).all()
    progress_map = {p.lesson_id: p.state for p in user_progress}

    # Find the very first lesson in the entire course
    first_unit = db.query(Unit).filter(Unit.course_id == course.id).order_by(Unit.order_index).first()
    first_skill = None
    first_lesson = None
    if first_unit:
        first_skill = db.query(Skill).filter(Skill.unit_id == first_unit.id).order_by(Skill.order_index).first()
    if first_skill:
        first_lesson = db.query(Lesson).filter(Lesson.skill_id == first_skill.id).order_by(Lesson.order_index).first()

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

            # Track completed lessons for skill
            skill_completed_count = 0

            for idx, l in enumerate(lessons):
                lesson_state = progress_map.get(l.id)

                # Determine lesson state based on progress and prerequisites
                if lesson_state:
                    state = lesson_state.value
                    if state == "completed":
                        skill_completed_count += 1
                else:
                    # No progress record - check unlock conditions
                    # Only the very first lesson in the entire course is available
                    if first_lesson and l.id == first_lesson.id:
                        state = "available"
                    # Otherwise, check if previous lesson in same skill is completed
                    elif idx > 0:
                        prev_lesson = lessons[idx - 1]
                        prev_state = progress_map.get(prev_lesson.id)
                        if prev_state and prev_state == LessonState.completed:
                            state = "available"
                        else:
                            state = "locked"
                    else:
                        state = "locked"

                lesson_dict = {
                    "id": l.id,
                    "title": l.title,
                    "order_index": l.order_index,
                    "xp_reward": l.xp_reward,
                    "state": state
                }
                skill_dict["lessons"].append(lesson_dict)

            skill_dict["completed_lessons"] = skill_completed_count
            unit_dict["skills"].append(skill_dict)

        course_dict["units"].append(unit_dict)

    return course_dict

def get_course_path_without_progress(course: Course, db: Session):
    """Fallback when no learner user exists - return all lessons as locked"""
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
                    "state": "locked"
                }
                skill_dict["lessons"].append(lesson_dict)

            unit_dict["skills"].append(skill_dict)

        course_dict["units"].append(unit_dict)

    return course_dict
