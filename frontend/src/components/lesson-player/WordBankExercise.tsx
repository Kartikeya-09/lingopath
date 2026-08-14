import React, { useEffect, useState } from "react";
import { Exercise } from "@/types/api";

interface WordBankExerciseProps {
  exercise: Exercise;
  onAnswerSelected: (answer: string) => void;
  onCanCheck: (canCheck: boolean) => void;
}

export function WordBankExercise({
  exercise,
  onAnswerSelected,
  onCanCheck,
}: WordBankExerciseProps) {
  const [bank, setBank] = useState<string[]>([]);
  const [sentence, setSentence] = useState<string[]>([]);

  useEffect(() => {
    setBank(exercise.exercise_options.map((option) => option.text));
    setSentence([]);
    onAnswerSelected("");
    onCanCheck(false);
  }, [exercise, onAnswerSelected, onCanCheck]);

  const handleBankClick = (word: string, index: number) => {
    // Remove only the clicked occurrence.
    // This is safer if the word bank contains duplicate words.
    const updatedBank = [...bank];
    updatedBank.splice(index, 1);

    const updatedSentence = [...sentence, word];

    setBank(updatedBank);
    setSentence(updatedSentence);

    const answer = updatedSentence.join(" ");

    onAnswerSelected(answer);
    onCanCheck(updatedSentence.length > 0);
  };

  const handleSentenceClick = (word: string, index: number) => {
    const updatedSentence = [...sentence];
    updatedSentence.splice(index, 1);

    setSentence(updatedSentence);
    setBank((previousBank) => [...previousBank, word]);

    const answer = updatedSentence.join(" ");

    onAnswerSelected(answer);
    onCanCheck(updatedSentence.length > 0);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[680px] flex-col px-4 pt-8">
      {/* Exercise instruction */}
      <h2 className="mb-4 text-[28px] font-extrabold text-[#f7f7f7]">
        Translate this sentence
      </h2>

      {/* ACTUAL SENTENCE TO TRANSLATE */}
      <p className="mb-8 text-[22px] font-bold leading-relaxed text-[#f7f7f7]">
        {exercise.prompt}
      </p>

      {/* Selected answer */}
      <div className="mb-8 flex min-h-[68px] flex-wrap gap-2 border-b-2 border-[#3f535d] pb-2">
        {sentence.map((word, index) => (
          <button
            key={`sentence-${index}-${word}`}
            type="button"
            onClick={() => handleSentenceClick(word, index)}
            className="rounded-xl border-2 border-[#3f535d] border-b-4 bg-transparent px-4 py-3 text-lg font-bold text-[#f7f7f7] transition-colors hover:bg-[rgba(255,255,255,0.04)]"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap justify-center gap-3">
        {bank.map((word, index) => (
          <button
            key={`bank-${index}-${word}`}
            type="button"
            onClick={() => handleBankClick(word, index)}
            className="rounded-xl border-2 border-[#3f535d] border-b-4 bg-transparent px-4 py-3 text-lg font-bold text-[#f7f7f7] transition-colors hover:bg-[rgba(255,255,255,0.04)] active:bg-[rgba(255,255,255,0.08)]"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}