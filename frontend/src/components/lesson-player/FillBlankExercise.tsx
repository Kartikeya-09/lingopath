import React, { useState } from 'react';
import { Exercise } from '@/types/api';

interface FillBlankExerciseProps {
  exercise: Exercise;
  onAnswerSelected: (answer: string) => void;
  onCanCheck: (canCheck: boolean) => void;
  onSubmit: () => void;
}

export function FillBlankExercise({ exercise, onAnswerSelected, onCanCheck, onSubmit }: FillBlankExerciseProps) {
  // Mocked for MVP
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onAnswerSelected(val);
    onCanCheck(val.trim().length > 0);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[600px] mx-auto pt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">{exercise.prompt} (Fill in the blank)</h2>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && value.trim() && onSubmit()}
        autoFocus
        className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-400"
      />
    </div>
  );
}
