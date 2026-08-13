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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 max-w-[600px] mx-auto text-center w-full">
      <div className="w-full flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-500 mb-8 uppercase tracking-wide">
          Lesson Complete!
        </h1>
        
        <div className="flex space-x-4 mb-12">
          <div className="bg-yellow-400 p-6 rounded-2xl border-b-4 border-yellow-500 flex flex-col items-center min-w-[120px]">
            <h3 className="font-bold text-yellow-100 uppercase text-sm mb-2">Total XP</h3>
            <div className="flex items-center text-white font-extrabold text-3xl">
              <Zap className="w-8 h-8 fill-current mr-2" />
              {result.total_xp}
            </div>
            <div className="text-yellow-100 font-bold mt-2 text-sm">+{result.xp_earned} XP</div>
          </div>
          
          <div className="bg-orange-500 p-6 rounded-2xl border-b-4 border-orange-600 flex flex-col items-center min-w-[120px]">
            <h3 className="font-bold text-orange-200 uppercase text-sm mb-2">Streak</h3>
            <div className="flex items-center text-white font-extrabold text-3xl">
              <Flame className="w-8 h-8 fill-current mr-2" />
              {result.streak}
            </div>
          </div>
        </div>
        
        {result.perfect && (
          <div className="bg-green-100 text-green-600 px-6 py-3 rounded-xl font-bold border-2 border-green-200 animate-bounce">
            Perfect Lesson Bonus: +5 XP
          </div>
        )}
      </div>
      
      <div className="w-full">
        <button
          onClick={() => router.push('/learn')}
          className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 border-b-4 border-green-700 text-white font-bold text-xl transition-all"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
