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
    <div className="flex items-center justify-between w-full p-4 max-w-[1000px] mx-auto pt-6">
      <button 
        onClick={onQuit}
        className="text-gray-400 hover:text-gray-600 transition-colors mr-4"
      >
        <X size={32} />
      </button>
      
      <div className="flex-1 mr-4">
        <ProgressBar value={progressPercent} className="h-5" indicatorClassName="bg-green-500" />
      </div>
      
      <HeartsCounter count={hearts} />
    </div>
  );
}
