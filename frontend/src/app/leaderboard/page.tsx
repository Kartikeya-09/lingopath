"use client";

import React from 'react';
import { useLeaderboard } from '@/lib/hooks';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Trophy, Crown, Medal, Zap } from 'lucide-react';

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[760px] p-6 pb-32">
        <div className="mb-8 flex items-center justify-center gap-4">
          <SkeletonLoader className="h-10 w-10 rounded-full" />
          <SkeletonLoader className="h-8 w-48 rounded-xl" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonLoader key={i} className="mb-3 h-20 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'border-yellow-300 bg-[#f6efb2]';
    if (rank === 2) return 'border-slate-200 bg-[#f5f5f5]';
    if (rank === 3) return 'border-[#f1cda5] bg-[#f8e7d5]';
    return 'border-slate-200 bg-white';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-7 w-7 fill-current text-yellow-500" />;
    if (rank === 2) return <Medal className="h-7 w-7 fill-current text-slate-400" />;
    if (rank === 3) return <Medal className="h-7 w-7 fill-current text-orange-400" />;
    return <span className="flex h-7 w-7 items-center justify-center text-lg font-extrabold text-slate-400">{rank}</span>;
  };

  return (
    <div className="mx-auto max-w-[760px] px-6 py-8 pb-32 text-[var(--duo-text)]">
      <div className="mb-8 flex items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-400/30">
          <Trophy className="h-7 w-7 fill-current" />
        </div>
        <div className="text-center">
          <h1 className="text-[clamp(2rem,3vw,2.8rem)] font-extrabold tracking-tight">Leaderboard</h1>
          <p className="text-base font-bold text-[var(--duo-text-soft)]">Bronze League</p>
        </div>
      </div>

      <div className="mx-auto max-w-[620px] space-y-3">
        {leaderboard?.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center rounded-[24px] border-2 px-4 py-3 shadow-sm transition-all ${getRankStyle(entry.rank)} ${
              entry.is_current_user ? 'ring-2 ring-[#60c0ff] ring-offset-0' : ''
            }`}
          >
            <div className="mr-4 flex w-8 items-center justify-center shrink-0 text-slate-500">{getRankIcon(entry.rank)}</div>

            <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#47c26a] text-lg font-extrabold text-white ring-2 ring-[#5fe084]">
              {entry.avatar_url ? (
                <img src={entry.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                getInitials(entry.username)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className={`truncate text-lg font-extrabold ${entry.is_current_user ? 'text-[#2d6bb6]' : 'text-slate-800'}`}>
                {entry.username}
              </p>
            </div>

            <div className="ml-3 flex shrink-0 items-center gap-2 text-slate-700">
              <Zap className="h-5 w-5 fill-current text-yellow-500" />
              <span className="text-lg font-extrabold">{entry.total_xp.toLocaleString()}</span>
              <span className="text-sm font-bold text-slate-500">XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
