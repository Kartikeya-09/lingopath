import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Target, Store, User, MoreHorizontal, Dumbbell } from 'lucide-react';

const navItems = [
  { href: '/learn', label: 'LEARN', icon: Home, color: '#FF4B4B' },
  { href: '/practice', label: 'PRACTICE', icon: Dumbbell, color: '#1CB0F6' },
  { href: '/leaderboard', label: 'LEADERBOARDS', icon: Trophy, color: '#FFC800' },
  { href: '/quests', label: 'QUESTS', icon: Target, color: '#FFC800' },
  { href: '/shop', label: 'SHOP', icon: Store, color: '#FF4B4B' },
  { href: '/profile', label: 'PROFILE', icon: User, color: '#1CB0F6' },
  { href: '/settings', label: 'MORE', icon: MoreHorizontal, color: '#CE82FF' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-[250px] min-w-[250px] h-screen border-r border-white/10 fixed left-0 top-0 bg-[#111f24]">
      {/* Logo */}
      <Link href="/learn" className="ml-[30px] mt-[24px] mb-[35px]">
        <h1 className="text-[#58CC02] text-[26px] font-extrabold tracking-tight">duolingo</h1>
      </Link>
      
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-[2px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/learn' && (pathname === '/' || pathname === '/learn'));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`mx-3 flex items-center gap-[18px] h-[58px] px-[18px] rounded-xl border-2 transition-all hover:bg-white/4 ${
                isActive 
                  ? 'bg-white/4 border-[#49b9df] text-white' 
                  : 'bg-transparent border-transparent text-[#f1f4f5]'
              }`}
            >
              <item.icon 
                className="w-[28px] h-[28px] flex-shrink-0" 
                style={{ color: item.color }}
              />
              <span className="text-[14px] font-bold tracking-[0.5px] uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
