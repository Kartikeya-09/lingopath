export interface UserStats {
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  hearts: number;
  gems: number;
  daily_xp: number;
  daily_goal: number;
  last_activity_date: string | null;
  streak_freeze_active: boolean;
}

export interface UserOut {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  stats: UserStats | null;
}

export type LessonState = 'locked' | 'available' | 'in_progress' | 'completed' | 'legendary';

export interface LessonPath {
  id: number;
  title: string;
  order_index: number;
  xp_reward: number;
  state: LessonState;
}

export interface SkillPath {
  id: number;
  title: string;
  description: string | null;
  icon_emoji: string;
  order_index: number;
  completed_lessons: number;
  total_lessons: number;
  lessons: LessonPath[];
}

export interface UnitPath {
  id: number;
  title: string;
  description: string | null;
  order_index: number;
  color_hex: string;
  skills: SkillPath[];
}

export interface CoursePath {
  id: number;
  title: string;
  language_code: string;
  flag_emoji: string;
  description: string | null;
  total_learners: number;
  units: UnitPath[];
}

export interface ExerciseOption {
  id: number;
  text: string;
  order_index: number;
}

export type ExerciseType = 'multiple_choice' | 'word_bank' | 'match_pairs' | 'fill_blank' | 'type_answer';

export interface Exercise {
  id: number;
  type: ExerciseType;
  prompt: string;
  order_index: number;
  exercise_options: ExerciseOption[];
}

export interface LessonDetail {
  id: number;
  title: string;
  xp_reward: number;
  exercises: Exercise[];
}

export interface AnswerResponse {
  correct: boolean;
  correct_answer: string | null;
  explanation: string | null;
  hearts_remaining: number | null;
  out_of_hearts: boolean | null;
}

export interface CompleteResponse {
  xp_earned: number;
  total_xp: number;
  streak: number;
  perfect: boolean;
  lesson_completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar_url: string | null;
  total_xp: number;
  is_current_user: boolean;
}

export interface Quest {
  id: number;
  title: string;
  description: string | null;
  target_value: number;
  xp_reward: number;
  gem_reward: number;
  current_value: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  description: string | null;
  icon_emoji: string | null;
  threshold_value: number;
  achievement_type: string;
  unlocked: boolean;
  unlocked_at: string | null;
}
