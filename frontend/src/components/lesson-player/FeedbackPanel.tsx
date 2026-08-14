import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FeedbackPanelProps {
  status: 'correct' | 'incorrect' | null;
  explanation: string | null;
  onContinue: () => void;
}

export function FeedbackPanel({ status, explanation, onContinue }: FeedbackPanelProps) {
  if (!status) return null;

  const isCorrect = status === 'correct';

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-between p-4 md:flex-row md:p-8",
        isCorrect ? "bg-[#163a22] text-[#79d635]" : "bg-[#3b1f22] text-[#ff6b6b]"
      )}
    >
      <div className="mb-4 flex w-full items-center md:mb-0 md:w-auto">
        <div className={cn(
          "mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white",
          isCorrect ? "bg-green-500" : "bg-red-500"
        )}>
          {isCorrect ? <Check size={32} /> : <X size={32} />}
        </div>
        <div>
          <h2 className="mb-1 text-2xl font-bold">
            {isCorrect ? 'Excellent!' : 'Incorrect'}
          </h2>
          {explanation && (
            <p className={cn("text-lg", isCorrect ? "text-[#79d635]" : "text-[#ff6b6b]")}>
              {explanation}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onContinue}
        className={cn(
          "w-full rounded-2xl px-8 py-4 text-xl font-bold text-white shadow-sm transition-transform active:translate-y-1 md:w-auto",
          isCorrect
            ? "border-b-4 border-green-700 bg-green-500 hover:bg-green-600"
            : "border-b-4 border-red-700 bg-red-500 hover:bg-red-600"
        )}
      >
        CONTINUE
      </button>
    </div>
  );
}
