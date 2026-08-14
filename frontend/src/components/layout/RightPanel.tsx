import React from 'react';
import { useStats, useLeaderboard, useQuests, useCoursePath } from '@/lib/hooks';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Flame, Trophy, Target, ChevronRight, Gem, Heart, Zap } from 'lucide-react';
import Link from 'next/link';

export function RightPanel() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: leaderboard } = useLeaderboard();
  const { data: quests } = useQuests();
  const { data: course } = useCoursePath(1);

  const topThree = leaderboard?.slice(0, 3) ?? [];
  const activeQuests = quests?.filter(q => !q.claimed).slice(0, 2) ?? [];
  const flagEmoji = course?.flag_emoji || '🇪🇸'; // Default to Spanish flag if course data not available
  const flagImageUrl = course?.flag_image_url;

  return (
    <div className="hidden xl:flex flex-col w-[340px] h-screen fixed right-0 top-0 p-6 pt-8 overflow-y-auto space-y-6 bg-[var(--duo-bg)]">
      {/* Stats Header */}
      {statsLoading ? (
        <div className="flex items-center justify-end gap-5 whitespace-nowrap">
          <SkeletonLoader className="h-8 w-8 rounded-full overflow-hidden" />
          <SkeletonLoader className="h-6 w-8" />
          <SkeletonLoader className="h-6 w-8" />
          <SkeletonLoader className="h-6 w-8" />
          <SkeletonLoader className="h-6 w-8" />
        </div>
      ) : stats ? (
        <div className="flex items-center justify-end gap-5 whitespace-nowrap">
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
      ) : null}

      <div className="rounded-[26px] border border-white/10 bg-[var(--duo-card)] p-4 shadow-sm">
        <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">
          SUPER
        </div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex-1 text-[1.8rem] font-extrabold leading-tight text-white">
            Try Super for free
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-cyan-400 shadow-lg shadow-cyan-500/20">
            <div className="h-10 w-10 rounded-full border-4 border-white/80 bg-white/10" />
          </div>
        </div>
        <p className="mb-5 text-base font-bold leading-relaxed text-[var(--duo-text-soft)]">
          No ads, personalized practice, and unlimited Legendary!
        </p>
        <button className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-center text-lg font-extrabold uppercase tracking-wide text-white shadow-lg shadow-indigo-900/25 transition-transform hover:scale-[1.01]">
          Try 1 week free
        </button>
      </div>

      {/* Streak Card */}
      {stats && (
        <div className="bg-[var(--duo-card)] border-2 border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-[var(--duo-text)]">Streak</h3>
            <div className="flex items-center space-x-1">
              <Flame className="w-6 h-6 text-orange-500 fill-current" />
              <span className="text-2xl font-extrabold text-orange-500">{stats.current_streak}</span>
            </div>
          </div>
          <div className="flex justify-between">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 ${
                  i < (stats.current_streak % 7) 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/10 text-[var(--duo-text-muted)]'
                }`}>
                  {i < (stats.current_streak % 7) ? (
                    <Flame className="w-5 h-5 fill-current" />
                  ) : null}
                </div>
                <span className="text-xs font-bold text-[var(--duo-text-muted)]">{day}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Preview */}
      <div className="bg-[var(--duo-card)] border-2 border-white/10 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-[var(--duo-text)]">Leaderboard</h3>
          <Link href="/leaderboard" className="text-[#5ec3ff] font-bold text-sm flex items-center hover:text-[#7ed1ff]">
            VIEW ALL <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {topThree.map((entry) => (
            <div key={entry.rank} className={`flex items-center space-x-3 p-2 rounded-xl ${entry.is_current_user ? 'bg-[#1f8ad6]/10' : ''}`}>
              <span className="w-6 text-center font-extrabold text-[var(--duo-text-muted)]">{entry.rank}</span>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {entry.username.slice(0, 2).toUpperCase()}
              </div>
              <span className={`font-bold flex-1 truncate ${entry.is_current_user ? 'text-[#dff4ff]' : 'text-[var(--duo-text-soft)]'}`}>
                {entry.username}
              </span>
              <span className="text-[var(--duo-text-muted)] font-bold text-sm">{entry.total_xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Quests Preview */}
      <div className="bg-[var(--duo-card)] border-2 border-white/10 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-[var(--duo-text)]">Daily Quests</h3>
          <Link href="/quests" className="text-[#5ec3ff] font-bold text-sm flex items-center hover:text-[#7ed1ff]">
            VIEW ALL <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {activeQuests.map((quest) => {
            const percent = quest.target_value > 0 ? (quest.current_value / quest.target_value) * 100 : 0;
            return (
              <div key={quest.id} className="p-3 bg-white/5 rounded-xl">
                <p className="font-bold text-[var(--duo-text-soft)] text-sm mb-2">{quest.title}</p>
                <div className="flex items-center space-x-2">
                  <ProgressBar value={percent} className="h-3 flex-1" indicatorClassName="bg-yellow-500" />
                  <span className="text-xs font-bold text-[var(--duo-text-muted)] shrink-0">{quest.current_value}/{quest.target_value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
