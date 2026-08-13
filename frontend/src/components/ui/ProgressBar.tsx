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
    <div className={cn("h-4 w-full overflow-hidden rounded-full bg-white/10", className)}>
      <div
        className={cn("h-full rounded-full bg-green-500 transition-all duration-500 ease-out", indicatorClassName)}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
