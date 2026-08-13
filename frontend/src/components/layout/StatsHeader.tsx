import React from 'react';
import { Flame, Zap, Gem, Heart } from 'lucide-react';
import { useStats } from '@/lib/hooks';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

export function StatsHeader() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b-2 border-gray-200">
        <SkeletonLoader className="w-16 h-8" />
        <SkeletonLoader className="w-16 h-8" />
        <SkeletonLoader className="w-16 h-8" />
        <SkeletonLoader className="w-16 h-8" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[var(--duo-bg)] w-full max-w-[1000px] mx-auto">
      <div className="flex items-center space-x-1 hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-colors">
        <Flame className="w-6 h-6 text-orange-500 fill-current" />
        <span className="font-bold text-[var(--duo-text-soft)]">{stats.current_streak}</span>
      </div>
      <div className="flex items-center space-x-1 hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-colors">
        <Gem className="w-6 h-6 text-blue-400 fill-current" />
        <span className="font-bold text-[var(--duo-text-soft)]">{stats.gems}</span>
      </div>
      <div className="flex items-center space-x-1 hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-colors">
        <Zap className="w-6 h-6 text-yellow-500 fill-current" />
        <span className="font-bold text-[var(--duo-text-soft)]">{stats.total_xp}</span>
      </div>
      <div className="flex items-center space-x-1 hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-colors">
        <Heart className="w-6 h-6 text-red-500 fill-current" />
        <span className="font-bold text-[var(--duo-text-soft)]">{stats.hearts}</span>
      </div>
    </div>
  );
}
