# Duolingo Clone

A full-stack Duolingo clone built with Next.js, React, TypeScript, FastAPI, and SQLite. Features gamified language learning with XP, streaks, hearts, quests, achievements, and leaderboards.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Architecture Overview](#architecture-overview)
- [Database Schema](#database-schema)
- [API Overview](#api-overview)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Setup Instructions

### Prerequisites

- **Python**: 3.11 or higher
- **Node.js**: 18 or higher
- **npm** or **yarn**

### Backend Setup

1. Navigate to the project root:
```bash
cd C:\Users\Dharmpal\Desktop\duolingo-clone
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Navigate to the backend directory:
```bash
cd backend
```

5. Install dependencies:
```bash
pip install -r requirements.txt
```

6. Seed the database:
```bash
# From project root
py -3.11 -m backend.seed
```

This creates the SQLite database with sample course data, users, lessons, exercises, quests, and achievements.

7. Start the backend server:
```bash
# From project root
py -3.11 -m uvicorn backend.main:app --reload
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## Architecture Overview

### Project Structure

```
duolingo-clone/
├── backend/                 # FastAPI backend
│   ├── main.py             # Application entry point
│   ├── database.py          # SQLAlchemy database configuration
│   ├── seed.py              # Database seeding script
│   ├── requirements.txt     # Python dependencies
│   ├── models/               # SQLAlchemy ORM models
│   │   ├── course.py         # Course, Unit, Skill, Lesson, Exercise models
│   │   ├── user.py           # User model
│   │   └── progress.py       # Progress, stats, quests, achievements models
│   ├── routers/              # API route handlers
│   │   ├── users.py          # User authentication and management
│   │   ├── courses.py        # Course path and learning content
│   │   ├── lessons.py        # Lesson execution and completion
│   │   ├── leaderboard.py    # Leaderboard rankings
│   │   ├── hearts.py         # Hearts management
│   │   ├── quests.py         # Daily quests
│   │   └── achievements.py    # Achievement tracking
│   ├── schemas/              # Pydantic schemas for request/response validation
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── lesson.py
│   │   └── gamification.py
│   └── services/             # Business logic services
│       ├── heart_service.py     # Heart deduction logic
│       ├── xp_service.py        # XP calculation
│       ├── streak_service.py    # Streak calculation
│       ├── progress_service.py # Lesson progress and unlocking
│       └── quest_service.py     # Quest progress tracking
│
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js app router pages
│   │   │   ├── layout.tsx     # Root layout with sidebar/navigation
│   │   │   ├── page.tsx        # Home/learn page
│   │   │   ├── lesson/[id]/   # Lesson player page
│   │   │   ├── settings/       # Settings page
│   │   │   ├── practice/       # Practice page
│   │   │   ├── leaderboard/    # Leaderboard page
│   │   │   ├── quests/         # Quests page
│   │   │   ├── shop/           # Shop page
│   │   │   └── profile/        # Profile page
│   │   ├── components/
│   │   │   ├── layout/         # Layout components
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── StatsHeader.tsx
│   │   │   │   ├── RightPanel.tsx
│   │   │   │   └── BottomNav.tsx
│   │   │   ├── lesson-player/  # Lesson exercise components
│   │   │   │   ├── LessonHeader.tsx
│   │   │   │   ├── MultipleChoiceExercise.tsx
│   │   │   │   ├── WordBankExercise.tsx
│   │   │   │   ├── TypeAnswerExercise.tsx
│   │   │   │   ├── MatchPairsExercise.tsx
│   │   │   │   ├── FillBlankExercise.tsx
│   │   │   │   ├── FeedbackPanel.tsx
│   │   │   │   ├── CompletionScreen.tsx
│   │   │   │   ├── OutOfHeartsModal.tsx
│   │   │   │   └── QuitConfirmModal.tsx
│   │   │   └── ui/              # Shared UI components
│   │   │       ├── ProgressBar.tsx
│   │   │       ├── HeartsCounter.tsx
│   │   │       ├── SkeletonLoader.tsx
│   │   │       └── Toast.tsx
│   │   ├── lib/
│   │   │   ├── api.ts          # API client with axios/fetch
│   │   │   ├── hooks.ts        # React Query hooks for data fetching
│   │   │   ├── queryClient.ts  # React Query client configuration
│   │   │   └── cn.ts           # Tailwind className utility
│   │   ├── stores/
│   │   │   └── lessonSessionStore.ts  # Zustand store for lesson session state
│   │   └── types/
│   │       └── api.ts         # TypeScript type definitions
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── duolingo.db              # SQLite database (created by seed.py)
├── README.md
└── DEPLOYMENT.md            # Deployment guide for Render/Vercel
```

### Technology Stack

**Backend:**
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy 2.x**: Python SQL toolkit and ORM
- **SQLite**: Lightweight file-based database
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for running FastAPI

**Frontend:**
- **Next.js 16**: React framework with server-side rendering
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4**: Utility-first CSS framework
- **TanStack React Query**: Data fetching and state management
- **Zustand**: Lightweight state management
- **Lucide React**: Icon library

### Architecture Patterns

**Backend:**
- **Repository Pattern**: Models define database schema
- **Service Layer**: Business logic separated from route handlers
- **Router Organization**: Modular API routers for different domains
- **Pydantic Schemas**: Request/response validation and serialization

**Frontend:**
- **Component-Based Architecture**: Reusable UI components
- **Custom Hooks**: Encapsulated data fetching logic with React Query
- **State Management**: Zustand for lesson session state
- **Type Safety**: TypeScript throughout the application
- **API Client**: Centralized API communication layer

---

## Database Schema

### Database Engine

**SQLite** with SQLAlchemy ORM. Database file: `duolingo.db`

### Tables

#### courses
Language courses available for learning.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Course identifier |
| title | String | Course name (e.g., "Spanish") |
| language_code | String | ISO language code (e.g., "es") |
| flag_emoji | String | Flag emoji (e.g., "🇪🇸") |
| flag_image_url | String (nullable) | Flag image URL from CDN |
| description | String (nullable) | Course description |
| total_learners | Integer | Total learners count |
| created_at | DateTime | Creation timestamp |

**Relationships:**
- One-to-many with `units`

#### units
Logical groupings of skills within a course.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Unit identifier |
| course_id | Integer (FK) | Parent course |
| title | String | Unit name (e.g., "Basics") |
| description | String (nullable) | Unit description |
| order_index | Integer | Display order within course |
| color_hex | String | Color code for UI display |
| created_at | DateTime | Creation timestamp |

**Relationships:**
- Many-to-one with `courses`
- One-to-many with `skills`

#### skills
Topic-specific skill groupings within units.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Skill identifier |
| unit_id | Integer (FK) | Parent unit |
| title | String | Skill name (e.g., "Skill 1 of Basics") |
| description | String (nullable) | Skill description |
| icon_emoji | String | Icon emoji for UI display |
| order_index | Integer | Display order within unit |
| created_at | DateTime | Creation timestamp |

**Relationships:**
- Many-to-one with `units`
- One-to-many with `lessons`

#### lessons
Individual lessons within skills.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Lesson identifier |
| skill_id | Integer (FK) | Parent skill |
| title | String | Lesson name (e.g., "Lesson 1") |
| order_index | Integer | Display order within skill |
| xp_reward | Integer | XP awarded on completion |
| created_at | DateTime | Creation timestamp |

**Relationships:**
- Many-to-one with `skills`
- One-to-many with `exercises`

#### exercises
Individual exercises within lessons.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Exercise identifier |
| lesson_id | Integer (FK) | Parent lesson |
| type | Enum | Exercise type: `multiple_choice`, `word_bank`, `match_pairs`, `fill_blank`, `type_answer` |
| prompt | String | Exercise prompt/instruction |
| correct_answer | String | Correct answer for validation |
| explanation | String (nullable) | Explanation shown after answer |
| order_index | Integer | Display order within lesson |
| created_at | DateTime | Creation timestamp |

**Relationships:**
- Many-to-one with `lessons`
- One-to-many with `exercise_options`

#### exercise_options
Answer options for exercises.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Option identifier |
| exercise_id | Integer (FK) | Parent exercise |
| text | String | Option text content |
| is_correct | Integer | Whether this is the correct answer (0 or 1) |
| order_index | Integer | Display order within exercise |

**Relationships:**
- Many-to-one with `exercises`

#### users
User accounts.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | User identifier |
| username | String (unique) | Username |
| email | String (unique) | Email address |
| avatar_url | String (nullable) | Profile avatar URL |
| created_at | DateTime | Account creation timestamp |

#### user_stats
User statistics and gamification data.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Stats identifier |
| user_id | Integer (FK, unique) | Parent user |
| total_xp | Integer | Total XP earned |
| current_streak | Integer | Current consecutive days of activity |
| longest_streak | Integer | Longest streak achieved |
| last_activity_date | DateTime (nullable) | Last activity timestamp |
| hearts | Integer | Available hearts (lives) |
| gems | Integer | Available gems |
| daily_xp | Integer | XP earned today |
| daily_goal | Integer | Daily XP goal |
| streak_freeze_active | Boolean | Whether streak freeze is active |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

**Relationships:**
- One-to-one with `users`

#### user_lesson_progress
Lesson completion state for users.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Progress identifier |
| user_id | Integer (FK) | Parent user |
| lesson_id | Integer (FK) | Associated lesson |
| state | Enum | Lesson state: `locked`, `available`, `in_progress`, `completed`, `legendary` |
| stars | Integer | Stars earned (0-3) |
| attempts | Integer | Number of attempts |
| last_attempted_at | DateTime (nullable) | Last attempt timestamp |
| completed_at | DateTime (nullable) | Completion timestamp |

**Constraints:**
- Unique on `(user_id, lesson_id)`

#### user_skill_progress
Skill completion tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Progress identifier |
| user_id | Integer (FK) | Parent user |
| skill_id | Integer (FK) | Associated skill |
| completed_lessons | Integer | Number of completed lessons |
| total_lessons | Integer | Total lessons in skill |
| crown_level | Integer | Crown level achieved (0-5) |

#### user_course_progress
Course enrollment tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Progress identifier |
| user_id | Integer (FK) | Parent user |
| course_id | Integer (FK) | Associated course |

#### daily_activity
Daily XP tracking for streaks.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Activity identifier |
| user_id | Integer (FK) | Parent user |
| date | Date | Activity date |
| xp_earned | Integer | XP earned on this date |

**Constraints:**
- Unique on `(user_id, date)`

#### xp_transactions
XP transaction history.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Transaction identifier |
| user_id | Integer (FK) | Parent user |
| amount | Integer | XP amount |
| reason | String | Reason for XP award |
| created_at | DateTime | Transaction timestamp |

#### quests
Daily achievement challenges.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Quest identifier |
| title | String | Quest title |
| description | String (nullable) | Quest description |
| target_value | Integer | Target value to complete |
| xp_reward | Integer | XP reward on completion |
| gem_reward | Integer | Gem reward on completion |

#### user_quest_progress
User quest progress tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Progress identifier |
| user_id | Integer (FK) | Parent user |
| quest_id | Integer (FK) | Associated quest |
| current_value | Integer | Current progress value |
| completed | Boolean | Whether quest is completed |
| claimed | Boolean | Whether reward is claimed |

#### achievements
Milestone achievements.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Achievement identifier |
| title | String | Achievement title |
| description | String (nullable) | Achievement description |
| icon_emoji | String (nullable) | Icon emoji |
| threshold_value | Integer | Threshold value to unlock |
| achievement_type | String | Type: `streak`, `xp`, `lessons`, `leaderboard`, `perfect_lessons` |

#### user_achievements
User achievement unlocks.

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Achievement identifier |
| user_id | Integer (FK) | Parent user |
| achievement_id | Integer (FK) | Associated achievement |
| unlocked | Boolean | Whether achievement is unlocked |
| unlocked_at | DateTime (nullable) | Unlock timestamp |

---

## API Overview

### Base URL

```
http://localhost:8000/api
```

### Authentication

Currently uses basic authentication. Include credentials in requests for protected endpoints.

### Endpoints

#### Health Check
```
GET /health
```
Returns API health status.

#### Users
```
POST /api/users/register
POST /api/users/login
GET /api/users/me
```
User registration, login, and profile retrieval.

#### Courses
```
GET /api/courses
GET /api/courses/{course_id}/path
```
List all courses and get course learning path with lesson states.

#### Lessons
```
GET /api/lessons/{lesson_id}
POST /api/lessons/{lesson_id}/start
POST /api/lessons/{lesson_id}/answer
POST /api/lessons/{lesson_id}/complete
```
Lesson retrieval, starting, answering exercises, and completion.

**Lesson Response Schema:**
```json
{
  "id": 1,
  "title": "Lesson 1",
  "xp_reward": 10,
  "exercises": [
    {
      "id": 1,
      "type": "multiple_choice",
      "prompt": "Choose the correct answer",
      "order_index": 1,
      "exercise_options": [
        {
          "id": 1,
          "text": "Option 1",
          "order_index": 1
        }
      ]
    }
  ]
}
```

#### Leaderboard
```
GET /api/leaderboard
```
Returns top 10 users ranked by total XP.

**Response Schema:**
```json
[
  {
    "rank": 1,
    "username": "learner",
    "avatar_url": null,
    "total_xp": 250,
    "is_current_user": true
  }
]
```

#### Stats
```
GET /api/stats
```
Returns current user statistics.

**Response Schema:**
```json
{
  "total_xp": 250,
  "current_streak": 5,
  "longest_streak": 10,
  "hearts": 5,
  "gems": 100,
  "daily_xp": 30,
  "daily_goal": 20,
  "last_activity_date": "2024-01-15T10:30:00Z",
  "streak_freeze_active": false
}
```

#### Hearts
```
POST /api/hearts/refill
```
Refill hearts (purchase logic not implemented).

#### Quests
```
GET /api/quests
POST /api/quests/{quest_id}/claim
```
List daily quests and claim rewards.

#### Achievements
```
GET /api/achievements
```
List all achievements and user's unlock status.

### Exercise Types

The backend supports five exercise types:

1. **multiple_choice**: Choose from 4 answer options
2. **word_bank**: Translate by selecting word tokens
3. **match_pairs**: MVP: simple text input
4. **fill_blank**: MVP: simple text input
5. **type_answer**: Type the correct translation

### Response Status Codes

- `200 OK`: Successful request
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Environment Variables

### Backend Environment Variables

Set these in your environment or `.env` file:

```bash
FRONTEND_URL=http://localhost:3000
DATABASE_URL=sqlite:///./duolingo.db  # Optional, defaults to SQLite
PYTHON_VERSION=3.11.0
```

### Frontend Environment Variables

Set these in Vercel or local `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**For Production (Render/Vercel):**

```bash
# Backend (Render)
FRONTEND_URL=https://your-app.vercel.app

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api
```

---

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Render service
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `bash startup.sh`
   - **Environment Variables**: `FRONTEND_URL=https://your-app.vercel.app`
5. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js
   - **Environment Variables**: `NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api`
4. Deploy

### Deployment Flow

1. Deploy backend on Render
2. Copy backend URL
3. Configure frontend API variable in Vercel
4. Deploy frontend on Vercel
5. Copy frontend URL
6. Update Render's `FRONTEND_URL` environment variable
7. Redeploy backend to apply CORS changes

For detailed deployment instructions, see `DEPLOYMENT.md`.

---

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend build
cd frontend
npm run build
```

### Database Seeding

The seed script is idempotent and will skip seeding if data already exists:

```bash
py -3.11 -m backend.seed
```

To force a fresh seed:
```bash
del duolingo.db
py -3.11 -m backend.seed
```

### Local Development Commands

**Backend:**
```bash
# From project root
py -3.11 -m uvicorn backend.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## License

This is a personal project for educational purposes.

