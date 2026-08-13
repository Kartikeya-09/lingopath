import React from 'react';
import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function ProgressBar({ value, className, indicatorClassName }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  return (
    <div className={cn("h-4 w-full bg-gray-200 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full bg-green-500 rounded-full transition-all duration-500 ease-out", indicatorClassName)}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
