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
    <div className="flex flex-col h-full w-full max-w-[600px] mx-auto pt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">{exercise.prompt}</h2>
      
      <div className="flex flex-col">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50 text-gray-800"
          placeholder="Type your answer here..."
        />
      </div>
    </div>
  );
}
