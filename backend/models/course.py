from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.database import Base
import enum

class ExerciseType(enum.Enum):
    multiple_choice = "multiple_choice"
    word_bank = "word_bank"
    match_pairs = "match_pairs"
    fill_blank = "fill_blank"
    type_answer = "type_answer"

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    language_code = Column(String, nullable=False)
    flag_emoji = Column(String, nullable=False)
    description = Column(String)
    total_learners = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan")

class Unit(Base):
    __tablename__ = "units"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    order_index = Column(Integer, nullable=False)
    color_hex = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    icon_emoji = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    xp_reward = Column(Integer, default=10, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")

class Exercise(Base):
    __tablename__ = "exercises"
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    type = Column(Enum(ExerciseType), nullable=False)
    prompt = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False)
    explanation = Column(String)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    lesson = relationship("Lesson", back_populates="exercises")
    exercise_options = relationship("ExerciseOption", back_populates="exercise", cascade="all, delete-orphan")

class ExerciseOption(Base):
    __tablename__ = "exercise_options"
    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    text = Column(String, nullable=False)
    is_correct = Column(Integer, default=0, nullable=False)
    order_index = Column(Integer, nullable=False)
    exercise = relationship("Exercise", back_populates="exercise_options")
