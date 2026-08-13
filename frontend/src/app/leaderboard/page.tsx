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
    if (rank === 1) return 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm';
    if (rank === 2) return 'border-slate-400/50 bg-gradient-to-br from-slate-400/20 to-slate-500/20 backdrop-blur-sm';
    if (rank === 3) return 'border-orange-400/50 bg-gradient-to-br from-orange-400/20 to-amber-500/20 backdrop-blur-sm';
    return 'border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-7 w-7 fill-current text-yellow-400" />;
    if (rank === 2) return <Medal className="h-7 w-7 fill-current text-slate-300" />;
    if (rank === 3) return <Medal className="h-7 w-7 fill-current text-orange-400" />;
    return <span className="flex h-7 w-7 items-center justify-center text-lg font-extrabold text-slate-500">{rank}</span>;
  };

  return (
    <div className="mx-auto max-w-[760px] px-6 py-8 pb-32 text-white">
      <div className="mb-8 flex items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-400/30">
          <Trophy className="h-7 w-7 fill-current" />
        </div>
        <div className="text-center">
          <h1 className="text-[clamp(2rem,3vw,2.8rem)] font-extrabold tracking-tight">Leaderboard</h1>
          <p className="text-base font-bold text-slate-400">Bronze League</p>
        </div>
      </div>

      <div className="mx-auto max-w-[620px] space-y-3">
        {leaderboard?.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center rounded-[24px] border-2 px-4 py-3 shadow-sm transition-all ${getRankStyle(entry.rank)} ${
              entry.is_current_user ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#1a1a1a]' : ''
            }`}
          >
            <div className="mr-4 flex w-8 items-center justify-center shrink-0 text-slate-400">{getRankIcon(entry.rank)}</div>

            <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-green-600 text-lg font-extrabold text-white ring-2 ring-green-400/50">
              {entry.avatar_url ? (
                <img src={entry.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                getInitials(entry.username)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className={`truncate text-lg font-extrabold ${entry.is_current_user ? 'text-cyan-400' : 'text-white'}`}>
                {entry.username}
              </p>
            </div>

            <div className="ml-3 flex shrink-0 items-center gap-2 text-slate-300">
              <Zap className="h-5 w-5 fill-current text-yellow-400" />
              <span className="text-lg font-extrabold">{entry.total_xp.toLocaleString()}</span>
              <span className="text-sm font-bold text-slate-500">XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
