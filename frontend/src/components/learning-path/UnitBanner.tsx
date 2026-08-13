import React from 'react';
import { UnitPath } from '@/types/api';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface UnitBannerProps {
  unit: UnitPath;
}

export function UnitBanner({ unit }: UnitBannerProps) {
  // calculate total lessons and completed lessons across all skills in this unit
  const totalLessons = unit.skills.reduce((acc, skill) => acc + skill.total_lessons, 0);
  const completedLessons = unit.skills.reduce((acc, skill) => acc + skill.completed_lessons, 0);
  
  const progressPercent = totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100;

  return (
    <div className="w-full flex flex-col items-center">
      <div 
        className="w-full max-w-[600px] rounded-2xl p-6 text-white mb-8 shadow-sm flex flex-col relative overflow-hidden"
        style={{ backgroundColor: unit.color_hex }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold tracking-wide uppercase">
            Unit {unit.order_index}
          </h2>
        </div>
        <p className="font-bold text-lg opacity-90 mb-6">
          {unit.title} - {unit.description}
        </p>
        <div className="w-full bg-black/20 rounded-full h-4 overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
