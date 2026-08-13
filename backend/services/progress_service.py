from sqlalchemy.orm import Session
from backend.models.course import Lesson, Skill, Unit
from backend.models.progress import UserLessonProgress, LessonState

def resolve_lesson_state(lesson_id: int, is_first_lesson: bool, progress_record: UserLessonProgress | None) -> str:
    if progress_record:
        return progress_record.state.value
    return LessonState.available.value if is_first_lesson else LessonState.locked.value

def unlock_next_lesson(db: Session, user_id: int, completed_lesson: Lesson):
    # Find next lesson in the same skill
    next_lesson = db.query(Lesson).filter(
        Lesson.skill_id == completed_lesson.skill_id,
        Lesson.order_index == completed_lesson.order_index + 1
    ).first()
    
    if not next_lesson:
        # Find next skill in the same unit
        current_skill = completed_lesson.skill
        next_skill = db.query(Skill).filter(
            Skill.unit_id == current_skill.unit_id,
            Skill.order_index == current_skill.order_index + 1
        ).first()
        
        if not next_skill:
            # Find next unit in the same course
            current_unit = current_skill.unit
            next_unit = db.query(Unit).filter(
                Unit.course_id == current_unit.course_id,
                Unit.order_index == current_unit.order_index + 1
            ).first()
            
            if next_unit:
                next_skill = db.query(Skill).filter(
                    Skill.unit_id == next_unit.id,
                    Skill.order_index == 1
                ).first()
                
        if next_skill:
            next_lesson = db.query(Lesson).filter(
                Lesson.skill_id == next_skill.id,
                Lesson.order_index == 1
            ).first()
            
    if next_lesson:
        prog = db.query(UserLessonProgress).filter_by(user_id=user_id, lesson_id=next_lesson.id).first()
        if not prog:
            prog = UserLessonProgress(user_id=user_id, lesson_id=next_lesson.id, state=LessonState.available)
            db.add(prog)
        elif prog.state == LessonState.locked:
            prog.state = LessonState.available
        db.commit()
