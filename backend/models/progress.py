from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, UniqueConstraint, Boolean, Date
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.database import Base
import enum

class LessonState(enum.Enum):
    locked = "locked"
    available = "available"
    in_progress = "in_progress"
    completed = "completed"
    legendary = "legendary"

class UserStats(Base):
    __tablename__ = "user_stats"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    total_xp = Column(Integer, default=0, nullable=False)
    current_streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    last_activity_date = Column(DateTime)
    hearts = Column(Integer, default=5, nullable=False)
    gems = Column(Integer, default=0, nullable=False)
    daily_xp = Column(Integer, default=0, nullable=False)
    daily_goal = Column(Integer, default=20, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    streak_freeze_active = Column(Boolean, default=False)
    user = relationship("User")

class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    state = Column(Enum(LessonState), default=LessonState.locked, nullable=False)
    stars = Column(Integer, default=0)
    attempts = Column(Integer, default=0)
    last_attempted_at = Column(DateTime)
    completed_at = Column(DateTime)
    
    __table_args__ = (
        UniqueConstraint('user_id', 'lesson_id', name='uq_user_lesson'),
    )

class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    completed_lessons = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    crown_level = Column(Integer, default=0)

class UserCourseProgress(Base):
    __tablename__ = "user_course_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)

class DailyActivity(Base):
    __tablename__ = "daily_activity"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    xp_earned = Column(Integer, default=0, nullable=False)
    
    __table_args__ = (
        UniqueConstraint('user_id', 'date', name='uq_user_date'),
    )

class XpTransaction(Base):
    __tablename__ = "xp_transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Quest(Base):
    __tablename__ = "quests"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    target_value = Column(Integer, nullable=False)
    xp_reward = Column(Integer, default=0)
    gem_reward = Column(Integer, default=0)

class UserQuestProgress(Base):
    __tablename__ = "user_quest_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quest_id = Column(Integer, ForeignKey("quests.id"), nullable=False)
    current_value = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    claimed = Column(Boolean, default=False)

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    icon_emoji = Column(String)
    threshold_value = Column(Integer, nullable=False)
    achievement_type = Column(String, nullable=False)

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked = Column(Boolean, default=False)
    unlocked_at = Column(DateTime)
