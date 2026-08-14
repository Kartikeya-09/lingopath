from datetime import datetime, timezone

from backend.database import SessionLocal, engine, Base
from backend.models.course import (
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    ExerciseOption,
    ExerciseType,
)
from backend.models.user import User
from backend.models.progress import (
    UserStats,
    UserLessonProgress,
    LessonState,
    Quest,
    Achievement,
)


def get_or_create_user(db, username: str, email: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            username=username,
            email=email,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


def seed_course_content(db):
    course = (
        db.query(Course)
        .filter(Course.language_code == "es")
        .first()
    )

    if course:
        print("Spanish course already exists.")
        return course

    print("Seeding Spanish course...")

    course = Course(
        title="Spanish",
        language_code="es",
        flag_emoji="🇪🇸",
        flag_image_url="https://flagcdn.com/w320/es.png",
        description="Learn Spanish through short interactive lessons.",
    )

    db.add(course)
    db.commit()
    db.refresh(course)

    course_data = [
        {
            "title": "Basics",
            "description": "Learn basic words and greetings.",
            "color": "#FF4B4B",
            "skills": [
                "Greetings",
                "Introductions",
                "Common Words",
            ],
        },
        {
            "title": "Food",
            "description": "Learn vocabulary for food and drinks.",
            "color": "#564363",
            "skills": [
                "Food Basics",
                "Drinks",
                "Restaurant",
            ],
        },
        {
            "title": "Travel",
            "description": "Learn useful travel expressions.",
            "color": "#2B70C9",
            "skills": [
                "Directions",
                "Transport",
                "Hotel",
            ],
        },
    ]

    for unit_index, unit_data in enumerate(course_data, start=1):

        unit = Unit(
            course_id=course.id,
            title=unit_data["title"],
            description=unit_data["description"],
            order_index=unit_index,
            color_hex=unit_data["color"],
        )

        db.add(unit)
        db.commit()
        db.refresh(unit)

        for skill_index, skill_title in enumerate(
            unit_data["skills"],
            start=1,
        ):

            skill = Skill(
                unit_id=unit.id,
                title=skill_title,
                description=f"Practice {skill_title.lower()}.",
                icon_emoji="⭐",
                order_index=skill_index,
            )

            db.add(skill)
            db.commit()
            db.refresh(skill)

            # Fixed structure:
            # 3 lessons per skill
            for lesson_index in range(1, 4):

                lesson = Lesson(
                    skill_id=skill.id,
                    title=f"Lesson {lesson_index}",
                    order_index=lesson_index,
                    xp_reward=10,
                )

                db.add(lesson)
                db.commit()
                db.refresh(lesson)

                seed_lesson_exercises(db, lesson)

    print("Course content seeded successfully.")
    return course


def seed_lesson_exercises(db, lesson):
    exercises = [
        {
            "type": ExerciseType.multiple_choice,
            "prompt": 'What does "hola" mean?',
            "correct_answer": "Hello",
            "options": [
                ("Hello", True),
                ("Goodbye", False),
                ("Please", False),
                ("Thanks", False),
            ],
        },
        {
            "type": ExerciseType.word_bank,
            "prompt": 'Translate: "Good morning"',
            "correct_answer": "Buenos días",
            "options": [
                ("Buenos", True),
                ("días", True),
                ("Buenas", False),
                ("noches", False),
            ],
        },
        {
            "type": ExerciseType.match_pairs,
            "prompt": "Tap the matching pairs",
            "correct_answer": "",
            "pairs": [
                ("hello", "hola"),
                ("goodbye", "adiós"),
                ("thank you", "gracias"),
                ("good morning", "buenos días"),
            ],
        },
        {
            "type": ExerciseType.fill_blank,
            "prompt": "Complete the sentence: Yo ___ estudiante.",
            "correct_answer": "soy",
            "options": [
                ("soy", True),
                ("eres", False),
                ("somos", False),
                ("son", False),
            ],
        },
        {
            "type": ExerciseType.type_answer,
            "prompt": 'Type the Spanish word for "hello".',
            "correct_answer": "hola",
            "options": [
                ("hola", True),
            ],
        },
    ]

    for index, data in enumerate(exercises, start=1):

        exercise = Exercise(
            lesson_id=lesson.id,
            type=data["type"],
            prompt=data["prompt"],
            correct_answer=data["correct_answer"],
            explanation="Review the correct answer and continue.",
            order_index=index,
        )

        db.add(exercise)
        db.commit()
        db.refresh(exercise)

        if data["type"] == ExerciseType.match_pairs:
            add_match_pair_options(
                db,
                exercise.id,
                data["pairs"],
            )
        else:
            for option_index, (text, is_correct) in enumerate(
                data.get("options", []),
                start=1,
            ):

                option = ExerciseOption(
                    exercise_id=exercise.id,
                    text=text,
                    is_correct=is_correct,
                    order_index=option_index,
                )

                db.add(option)

        db.commit()


def add_match_pair_options(db, exercise_id, pairs):
    """
    Stores every side of every pair.

    NOTE:
    This assumes MatchPairsExercise can reconstruct pairs
    from option ordering.

    Stored as:
    1 hello
    2 hola
    3 goodbye
    4 adiós
    ...

    If your frontend/API expects pair_id or metadata_json,
    adapt this method to that existing contract.
    """

    order_index = 1

    for left, right in pairs:

        db.add(
            ExerciseOption(
                exercise_id=exercise_id,
                text=left,
                is_correct=False,
                order_index=order_index,
            )
        )
        order_index += 1

        db.add(
            ExerciseOption(
                exercise_id=exercise_id,
                text=right,
                is_correct=False,
                order_index=order_index,
            )
        )
        order_index += 1

    db.commit()


def seed_learner(db):
    learner = get_or_create_user(
        db,
        username="learner",
        email="learner@example.com",
    )
    print(f"✓ Learner user created: {learner.username} (ID: {learner.id})")

    stats = (
        db.query(UserStats)
        .filter(UserStats.user_id == learner.id)
        .first()
    )

    if not stats:
        stats = UserStats(
            user_id=learner.id,
            total_xp=250,
            current_streak=5,
            longest_streak=10,
            last_activity_date=datetime.now(timezone.utc),
            hearts=5,
            gems=100,
            daily_xp=30,
        )

        db.add(stats)
        db.commit()
        print(f"✓ Learner stats created")

    return learner


def seed_demo_progress(db, learner):
    """
    Demo state:
    - First 5 lessons completed
    - 6th lesson available
    - Everything else remains locked by progression logic
    """

    ordered_lessons = (
        db.query(Lesson)
        .join(Skill, Lesson.skill_id == Skill.id)
        .join(Unit, Skill.unit_id == Unit.id)
        .join(Course, Unit.course_id == Course.id)
        .filter(Course.language_code == "es")
        .order_by(
            Unit.order_index,
            Skill.order_index,
            Lesson.order_index,
        )
        .all()
    )

    if not ordered_lessons:
        raise RuntimeError(
            "No lessons found while creating demo learner progress."
        )

    demo_states = []

    # Mark first 5 lessons as completed
    for i in range(min(5, len(ordered_lessons))):
        demo_states.append(
            (
                ordered_lessons[i],
                LessonState.completed,
            )
        )

    # Mark 6th lesson as available (or more if fewer than 6 total)
    if len(ordered_lessons) > 5:
        demo_states.append(
            (
                ordered_lessons[5],
                LessonState.available,
            )
        )
    elif len(ordered_lessons) == 5:
        demo_states[-1] = (
            ordered_lessons[-1],
            LessonState.available,
        )

    for lesson, state in demo_states:

        progress = (
            db.query(UserLessonProgress)
            .filter(
                UserLessonProgress.user_id == learner.id,
                UserLessonProgress.lesson_id == lesson.id,
            )
            .first()
        )

        if not progress:
            progress = UserLessonProgress(
                user_id=learner.id,
                lesson_id=lesson.id,
                state=state,
            )
            db.add(progress)

        else:
            progress.state = state

    db.commit()

    print(f"✓ Demo progress created: {len(demo_states)} lessons with states")
    for lesson, state in demo_states:
        print(f"  - Lesson {lesson.id}: {state.value}")


def seed_leaderboard_users(db):
    leaderboard_data = [
        ("sofia", 1820),
        ("alex", 1580),
        ("mia", 1430),
        ("leo", 1260),
        ("emma", 980),
        ("noah", 850),
        ("lucas", 730),
        ("olivia", 620),
        ("daniel", 540),
        ("ava", 410),
    ]

    for index, (username, xp) in enumerate(
        leaderboard_data,
        start=1,
    ):
        email = f"{username}@example.com"

        user = get_or_create_user(
            db,
            username=username,
            email=email,
        )

        stats = (
            db.query(UserStats)
            .filter(UserStats.user_id == user.id)
            .first()
        )

        if not stats:
            db.add(
                UserStats(
                    user_id=user.id,
                    total_xp=xp,
                    hearts=5,
                    gems=0,
                    current_streak=index % 7,
                )
            )

    db.commit()


def seed_quests(db):
    quests = [
        (
            "Earn 50 XP",
            50,
            10,
            5,
        ),
        (
            "Complete 3 lessons",
            3,
            15,
            10,
        ),
        (
            "Get 5 perfect lessons",
            5,
            20,
            15,
        ),
    ]

    for title, target, xp_reward, gem_reward in quests:

        existing = (
            db.query(Quest)
            .filter(Quest.title == title)
            .first()
        )

        if not existing:
            db.add(
                Quest(
                    title=title,
                    target_value=target,
                    xp_reward=xp_reward,
                    gem_reward=gem_reward,
                )
            )

    db.commit()


def seed_achievements(db):
    achievements = [
        (
            "Wildfire",
            "Reach a 3 day streak",
            "🔥",
            3,
            "streak",
        ),
        (
            "Sage",
            "Earn 100 XP",
            "🦉",
            100,
            "xp",
        ),
        (
            "Scholar",
            "Complete 10 lessons",
            "📚",
            10,
            "lessons",
        ),
        (
            "Champion",
            "Reach #1 on leaderboard",
            "🏆",
            1,
            "leaderboard",
        ),
        (
            "Sharpshooter",
            "Complete a lesson with no mistakes",
            "🎯",
            1,
            "perfect_lessons",
        ),
    ]

    for (
        title,
        description,
        icon,
        threshold,
        achievement_type,
    ) in achievements:

        existing = (
            db.query(Achievement)
            .filter(Achievement.title == title)
            .first()
        )

        if not existing:
            db.add(
                Achievement(
                    title=title,
                    description=description,
                    icon_emoji=icon,
                    threshold_value=threshold,
                    achievement_type=achievement_type,
                )
            )

    db.commit()


def validate_seed(db, learner):
    lesson_count = db.query(Lesson).count()

    progress_rows = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == learner.id)
        .all()
    )

    completed = sum(
        1
        for row in progress_rows
        if row.state == LessonState.completed
    )

    available = sum(
        1
        for row in progress_rows
        if row.state == LessonState.available
    )

    print("")
    print("Seed validation:")
    print(f"  Lessons: {lesson_count}")
    print(f"  Progress rows: {len(progress_rows)}")
    print(f"  Completed: {completed}")
    print(f"  Available: {available}")

    if lesson_count == 0:
        raise RuntimeError(
            "Seed validation failed: no lessons exist."
        )

    if available == 0:
        raise RuntimeError(
            "Seed validation failed: learner has no available lesson."
        )


def seed_database():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        seed_course_content(db)

        learner = seed_learner(db)

        seed_demo_progress(
            db,
            learner,
        )

        seed_leaderboard_users(db)

        seed_quests(db)

        seed_achievements(db)

        validate_seed(
            db,
            learner,
        )

        print("")
        print("✅ Database seeding completed successfully.")

    except Exception as exc:
        db.rollback()

        print("")
        print(f"❌ Error seeding database: {exc}")

        import traceback

        traceback.print_exc()

        # IMPORTANT:
        # Make Render startup fail instead of starting
        # with a partially seeded database.
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()