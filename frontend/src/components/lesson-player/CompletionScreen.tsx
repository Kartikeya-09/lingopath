import React from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Zap, Flame } from 'lucide-react';
import { CompleteResponse } from '@/types/api';

interface CompletionScreenProps {
  result: CompleteResponse;
}

export function CompletionScreen({ result }: CompletionScreenProps) {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[700px] flex-col items-center justify-center bg-[var(--duo-bg)] px-4 py-8 text-center text-[var(--duo-text)]">
      <div className="animate-in zoom-in-95 flex w-full flex-1 flex-col items-center justify-center duration-500">
        <h1 className="mb-8 text-4xl font-extrabold uppercase tracking-wide text-yellow-500 md:text-5xl">
          Lesson Complete!
        </h1>

        <div className="mb-12 flex space-x-4">
          <div className="flex min-w-[120px] flex-col items-center rounded-2xl border-b-4 border-yellow-500 bg-yellow-400 p-6">
            <h3 className="mb-2 text-sm font-bold uppercase text-yellow-100">Total XP</h3>
            <div className="flex items-center text-3xl font-extrabold text-white">
              <Zap className="mr-2 h-8 w-8 fill-current" />
              {result.total_xp}
            </div>
            <div className="mt-2 text-sm font-bold text-yellow-100">+{result.xp_earned} XP</div>
          </div>

          <div className="flex min-w-[120px] flex-col items-center rounded-2xl border-b-4 border-orange-600 bg-orange-500 p-6">
            <h3 className="mb-2 text-sm font-bold uppercase text-orange-200">Streak</h3>
            <div className="flex items-center text-3xl font-extrabold text-white">
              <Flame className="mr-2 h-8 w-8 fill-current" />
              {result.streak}
            </div>
          </div>
        </div>

        {result.perfect && (
          <div className="animate-bounce rounded-xl border-2 border-green-200 bg-green-100 px-6 py-3 font-bold text-green-600">
            Perfect Lesson Bonus: +5 XP
          </div>
        )}
      </div>

      <div className="w-full">
        <button
          onClick={() => router.push('/learn')}
          className="w-full rounded-2xl border-b-4 border-green-700 bg-green-500 py-4 text-xl font-bold text-white transition-all hover:bg-green-600"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
