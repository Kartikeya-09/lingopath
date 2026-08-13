import React from 'react';
import { X } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { HeartsCounter } from '@/components/ui/HeartsCounter';

interface LessonHeaderProps {
  progressPercent: number;
  hearts: number;
  onQuit: () => void;
}

export function LessonHeader({ progressPercent, hearts, onQuit }: LessonHeaderProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1000px] items-center justify-between bg-[var(--duo-bg)] p-4 pt-6">
      <button
        onClick={onQuit}
        className="mr-4 text-[var(--duo-text-soft)] transition-colors hover:text-white"
      >
        <X size={32} />
      </button>

      <div className="mr-4 flex-1">
        <ProgressBar value={progressPercent} className="h-5 rounded-full" indicatorClassName="bg-green-500" />
      </div>

      <HeartsCounter count={hearts} />
    </div>
  );
}
