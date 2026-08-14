import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/cn';

interface HeartsCounterProps {
  count: number;
}

export function HeartsCounter({ count }: HeartsCounterProps) {
  const [prevCount, setPrevCount] = useState(count);
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (count < prevCount) {
      setShakingIndex(count);
      const timer = setTimeout(() => setShakingIndex(null), 500);
      return () => clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  return (
    <div className="flex items-center space-x-1">
      <Heart className="w-6 h-6 text-[#ff4b4b] fill-current" />
      <span className="font-bold text-[#ff4b4b]">{count}</span>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
      `}} />
    </div>
  );
}
