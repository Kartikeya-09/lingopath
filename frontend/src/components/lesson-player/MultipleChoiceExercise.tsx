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
    <div className="mx-auto flex h-full w-full max-w-[700px] flex-col px-4 pt-8 text-[var(--duo-text)]">
      <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-[var(--duo-text)]">{exercise.prompt}</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {exercise.exercise_options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id, opt.text)}
              className={cn(
                "rounded-[22px] border-2 p-5 text-center text-xl font-extrabold transition-all",
                isSelected
                  ? "border-[#9dd7ff] bg-[#dff4ff] text-[#0c4d7f]"
                  : "border-white/10 bg-[#f0f3f5] text-slate-700 hover:border-white/30 hover:bg-[#eef2f4]"
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
