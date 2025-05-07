"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { totalRankedReplaysAtom, totalUnrankedReplaysAtom, totalPlayersAtom } from '@/app/state/atoms/tekkenStatsAtoms';
import { SearchBar } from '@/components/SearchBar';
import { usePolarisId } from '@/lib/hooks/usePolarisId';
import { AnimatePresence, motion } from 'framer-motion';



const useAnimatedCounter = (endValue: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (endValue === 0) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * endValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [endValue, duration]);

  return count;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export function Header() {
  const [totalRankedReplays] = useAtom(totalRankedReplaysAtom);
  const [totalUnrankedReplays] = useAtom(totalUnrankedReplaysAtom);
  const [totalPlayers] = useAtom(totalPlayersAtom);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [storedPolarisId, setStoredPolarisId] = useState<string | null>(null);
  const { polarisId } = usePolarisId();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("polarisId");
    if (id) setStoredPolarisId(id);
  }, []);

  const animatedPlayers = useAnimatedCounter(totalPlayers, 2000);
  const animatedReplays = useAnimatedCounter(totalRankedReplays, 2000);
  const animatedUnrankedReplays = useAnimatedCounter(totalUnrankedReplays, 2000);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  // eslint-disable-next-line
  const goToProfile = () => {
    if (storedPolarisId) router.push(`/player/${storedPolarisId}`);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg z-50">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center space-x-4 md:space-x-8">
              <Link href="/" className="font-russo-one text-xl md:text-2xl text-white whitespace-nowrap flex items-center">
                <div className="relative" style={{ width: '40px', height: '40px', marginRight: '8px' }}>
                  <Image 
                    src="/static/EWGF_ICON@2x.png" 
                    alt="EWGF Logo" 
                    fill
                    className="object-contain"
                    style={{ transform: 'scale(1.7)' }}
                  />
                </div>
                ewgf<span className="text-blue-400 dark:text-blue-500">.gg</span>
              </Link>
              <div className="flex space-x-3 md:space-x-6">
                <Link href="/statistics" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors text-xs md:text-sm font-semibold">
                  Statistics
                </Link>
                <Link href="/about" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors text-xs md:text-sm font-semibold">
                  About
                </Link>
                <div className="w-[100px] flex justify-end">
                  <AnimatePresence>
                    {polarisId && (
                      <motion.button
                        key="my-profile"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => router.push(`/player/${polarisId}`)}
                        className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-300 dark:from-purple-500 dark:to-pink-400 bg-clip-text text-transparent font-mono"
                      >
                        My Profile
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex md:hidden flex-col ml-4">
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mr-1">Players:</span>
                  <span className="text-xs font-bold bg-gradient-to-r from-blue-400 to-cyan-300 dark:from-blue-500 dark:to-cyan-400 bg-clip-text text-transparent font-mono">
                    {formatNumber(animatedPlayers)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mr-1">Ranked:</span>
                  <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-pink-300 dark:from-purple-500 dark:to-pink-400 bg-clip-text text-transparent font-mono">
                    {formatNumber(animatedReplays)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mr-1">Unranked:</span>
                  <span className="text-xs font-bold bg-gradient-to-r from-green-400 to-teal-300 dark:from-green-500 dark:to-teal-400 bg-clip-text text-transparent font-mono">
                    {formatNumber(animatedUnrankedReplays)}
                  </span>
                </div>
              </div>

              {mounted && (
                <button onClick={toggleTheme} className="md:hidden p-2 ml-3 rounded-lg bg-gray-700 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out" aria-label="Toggle theme">
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-yellow-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <SearchBar />
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Players</span>
                <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-cyan-300 dark:from-blue-500 dark:to-cyan-400 bg-clip-text text-transparent font-mono">
                  {formatNumber(animatedPlayers)}
                </span>
              </div>
              <div className="h-8 w-px bg-gray-700 dark:bg-gray-600" />
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Ranked</span>
                <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-300 dark:from-purple-500 dark:to-pink-400 bg-clip-text text-transparent font-mono">
                  {formatNumber(animatedReplays)}
                </span>
              </div>
              <div className="h-8 w-px bg-gray-700 dark:bg-gray-600" />
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Unranked</span>
                <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-teal-300 dark:from-green-500 dark:to-teal-400 bg-clip-text text-transparent font-mono">
                  {formatNumber(animatedUnrankedReplays)}
                </span>
              </div>
              {/* {storedPolarisId && <div className="h-8 w-px bg-gray-700 dark:bg-gray-600" />}
              {storedPolarisId && (
                <div className="flex flex-col items-end">
                  <button onClick={goToProfile} className="text-sm text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
                    My Profile
                  </button>
                </div>
              )} */}
              <div className="h-8 w-px bg-gray-700 dark:bg-gray-600" />
              {mounted && (
                <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Toggle theme">
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </nav>
        <div className="md:hidden w-full px-4 py-2 bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
          <SearchBar />
        </div>
      </header>
      <div className="h-24 md:h-16"></div>
    </>
  );
}