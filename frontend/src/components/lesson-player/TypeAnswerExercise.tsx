import React, { useState } from 'react';
import { Exercise } from '@/types/api';

interface TypeAnswerExerciseProps {
  exercise: Exercise;
  onAnswerSelected: (answer: string) => void;
  onCanCheck: (canCheck: boolean) => void;
  onSubmit: () => void;
}

export function TypeAnswerExercise({ exercise, onAnswerSelected, onCanCheck, onSubmit }: TypeAnswerExerciseProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onAnswerSelected(val);
    onCanCheck(val.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim().length > 0) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[680px] mx-auto pt-8 px-4">
      <h2 className="text-[28px] font-extrabold text-[#f7f7f7] mb-8">{exercise.prompt || 'Type the correct answer'}</h2>

      <div className="flex flex-col">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full p-4 text-xl border-2 border-[#536871] rounded-xl focus:outline-none focus:border-[#1cb0f6] bg-transparent text-[#ffffff] placeholder-[#8c9aa0]"
          placeholder="Type your answer here..."
        />
      </div>
    </div>
  );
}
