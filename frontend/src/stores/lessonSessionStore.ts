import { create } from 'zustand';

interface LessonSessionState {
  currentExerciseIndex: number;
  errors: number;
  sessionXp: number;
  isComplete: boolean;
  initSession: () => void;
  advanceExercise: () => void;
  recordError: () => void;
  addXp: (amount: number) => void;
  completeSession: () => void;
  reset: () => void;
}

export const useLessonSessionStore = create<LessonSessionState>((set) => ({
  currentExerciseIndex: 0,
  errors: 0,
  sessionXp: 0,
  isComplete: false,
  initSession: () => set({ currentExerciseIndex: 0, errors: 0, sessionXp: 0, isComplete: false }),
  advanceExercise: () => set((state) => ({ currentExerciseIndex: state.currentExerciseIndex + 1 })),
  recordError: () => set((state) => ({ errors: state.errors + 1 })),
  addXp: (amount: number) => set((state) => ({ sessionXp: state.sessionXp + amount })),
  completeSession: () => set({ isComplete: true }),
  reset: () => set({ currentExerciseIndex: 0, errors: 0, sessionXp: 0, isComplete: false }),
}));
