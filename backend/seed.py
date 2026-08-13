import random
from datetime import datetime, timedelta, timezone
from backend.database import SessionLocal, engine, Base
from backend.models.course import Course, Unit, Skill, Lesson, Exercise, ExerciseOption, ExerciseType
from backend.models.user import User
from backend.models.progress import (
    UserStats, UserLessonProgress, LessonState, DailyActivity, 
    Quest, Achievement
)

def seed_database():
    print("Dropping and recreating tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("Seeding Spanish Course...")
        course = Course(
            title="Spanish",
            language_code="es",
            flag_emoji="🇪🇸",
            description="Learn Spanish, the language of Spain and Latin America."
        )
        db.add(course)
        db.commit()
        db.refresh(course)
        
        # 3 Units
        unit_colors = ["#FF4B4B", "#CE82FF", "#2B70C9"]
        unit_titles = ["Basics", "Food", "Travel"]
        for i in range(3):
            unit = Unit(
                course_id=course.id,
                title=unit_titles[i],
                description=f"Learn about {unit_titles[i].lower()}.",
                order_index=i + 1,
                color_hex=unit_colors[i]
            )
            db.add(unit)
            db.commit()
            db.refresh(unit)
            
            # 3-5 Skills per Unit
            for j in range(random.randint(3, 5)):
                skill = Skill(
                    unit_id=unit.id,
                    title=f"Skill {j+1} of {unit_titles[i]}",
                    description="A skill description.",
                    icon_emoji="⭐",
                    order_index=j + 1
                )
                db.add(skill)
                db.commit()
                db.refresh(skill)
                
                # 2-4 Lessons per Skill
                for k in range(random.randint(2, 4)):
                    lesson = Lesson(
                        skill_id=skill.id,
                        title=f"Lesson {k+1}",
                        order_index=k + 1,
                        xp_reward=10
                    )
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)
                    
                    # 5-10 Exercises per Lesson (all types represented)
                    types = list(ExerciseType)
                    for m in range(random.randint(5, 10)):
                        ex_type = types[m % len(types)]
                        exercise = Exercise(
                            lesson_id=lesson.id,
                            type=ex_type,
                            prompt=f"Exercise prompt for {ex_type.value}",
                            correct_answer="correct",
                            explanation="Explanation text",
                            order_index=m + 1
                        )
                        db.add(exercise)
                        db.commit()
                        db.refresh(exercise)
                        
                        if ex_type in (ExerciseType.multiple_choice, ExerciseType.word_bank):
                            for n in range(4):
                                is_correct = 1 if n == 0 else 0
                                option = ExerciseOption(
                                    exercise_id=exercise.id,
                                    text="correct" if is_correct else f"wrong {n}",
                                    is_correct=is_correct,
                                    order_index=n + 1
                                )
                                db.add(option)
                    db.commit()
        
        print("Seeding Users...")
        learner = User(username="learner", email="learner@example.com")
        db.add(learner)
        db.commit()
        db.refresh(learner)
        
        learner_stats = UserStats(
            user_id=learner.id,
            total_xp=250,
            current_streak=5,
            longest_streak=10,
            last_activity_date=datetime.now(timezone.utc),
            hearts=5,
            gems=100,
            daily_xp=30
        )
        db.add(learner_stats)
        
        # Leaderboard users
        for i in range(10):
            lb_user = User(username=f"user_{i}", email=f"user{i}@example.com")
            db.add(lb_user)
            db.commit()
            db.refresh(lb_user)
            db.add(UserStats(
                user_id=lb_user.id,
                total_xp=random.randint(50, 2000),
                hearts=5,
                gems=0
            ))
        db.commit()
        
        # User Lesson Progress for learner
        # First skill lessons completed, second skill first lesson available
        first_skill = db.query(Skill).first()
        first_skill_lessons = db.query(Lesson).filter(Lesson.skill_id == first_skill.id).all()
        for les in first_skill_lessons:
            db.add(UserLessonProgress(user_id=learner.id, lesson_id=les.id, state=LessonState.completed))
            
        second_skill = db.query(Skill).filter(Skill.id != first_skill.id).first()
        if second_skill:
            second_skill_first_lesson = db.query(Lesson).filter(Lesson.skill_id == second_skill.id).first()
            if second_skill_first_lesson:
                db.add(UserLessonProgress(user_id=learner.id, lesson_id=second_skill_first_lesson.id, state=LessonState.available))
        db.commit()
        
        print("Seeding Quests & Achievements...")
        quests = [
            Quest(title="Earn 50 XP", target_value=50, xp_reward=10, gem_reward=5),
            Quest(title="Complete 3 lessons", target_value=3, xp_reward=15, gem_reward=10),
            Quest(title="Get 5 perfect lessons", target_value=5, xp_reward=20, gem_reward=15)
        ]
        db.add_all(quests)
        
        achievements = [
            Achievement(title="Wildfire", description="Reach a 3 day streak", icon_emoji="🔥", threshold_value=3, achievement_type="streak"),
            Achievement(title="Sage", description="Earn 100 XP", icon_emoji="🦉", threshold_value=100, achievement_type="xp"),
            Achievement(title="Scholar", description="Complete 10 lessons", icon_emoji="📚", threshold_value=10, achievement_type="lessons"),
            Achievement(title="Champion", description="Reach #1 on leaderboard", icon_emoji="🏆", threshold_value=1, achievement_type="leaderboard"),
            Achievement(title="Sharpshooter", description="Complete a lesson with no mistakes", icon_emoji="🎯", threshold_value=1, achievement_type="perfect_lessons")
        ]
        db.add_all(achievements)
        db.commit()
        
        print("Database seeding completed.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
