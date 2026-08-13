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
        "fixed bottom-0 left-0 right-0 p-4 md:p-8 flex flex-col md:flex-row items-center justify-between z-50 animate-in slide-in-from-bottom",
        isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      )}
    >
      <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 text-white",
          isCorrect ? "bg-green-500" : "bg-red-500"
        )}>
          {isCorrect ? <Check size={32} /> : <X size={32} />}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">
            {isCorrect ? 'Excellent!' : 'Incorrect'}
          </h2>
          {explanation && (
            <p className={cn("text-lg", isCorrect ? "text-green-700" : "text-red-700")}>
              {explanation}
            </p>
          )}
        </div>
      </div>
      
      <button
        onClick={onContinue}
        className={cn(
          "w-full md:w-auto px-8 py-4 rounded-2xl font-bold text-xl text-white transition-transform active:translate-y-1 shadow-sm",
          isCorrect 
            ? "bg-green-500 hover:bg-green-600 border-b-4 border-green-700" 
            : "bg-red-500 hover:bg-red-600 border-b-4 border-red-700"
        )}
      >
        CONTINUE
      </button>
    </div>
  );
}
