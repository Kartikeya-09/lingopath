import React, { useState, useEffect } from 'react';
import { Exercise } from '@/types/api';
import { cn } from '@/lib/cn';

interface WordBankExerciseProps {
  exercise: Exercise;
  onAnswerSelected: (answer: string) => void;
  onCanCheck: (canCheck: boolean) => void;
}

export function WordBankExercise({ exercise, onAnswerSelected, onCanCheck }: WordBankExerciseProps) {
  const [bank, setBank] = useState(exercise.exercise_options.map(o => o.text));
  const [sentence, setSentence] = useState<string[]>([]);

  useEffect(() => {
    setBank(exercise.exercise_options.map(o => o.text));
    setSentence([]);
    onCanCheck(false);
  }, [exercise, onCanCheck]);

  const handleBankClick = (word: string) => {
    setBank(bank.filter(w => w !== word));
    const newSentence = [...sentence, word];
    setSentence(newSentence);
    onAnswerSelected(newSentence.join(' '));
    onCanCheck(newSentence.length > 0);
  };

  const handleSentenceClick = (word: string, index: number) => {
    const newSentence = [...sentence];
    newSentence.splice(index, 1);
    setSentence(newSentence);
    setBank([...bank, word]);
    onAnswerSelected(newSentence.join(' '));
    onCanCheck(newSentence.length > 0);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[680px] mx-auto pt-8 px-4">
      <h2 className="text-[28px] font-extrabold text-[#f7f7f7] mb-8">Translate this sentence</h2>

      <div className="min-h-[60px] border-b-2 border-[#3f535d] mb-8 flex flex-wrap gap-2 pb-2">
        {sentence.map((word, i) => (
          <button
            key={`s-${i}`}
            onClick={() => handleSentenceClick(word, i)}
            className="p-3 bg-transparent border-2 border-[#3f535d] rounded-xl text-lg font-bold text-[#f7f7f7] border-b-4 border-b-[#3f535d] hover:bg-[rgba(255,255,255,0.04)]"
          >
            {word}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {bank.map((word, i) => (
          <button
            key={`b-${i}`}
            onClick={() => handleBankClick(word)}
            className="p-3 bg-transparent border-2 border-[#3f535d] rounded-xl text-lg font-bold text-[#f7f7f7] border-b-4 border-b-[#3f535d] hover:bg-[rgba(255,255,255,0.04)] active:bg-[rgba(255,255,255,0.08)]"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
