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
      // The heart that just disappeared should shake before it disappears?
      // Or the remaining hearts shake? Let's just shake the whole container for simplicity,
      // but to follow requirement "animate shake on removal", we can animate the container.
      setShakingIndex(count);
      const timer = setTimeout(() => setShakingIndex(null), 500);
      return () => clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  return (
    <div className="flex items-center space-x-1">
      <span className="mr-2 font-bold text-red-500">{count}</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <Heart 
          key={i} 
          className={cn(
            "w-6 h-6 transition-colors duration-300", 
            i < count ? "text-red-500 fill-current" : "text-gray-300",
            i === shakingIndex ? "animate-[shake_0.5s_ease-in-out]" : ""
          )} 
        />
      ))}
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
