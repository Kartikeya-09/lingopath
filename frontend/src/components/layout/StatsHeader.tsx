import React from 'react';
import { Flame, Gem, Heart, Zap } from 'lucide-react';
import { useStats, useCoursePath } from '@/lib/hooks';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

interface StatsHeaderProps {
  className?: string;
}

export function StatsHeader({ className = '' }: StatsHeaderProps) {
  const { data: stats, isLoading } = useStats();
  const { data: course } = useCoursePath(1);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-end gap-4 ${className}`}>
        <SkeletonLoader className="h-8 w-8 rounded-full overflow-hidden" />
        <SkeletonLoader className="h-6 w-8" />
        <SkeletonLoader className="h-6 w-8" />
        <SkeletonLoader className="h-6 w-8" />
        <SkeletonLoader className="h-6 w-8" />
      </div>
    );
  }

  if (!stats) return null;

  const flagEmoji = course?.flag_emoji || '🇪🇸'; // Default to Spanish flag if course data not available
  const flagImageUrl = course?.flag_image_url;

  return (
    <div className={`flex items-center justify-end gap-4 whitespace-nowrap ${className}`}>
      {/* Flag */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 flex-shrink-0 overflow-hidden">
        {flagImageUrl ? (
          <img 
            src={flagImageUrl} 
            alt="Spanish flag" 
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xl">{flagEmoji}</span>
        )}
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1.5 text-white flex-shrink-0">
        <Flame className="h-5 w-5 fill-current text-orange-500" />
        <span className="text-base font-extrabold">{stats.current_streak}</span>
      </div>

      {/* Gems */}
      <div className="flex items-center gap-1.5 text-white flex-shrink-0">
        <Gem className="h-5 w-5 fill-current text-blue-500" />
        <span className="text-base font-extrabold">{stats.gems}</span>
      </div>

      {/* Hearts */}
      <div className="flex items-center gap-1.5 text-white flex-shrink-0">
        <Heart className="h-5 w-5 fill-current text-red-500" />
        <span className="text-base font-extrabold">{stats.hearts}</span>
      </div>

      {/* XP */}
      <div className="flex items-center gap-1.5 text-white flex-shrink-0">
        <Zap className="h-5 w-5 fill-current text-yellow-500" />
        <span className="text-base font-extrabold">{stats.total_xp}</span>
      </div>
    </div>
  );
}
