"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { queryClient } from '@/lib/queryClient';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatsHeader } from '@/components/layout/StatsHeader';
import { RightPanel } from '@/components/layout/RightPanel';
import { Toaster } from '@/components/ui/Toast';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isLesson = pathname?.startsWith('/lesson');
  const isLearnPage = pathname === '/learn' || pathname === '/';
  const shouldShowRightPanel = !isLesson && (isLearnPage || ['/practice', '/leaderboard', '/quests', '/shop', '/profile'].includes(pathname ?? ''));

  return (
    <html lang="en">
      <head>
        <title>Duolingo Clone</title>
        <meta name="description" content="Learn languages for free with the Duolingo clone. Practice speaking, reading, and writing." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[var(--duo-bg)] text-[var(--duo-text)]" style={{ fontFamily: 'Nunito, sans-serif' }}>
        <QueryClientProvider client={queryClient}>
          {!isLesson && <Sidebar />}
          {shouldShowRightPanel && <RightPanel />}
          <div className={
            !isLesson
              ? `lg:ml-[250px] ${shouldShowRightPanel ? 'xl:mr-[340px]' : ''} pb-[80px] lg:pb-0`
              : ''
          }>
            {!isLesson && (
              <div className="sticky top-0 z-30 border-b-2 border-white/10 bg-[var(--duo-bg)] lg:hidden">
                <StatsHeader className="mx-auto w-full max-w-[1000px] px-4 py-3" />
              </div>
            )}
            <div className="mx-auto w-full max-w-[1100px]">
              <main className="min-h-screen">
                {children}
              </main>
            </div>
            {!isLesson && <BottomNav />}
          </div>
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  );
}
