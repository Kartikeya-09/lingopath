"use client";

import React from 'react';
import { useToastStore } from '@/components/ui/Toast';
import { Dumbbell, Clock3, BookOpenText, AlertTriangle, ChevronRight } from 'lucide-react';

const practiceCards = [
  {
    id: 'mistakes',
    title: 'Mistakes',
    description: 'Practice the exercises you got wrong',
    icon: AlertTriangle,
    squareClass: 'bg-[#ff5e5e]',
  },
  {
    id: 'timed',
    title: 'Timed Challenge',
    description: 'Race against the clock to earn extra XP',
    icon: Clock3,
    squareClass: 'bg-[#4da6ff]',
  },
  {
    id: 'stories',
    title: 'Stories',
    description: 'Learn through fun, interactive stories',
    icon: BookOpenText,
    squareClass: 'bg-[#b06ef8]',
  },
];

export default function PracticePage() {
  const addToast = useToastStore((s) => s.addToast);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 pb-32 text-[var(--duo-text)]">
      <div className="flex items-center justify-center gap-4 mb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b574ff]/15 text-[#c783ff] ring-1 ring-[#b574ff]/40">
          <Dumbbell className="h-7 w-7" />
        </div>
        <h1 className="text-[clamp(2rem,3vw,3rem)] font-extrabold tracking-tight">Practice</h1>
      </div>
      <p className="text-center text-lg font-bold text-[var(--duo-text-soft)] mb-8">Practice makes perfect!</p>

      <div className="mx-auto max-w-[720px] space-y-5">
        {practiceCards.map((card) => (
          <button
            key={card.id}
            onClick={() => addToast('Coming soon! 🚧', 'info')}
            className="group flex w-full items-center rounded-[28px] border-2 border-white/10 bg-white/95 p-5 text-left text-slate-800 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`mr-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] ${card.squareClass}`}>
              <card.icon className="h-8 w-8 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-[1.05rem] font-extrabold leading-tight text-slate-800">{card.title}</h3>
              <p className="mt-1 text-sm font-bold text-slate-500">{card.description}</p>
            </div>

            <div className="ml-3 shrink-0 text-slate-300 transition-colors group-hover:text-slate-400">
              <ChevronRight className="h-7 w-7" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
