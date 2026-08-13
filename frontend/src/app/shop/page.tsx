"use client";

import React, { useState } from 'react';
import { useStats } from '@/lib/hooks';
import { apiRequest } from '@/lib/api';
import { useToastStore } from '@/components/ui/Toast';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { queryClient } from '@/lib/queryClient';
import { Store, Heart, Gem, Snowflake, Zap } from 'lucide-react';

interface ShopItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gemCost: number;
  action: (() => Promise<void>) | null;
}

export default function ShopPage() {
  const { data: stats, isLoading } = useStats();
  const addToast = useToastStore((s) => s.addToast);
  const [buying, setBuying] = useState<string | null>(null);

  const handleRefillHearts = async () => {
    setBuying('heart-refill');
    try {
      await apiRequest('/hearts/refill', { method: 'POST' });
      addToast('Hearts refilled to 5!', 'success');
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    } catch {
      addToast('Failed to refill hearts', 'error');
    } finally {
      setBuying(null);
    }
  };

  const items: ShopItem[] = [
    {
      id: 'heart-refill',
      title: 'Heart Refill',
      description: 'Refill your hearts back to 5',
      icon: <Heart className="h-10 w-10 fill-current text-red-500" />,
      gemCost: 350,
      action: handleRefillHearts,
    },
    {
      id: 'streak-freeze',
      title: 'Streak Freeze',
      description: 'Allows your streak to remain in place for one day of inactivity',
      icon: <Snowflake className="h-10 w-10 text-blue-400" />,
      gemCost: 200,
      action: null,
    },
    {
      id: 'double-or-nothing',
      title: 'Double or Nothing',
      description: 'Attempt to double your 50 gem wager by maintaining a 7 day streak',
      icon: <Gem className="h-10 w-10 fill-current text-purple-500" />,
      gemCost: 50,
      action: null,
    },
    {
      id: 'xp-boost',
      title: 'XP Boost',
      description: 'Earn double XP for 15 minutes',
      icon: <Zap className="h-10 w-10 fill-current text-yellow-500" />,
      gemCost: 100,
      action: null,
    },
  ];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[760px] p-6 pb-32">
        <div className="mb-8 flex items-center justify-between">
          <SkeletonLoader className="h-10 w-36 rounded-xl" />
          <SkeletonLoader className="h-12 w-24 rounded-xl" />
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
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b574ff]/15 text-[#c783ff] ring-1 ring-[#b574ff]/40">
          <Store className="h-7 w-7" />
        </div>
        <h1 className="text-[clamp(2rem,3vw,2.8rem)] font-extrabold tracking-tight">Shop</h1>
        <div className="ml-10 flex items-center gap-2 rounded-xl bg-[#f7f7f7] px-4 py-2 text-slate-800 shadow-sm">
          <Gem className="h-6 w-6 fill-current text-blue-500" />
          <span className="text-xl font-extrabold">{stats?.gems ?? 0}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[700px] space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center rounded-[28px] border-2 border-white/10 bg-white/95 p-5 text-slate-800 shadow-sm">
            <div className="mr-5 flex h-20 w-20 shrink-0 items-center justify-center rounded-[20px] bg-[#f3f3f3] ring-1 ring-slate-200">
              {item.icon}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-[1.15rem] font-extrabold text-slate-800">{item.title}</h3>
              <p className="mt-1 text-sm font-bold text-slate-500">{item.description}</p>
            </div>

            <button
              onClick={() => (item.action ? item.action() : addToast('Coming soon!', 'info'))}
              disabled={buying === item.id}
              className="ml-4 shrink-0 rounded-[18px] bg-[#2e9af7] px-5 py-3 text-lg font-extrabold text-white shadow-sm ring-1 ring-blue-500/20 transition-all hover:bg-[#1d8cf0] active:translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                <Gem className="h-5 w-5 fill-current" />
                {buying === item.id ? '...' : item.gemCost}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
