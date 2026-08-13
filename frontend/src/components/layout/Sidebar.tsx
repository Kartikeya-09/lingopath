import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Target, Store, User, Settings, Dumbbell } from 'lucide-react';
import { useStats } from '@/lib/hooks';
import { ProgressBar } from '@/components/ui/ProgressBar';

const navItems = [
  { href: '/learn', label: 'LEARN', icon: Home },
  { href: '/practice', label: 'PRACTICE', icon: Dumbbell },
  { href: '/leaderboard', label: 'LEADERBOARD', icon: Trophy },
  { href: '/quests', label: 'QUESTS', icon: Target },
  { href: '/shop', label: 'SHOP', icon: Store },
  { href: '/profile', label: 'PROFILE', icon: User },
  { href: '/settings', label: 'SETTINGS', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: stats } = useStats();

  return (
    <div className="hidden lg:flex flex-col w-[256px] h-screen border-r-2 border-white/10 fixed left-0 top-0 bg-[var(--duo-sidebar)] p-4">
      <Link href="/learn" className="mb-8 pl-4">
        <h1 className="text-3xl font-extrabold text-green-500 tracking-tight">duolingo</h1>
      </Link>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center space-x-4 p-3 rounded-xl border-2 border-transparent transition-all hover:bg-white/5 ${
                isActive ? 'bg-[#1f8ad6]/20 border-[#1f8ad6]/30 text-[#dff4ff]' : 'text-[var(--duo-text-soft)]'
              }`}
            >
              <item.icon className="w-8 h-8" />
              <span className="font-bold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {stats && (
        <div className="mt-auto p-4 border-2 border-white/10 rounded-2xl bg-[var(--duo-panel)] shadow-sm">
          <h3 className="font-bold text-[var(--duo-text)] mb-2">Daily Goal</h3>
          <div className="flex items-center justify-between mb-1 text-sm font-bold text-[var(--duo-text-soft)]">
            <span>{stats.daily_xp} / {stats.daily_goal} XP</span>
          </div>
          <ProgressBar 
            value={(stats.daily_xp / stats.daily_goal) * 100} 
            indicatorClassName="bg-yellow-500"
          />
          {stats.daily_xp >= stats.daily_goal && (
            <p className="text-green-500 font-bold text-sm mt-2 text-center animate-pulse">
              Goal Reached!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
