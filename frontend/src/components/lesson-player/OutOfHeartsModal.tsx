import React from 'react';
import { HeartCrack } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function OutOfHeartsModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-[400px] w-full flex flex-col items-center text-center animate-in zoom-in-95">
        <HeartCrack className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">You ran out of hearts!</h2>
        <p className="text-gray-500 mb-8">
          Don't worry, they will refill over time. You can also practice to earn more or refill them in the shop.
        </p>
        <button
          onClick={() => router.push('/learn')}
          className="w-full py-4 rounded-2xl bg-blue-400 hover:bg-blue-500 border-b-4 border-blue-600 text-white font-bold text-lg transition-all"
        >
          BACK TO LEARNING PATH
        </button>
      </div>
    </div>
  );
}
