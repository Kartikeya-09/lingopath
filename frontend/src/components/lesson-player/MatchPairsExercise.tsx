import React, { useState } from 'react';
import { Exercise } from '@/types/api';

interface MatchPairsExerciseProps {
  exercise: Exercise;
  onAnswerSelected: (answer: string) => void;
  onCanCheck: (canCheck: boolean) => void;
  onSubmit: () => void;
}

export function MatchPairsExercise({ exercise, onAnswerSelected, onCanCheck, onSubmit }: MatchPairsExerciseProps) {
  // Simple text input for MVP
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onAnswerSelected(val);
    onCanCheck(val.trim().length > 0);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[680px] mx-auto pt-8 px-4">
      <h2 className="text-[28px] font-extrabold text-[#f7f7f7] mb-8">{exercise.prompt}</h2>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && value.trim() && onSubmit()}
        autoFocus
        className="w-full p-4 text-xl border-2 border-[#536871] rounded-xl focus:outline-none focus:border-[#1cb0f6] bg-transparent text-[#ffffff] placeholder-[#8c9aa0]"
        placeholder="Type your answer here..."
      />
    </div>
  );
}
