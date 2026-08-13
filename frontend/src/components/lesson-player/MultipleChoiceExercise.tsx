import React, { useState } from 'react';
import { Exercise } from '@/types/api';
import { cn } from '@/lib/cn';

interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  onAnswerSelected: (answer: string) => void;
  onCanCheck: (canCheck: boolean) => void;
}

export function MultipleChoiceExercise({ exercise, onAnswerSelected, onCanCheck }: MultipleChoiceExerciseProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number, text: string) => {
    setSelectedId(id);
    onAnswerSelected(text);
    onCanCheck(true);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[600px] mx-auto pt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">{exercise.prompt}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercise.exercise_options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id, opt.text)}
              className={cn(
                "p-4 rounded-xl border-2 text-lg font-bold transition-all text-center",
                isSelected 
                  ? "bg-blue-100 border-blue-400 text-blue-500" 
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
