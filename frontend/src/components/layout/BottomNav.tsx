import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Target, Store, User, Dumbbell } from 'lucide-react';

const navItems = [
  { href: '/learn', icon: Home },
  { href: '/practice', icon: Dumbbell },
  { href: '/leaderboard', icon: Trophy },
  { href: '/quests', icon: Target },
  { href: '/shop', icon: Store },
  { href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--duo-panel)] border-t-2 border-white/10 flex items-center justify-around p-2 pb-4 z-40">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`p-3 rounded-xl transition-all ${
              isActive ? 'bg-[#1f8ad6]/20 text-[#dff4ff] border-2 border-[#1f8ad6]/30' : 'text-[var(--duo-text-muted)] border-2 border-transparent'
            }`}
          >
            <item.icon className="w-7 h-7" />
          </Link>
        );
      })}
    </div>
  );
}
