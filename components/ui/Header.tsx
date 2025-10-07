"use client"

import React, { useState, useEffect, useRef } from 'react';
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

  // Scroll behavior state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("polarisId");
    if (id) setStoredPolarisId(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY.current;
      const scrollingDown = currentScrollY > lastScrollY.current;

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Show search bar when scrolling up, but not at the very top
      if (scrollingUp && currentScrollY > 100) {
        setIsSearchBarVisible(true);
        setIsHeaderVisible(false);
      } else if (scrollingDown && currentScrollY > 50) {
        // Hide both when scrolling down
        setIsSearchBarVisible(false);
        setIsHeaderVisible(false);
      } else if (currentScrollY <= 50) {
        // Show header when near top
        setIsHeaderVisible(true);
        setIsSearchBarVisible(false);
      }

      // Set a timeout to hide search bar after stopping scroll
      if (scrollingUp && currentScrollY > 100) {
        scrollTimeout.current = setTimeout(() => {
          setIsSearchBarVisible(false);
        }, 3000);
      }

      lastScrollY.current = currentScrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const animatedPlayers = useAnimatedCounter(totalPlayers, 2000);
  const animatedReplays = useAnimatedCounter(totalRankedReplays, 2000);
  const animatedUnrankedReplays = useAnimatedCounter(totalUnrankedReplays, 2000);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const navLinks = [
    { href: '/statistics', label: 'Statistics' },
    { href: '/leaderboards', label: 'Leaderboards' },
    { href: '/about', label: 'About' }
  ];

  return (
    <>
      {/* Main Header - Not fixed, at top of page */}
      <motion.header 
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-gray-800/95 dark:from-gray-950 dark:to-gray-900/95 backdrop-blur-sm shadow-xl z-50 border-b border-gray-700/50"
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link href="/" className="group flex items-center space-x-3 transition-transform hover:scale-105">
              <div className="relative w-10 h-10">
                <Image 
                  src="/static/EWGF_ICON@2x.png" 
                  alt="EWGF Logo" 
                  fill
                  className="object-contain group-hover:animate-pulse"
                />
              </div>
              <span className="font-russo-one text-2xl text-white">
                ewgf<span className="text-blue-400 dark:text-blue-500">.gg</span>
              </span>
            </Link>

            {/* Desktop Navigation - Modernized */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="relative px-6 py-2.5 text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white font-medium text-sm transition-all duration-300 group"
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-400 group-hover:w-3/4 transition-all duration-300" />
                </Link>
              ))}
              
              {/* My Profile Button with Animation */}
              <AnimatePresence>
                {polarisId && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/player/${polarisId}`)}
                    className="ml-4 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    My Profile
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Stats and Theme Toggle */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Animated Stats */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Active Players <span className="text-gray-500 normal-case">(30d)</span></p>
                  <p className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {formatNumber(animatedPlayers)}
                  </p>
                </div>
                <div className="w-px h-10 bg-gray-700" />
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Ranked Battles <span className="text-gray-500 normal-case">(30d)</span></p>
                  <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {formatNumber(animatedReplays)}
                  </p>
                </div>
                <div className="w-px h-10 bg-gray-700" />
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Unranked Battles <span className="text-gray-500 normal-case">(30d)</span></p>
                  <p className="text-lg font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                    {formatNumber(animatedUnrankedReplays)}
                  </p>
                </div>
              </div>

              {/* Theme Toggle Button */}
              {mounted && (
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme} 
                  className="p-3 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait">
                    {theme === 'dark' ? (
                      <motion.svg
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-5 h-5 text-yellow-300"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      </motion.svg>
                    ) : (
                      <motion.svg
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-5 h-5 text-gray-300"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              {mounted && (
                <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
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

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 flex flex-wrap items-center justify-between">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {polarisId && (
              <button
                onClick={() => router.push(`/player/${polarisId}`)}
                className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                My Profile
              </button>
            )}
          </div>
        </nav>

        {/* Integrated Search Bar for Desktop */}
        <div className="hidden md:block border-t border-gray-700/50 bg-gray-800/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden border-t border-gray-700/50 bg-gray-800/50 dark:bg-gray-900/50">
          <div className="px-4 py-3">
            <div className="max-w-md mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Floating Search Bar - Appears when scrolling up */}
      <AnimatePresence>
        {isSearchBarVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-gray-700/50"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2 flex-shrink-0 absolute left-4">
                  <div className="relative w-8 h-8">
                    <Image 
                      src="/static/EWGF_ICON@2x.png" 
                      alt="EWGF Logo" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-russo-one text-lg text-white hidden sm:block">
                    ewgf<span className="text-blue-400">.gg</span>
                  </span>
                </Link>
                <div className="flex-1 max-w-2xl mx-auto px-16 sm:px-32">
                  <SearchBar />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for content - matches header height */}
      <div className="h-32 md:h-44"></div>
    </>
  );
}
