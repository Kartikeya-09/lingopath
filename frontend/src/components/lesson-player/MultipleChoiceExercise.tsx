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
    <div className="mx-auto flex h-full w-full max-w-[680px] flex-col px-4 pt-8 text-[#f7f7f7]">
      <h2 className="mb-8 text-center text-[28px] font-extrabold tracking-tight text-[#f7f7f7]">{exercise.prompt || 'Choose the correct answer'}</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {exercise.exercise_options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id, opt.text)}
              className={cn(
                "rounded-[12px] border-2 p-5 text-center text-xl font-extrabold transition-all border-b-4",
                isSelected
                  ? "border-[#1cb0f6] bg-[rgba(28,176,246,0.12)] text-[#f7f7f7] border-b-[#1cb0f6]"
                  : "border-[#3f535d] bg-transparent text-[#f7f7f7] hover:bg-[rgba(255,255,255,0.04)] border-b-[#3f535d]"
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
