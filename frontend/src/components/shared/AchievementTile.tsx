import React from 'react';
import { Lock } from 'lucide-react';
import { Achievement } from '@/types/api';
import { cn } from '@/lib/cn';

interface AchievementTileProps {
  achievement: Achievement;
}

export function AchievementTile({ achievement }: AchievementTileProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 p-4 flex flex-col items-center justify-center text-center bg-white shadow-sm h-full">
      {!achievement.unlocked && (
        <div className="absolute inset-0 bg-gray-100/50 backdrop-grayscale z-10 flex flex-col items-center justify-center rounded-2xl">
          <Lock className="w-12 h-12 text-gray-400 opacity-80" />
        </div>
      )}
      <div className={cn("text-5xl mb-3", !achievement.unlocked && "opacity-40 grayscale")}>
        {achievement.icon_emoji}
      </div>
      <h3 className="font-bold text-gray-800">{achievement.title}</h3>
      <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
      {achievement.unlocked && achievement.unlocked_at && (
        <span className="text-xs font-bold text-yellow-500 mt-2 uppercase tracking-wider">
          Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}
