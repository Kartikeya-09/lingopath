import React, { useEffect, useState } from "react";
import { Exercise } from "@/types/api";

interface FillBlankExerciseProps {
  exercise: Exercise;
  onAnswerSelected: (answer: string) => void;
  onCanCheck: (canCheck: boolean) => void;
  onSubmit: () => void;
}

export function FillBlankExercise({
  exercise,
  onAnswerSelected,
  onCanCheck,
  onSubmit,
}: FillBlankExerciseProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
    onAnswerSelected("");
    onCanCheck(false);
  }, [exercise, onAnswerSelected, onCanCheck]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setValue(val);
    onAnswerSelected(val);
    onCanCheck(val.trim().length > 0);
  };

  const displayPrompt = exercise.prompt
    .replace(/^Complete the sentence:\s*/i, "")
    .trim();

  return (
    <div className="mx-auto flex h-full w-full max-w-[680px] flex-col px-4 pt-8">
      <h2 className="mb-4 text-[28px] font-extrabold text-[#f7f7f7]">
        Complete the sentence
      </h2>

      <p className="mb-8 text-[22px] font-bold leading-relaxed text-[#f7f7f7]">
        {displayPrompt}
      </p>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) {
            onSubmit();
          }
        }}
        autoFocus
        className="w-full rounded-xl border-2 border-[#536871] bg-transparent p-4 text-xl text-white placeholder-[#8c9aa0] focus:border-[#1cb0f6] focus:outline-none"
        placeholder="Type your answer here..."
      />
    </div>
  );
}