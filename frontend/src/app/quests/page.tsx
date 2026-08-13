"use client";

import React, { useState } from 'react';
import { useQuests } from '@/lib/hooks';
import { apiRequest } from '@/lib/api';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { useToastStore } from '@/components/ui/Toast';
import { Target, Zap, Gem, Check, Circle } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

export default function QuestsPage() {
  const { data: quests, isLoading } = useQuests();
  const addToast = useToastStore((s) => s.addToast);
  const [claiming, setClaiming] = useState<number | null>(null);

  const handleClaim = async (questId: number) => {
    setClaiming(questId);
    try {
      const result = await apiRequest<{ xp_reward: number; gem_reward: number }>(`/quests/${questId}/claim`, { method: 'POST' });
      addToast(`Claimed ${result.xp_reward} XP and ${result.gem_reward} gems!`, 'success');
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    } catch {
      addToast('Failed to claim quest', 'error');
    } finally {
      setClaiming(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[760px] p-6 pb-32">
        <div className="mb-8 flex items-center justify-center gap-4">
          <SkeletonLoader className="h-10 w-10 rounded-full" />
          <SkeletonLoader className="h-8 w-52 rounded-xl" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonLoader key={i} className="mb-4 h-28 w-full rounded-[28px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[760px] px-6 py-8 pb-32 text-[var(--duo-text)]">
      <div className="mb-8 flex items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff8a38]/15 text-[#ff8a38] ring-1 ring-[#ff8a38]/30">
          <Target className="h-7 w-7" />
        </div>
        <div className="text-center">
          <h1 className="text-[clamp(2rem,3vw,2.8rem)] font-extrabold tracking-tight">Daily Quests</h1>
          <p className="text-base font-bold text-[var(--duo-text-soft)]">Complete quests to earn rewards</p>
        </div>
      </div>

      <div className="mx-auto max-w-[700px] space-y-5">
        {quests?.map((quest) => {
          const percent = quest.target_value > 0 ? (quest.current_value / quest.target_value) * 100 : 0;
          const many = Math.min(percent, 100);

          return (
            <div key={quest.id} className="rounded-[28px] border-2 border-white/10 bg-white/95 p-5 text-slate-800 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f4f4] text-slate-500">
                    {quest.completed ? <Check className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-[1.15rem] font-extrabold text-slate-800">{quest.title}</h3>
                    {quest.description && <p className="text-sm font-bold text-slate-500">{quest.description}</p>}
                  </div>
                </div>
                {quest.claimed && (
                  <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-green-600">
                    Claimed
                  </div>
                )}
              </div>

              <div className="mb-4 flex items-center justify-between text-xs font-extrabold text-slate-500">
                <span>
                  {quest.current_value} / {quest.target_value}
                </span>
                <span>{Math.round(many)}%</span>
              </div>

              <div className="mb-4">
                <ProgressBar
                  value={many}
                  className="h-4 rounded-full bg-slate-200"
                  indicatorClassName={quest.completed ? 'bg-[#62d163]' : 'bg-[#f4c94b]'}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-600">
                  {quest.xp_reward > 0 && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 fill-current text-yellow-500" />
                      <span>{quest.xp_reward} XP</span>
                    </div>
                  )}
                  {quest.gem_reward > 0 && (
                    <div className="flex items-center gap-2">
                      <Gem className="h-5 w-5 fill-current text-blue-500" />
                      <span>{quest.gem_reward}</span>
                    </div>
                  )}
                </div>

                {quest.completed && !quest.claimed && (
                  <button
                    onClick={() => handleClaim(quest.id)}
                    disabled={claiming === quest.id}
                    className="rounded-xl border-b-4 border-green-700 bg-green-500 px-5 py-2 text-sm font-extrabold uppercase tracking-wide text-white transition-all hover:bg-green-600 active:border-b-0 active:translate-y-1"
                  >
                    {claiming === quest.id ? 'Claiming...' : 'Claim'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
