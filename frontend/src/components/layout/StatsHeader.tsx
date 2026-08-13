import React from 'react';
import { Flame, Zap, Gem, Heart } from 'lucide-react';
import { useStats } from '@/lib/hooks';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

interface StatsHeaderProps {
  className?: string;
}

export function StatsHeader({ className = '' }: StatsHeaderProps) {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className={`flex items-center justify-between gap-2 ${className}`}>
        <SkeletonLoader className="h-10 w-20 rounded-xl" />
        <SkeletonLoader className="h-10 w-20 rounded-xl" />
        <SkeletonLoader className="h-10 w-20 rounded-xl" />
        <SkeletonLoader className="h-10 w-20 rounded-xl" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={`flex items-center justify-end gap-3 ${className}`}>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#f3f3f3] px-2 py-1.5 shadow-sm">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d8d8d8] bg-white text-[10px]">🇩🇪</div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#f3f3f3] px-2 py-1.5 shadow-sm">
        <Flame className="h-5 w-5 fill-current text-orange-500" />
        <span className="text-lg font-extrabold text-slate-800">{stats.current_streak}</span>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#f3f3f3] px-2 py-1.5 shadow-sm">
        <Gem className="h-5 w-5 fill-current text-blue-500" />
        <span className="text-lg font-extrabold text-slate-800">{stats.gems}</span>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#f3f3f3] px-2 py-1.5 shadow-sm">
        <Heart className="h-5 w-5 fill-current text-red-500" />
        <span className="text-lg font-extrabold text-slate-800">{stats.hearts}</span>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#f3f3f3] px-2 py-1.5 shadow-sm">
        <Zap className="h-5 w-5 fill-current text-yellow-500" />
        <span className="text-lg font-extrabold text-slate-800">{stats.total_xp}</span>
      </div>
    </div>
  );
}
