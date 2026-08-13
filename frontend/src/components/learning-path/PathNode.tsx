import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Check, Crown, Star } from 'lucide-react';
import { LessonState } from '@/types/api';
import { cn } from '@/lib/cn';

interface PathNodeProps {
  id: number;
  state: LessonState;
  index: number;
  total: number;
}

export function PathNode({ id, state, index, total }: PathNodeProps) {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Calculate zigzag offset
  const cycle = index % 4;
  let translateX = 0;
  if (cycle === 1) translateX = 40;
  if (cycle === 2) translateX = 60;
  if (cycle === 3) translateX = 40;
  
  const handleClick = () => {
    if (state === 'locked') {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } else {
      router.push(`/lesson/${id}`);
    }
  };

  const isLocked = state === 'locked';
  const isActive = state === 'available' || state === 'in_progress';
  const isCompleted = state === 'completed';
  const isLegendary = state === 'legendary';

  return (
    <div 
      className="relative flex justify-center w-full my-6 md:my-8 z-10"
      style={{ transform: `translateX(${translateX}px)` }}
    >
      <div className="relative">
        <button
          onClick={handleClick}
          className={cn(
            "relative w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-full border-b-[8px] flex items-center justify-center transition-all transform hover:-translate-y-1 active:translate-y-1 active:border-b-0 mb-[8px]",
            isLocked ? "bg-gray-200 border-gray-300 cursor-not-allowed" : "",
            isActive ? "bg-green-500 border-green-600 cursor-pointer shadow-lg shadow-green-500/30" : "",
            isCompleted ? "bg-yellow-400 border-yellow-500 cursor-pointer" : "",
            isLegendary ? "bg-yellow-500 border-yellow-600 cursor-pointer ring-4 ring-yellow-200" : ""
          )}
        >
          {isActive && (
            <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20" />
          )}
          
          {isLocked && <Lock className="w-8 h-8 text-gray-400" />}
          {isActive && <Star className="w-10 h-10 text-white fill-current" />}
          {isCompleted && <Check className="w-10 h-10 text-white stroke-[3]" />}
          {isLegendary && <Crown className="w-10 h-10 text-white fill-current" />}
        </button>
        
        {isActive && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-xl border-2 border-gray-200 font-bold text-green-500 text-sm whitespace-nowrap z-20 animate-bounce shadow-sm">
            {state === 'available' ? 'START' : 'CONTINUE'}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-gray-200 rotate-45" />
          </div>
        )}
        
        {showTooltip && isLocked && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap z-20 font-bold">
            Locked
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-800 rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
}
