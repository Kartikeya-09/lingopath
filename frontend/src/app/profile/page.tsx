"use client";

import React from 'react';
import { useAchievements } from '@/lib/hooks';
import { apiRequest } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { UserOut } from '@/types/api';
import { AchievementTile } from '@/components/shared/AchievementTile';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Flame, Zap, Heart, Gem, Trophy, Calendar, Pencil } from 'lucide-react';

export default function ProfilePage() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => apiRequest<UserOut>('/users/me'),
  });
  const { data: achievements, isLoading: achLoading } = useAchievements();

  if (userLoading) {
    return (
      <div className="mx-auto max-w-[900px] p-6 pb-32">
        <SkeletonLoader className="mx-auto mb-6 h-[220px] w-full max-w-[760px] rounded-[28px]" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-32 w-full rounded-[24px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;
  const stats = user.stats;

  return (
    <div className="mx-auto max-w-[980px] px-6 py-8 pb-32 text-[var(--duo-text)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="relative mx-auto max-w-[760px] rounded-[28px] bg-[#f7dce0] p-6 text-slate-800 shadow-sm lg:mx-0">
            <button className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-[16px] border-2 border-white/80 bg-white/40 text-slate-700">
              <Pencil className="h-5 w-5" />
            </button>

            <div className="flex justify-center py-4">
              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-[#eeefef] text-[3rem] font-extrabold text-slate-700 ring-8 ring-[#f3d6db]">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center lg:text-left">
            <h1 className="text-[clamp(2.2rem,3vw,3.2rem)] font-extrabold tracking-tight">{user.username}</h1>
            <p className="text-xl font-bold text-[var(--duo-text-soft)]">{user.email}</p>
            <p className="mt-2 text-base font-bold text-[var(--duo-text-muted)]">Joined recently</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-[var(--duo-text-soft)]">
            <span className="text-base font-bold">3 Following</span>
            <span className="text-base font-bold">6 Followers</span>
          </div>

          {stats && (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-[24px] bg-[#f9e8d0] p-5 text-slate-800">
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#ff9d2f]">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold">{stats.current_streak}</div>
                  <div className="text-sm font-bold text-slate-600">Day streak</div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-[24px] bg-[#f6f0b3] p-5 text-slate-800">
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#f5c01b]">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold">{stats.total_xp.toLocaleString()}</div>
                  <div className="text-sm font-bold text-slate-600">Total XP</div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-[24px] bg-[#f8d9d5] p-5 text-slate-800">
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#ff5a5a]">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold">{stats.hearts}</div>
                  <div className="text-sm font-bold text-slate-600">Hearts</div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-[24px] bg-[#dfeefb] p-5 text-slate-800">
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#2d9af2]">
                  <Gem className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold">{stats.gems}</div>
                  <div className="text-sm font-bold text-slate-600">Gems</div>
                </div>
              </div>
            </div>
          )}

          {stats && (
            <div className="mt-8 flex items-center justify-between rounded-[24px] border-2 border-white/10 bg-white/95 px-6 py-5 text-slate-800 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl font-extrabold">Longest streak</div>
                  <div className="text-sm font-bold text-slate-500">{stats.longest_streak} days</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-orange-500">
                <Flame className="h-7 w-7 fill-current" />
                <span className="text-3xl font-extrabold">{stats.longest_streak}</span>
              </div>
            </div>
          )}
        </div>

        <aside className="w-full max-w-[360px] rounded-[28px] border-2 border-white/10 bg-[#0f1e2d]/70 p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
            <button className="text-lg font-extrabold text-[var(--duo-text)]">Following</button>
            <button className="text-lg font-extrabold text-[var(--duo-text-soft)]">Followers</button>
          </div>

          <div className="space-y-4">
            {[
              ['Vivek Sudrik', '37294 XP'],
              ['Shobhit Jindakur', '9577 XP'],
              ['Giriraj sharma', '1443 XP'],
            ].map(([name, xp]) => (
              <div key={name} className="flex items-center gap-3 rounded-xl p-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-lg font-extrabold text-white">
                  {name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-lg font-extrabold text-[var(--duo-text)]">{name}</div>
                  <div className="text-sm font-bold text-[var(--duo-text-muted)]">{xp}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-10">
        <div className="mb-6 flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h2 className="text-[clamp(1.5rem,2vw,2rem)] font-extrabold tracking-tight">Achievements</h2>
        </div>

        {achLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-36 w-full rounded-[24px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {achievements?.map((ach) => (
              <AchievementTile key={ach.id} achievement={ach} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
