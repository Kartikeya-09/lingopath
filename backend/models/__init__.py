from backend.database import Base, engine
from backend.models.course import Course, Unit, Skill, Lesson, Exercise, ExerciseOption
from backend.models.user import User
from backend.models.progress import (
    UserStats,
    UserLessonProgress,
    UserSkillProgress,
    UserCourseProgress,
    DailyActivity,
    XpTransaction,
    Quest,
    UserQuestProgress,
    Achievement,
    UserAchievement,
    LessonState
)

# Create tables
Base.metadata.create_all(bind=engine)
