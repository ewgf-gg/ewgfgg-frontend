"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { totalActivePlayers30dAtom, totalRankedReplays30dAtom, totalUnrankedReplays30dAtom } from '@/app/state/atoms/tekkenStatsAtoms';
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
  const [totalActivePlayers30d] = useAtom(totalActivePlayers30dAtom);
  const [totalRankedReplays30d] = useAtom(totalRankedReplays30dAtom);
  const [totalUnrankedReplays30d] = useAtom(totalUnrankedReplays30dAtom);
  const [storedPolarisId, setStoredPolarisId] = useState<string | null>(null);
  const { polarisId } = usePolarisId();
  const router = useRouter();

  // Scroll behavior state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchBlurTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("polarisId");
    if (id) setStoredPolarisId(id);
  }, []);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    // Clear any pending blur timeout
    if (searchBlurTimeout.current) {
      clearTimeout(searchBlurTimeout.current);
      searchBlurTimeout.current = null;
    }
  };

  const handleSearchBlur = () => {
    // Wait 2 seconds after blur before marking as unfocused
    searchBlurTimeout.current = setTimeout(() => {
      setIsSearchFocused(false);
    }, 2000);
  };

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
      // But only if search bar is not focused
      if (scrollingUp && currentScrollY > 100) {
        scrollTimeout.current = setTimeout(() => {
          // Only hide if search bar is not focused
          if (!isSearchFocused) {
            setIsSearchBarVisible(false);
          }
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
  }, [isSearchFocused]);

  // Effect to handle hiding mini header when search loses focus
  useEffect(() => {
    if (!isSearchFocused && isSearchBarVisible) {
      // When search bar loses focus and mini header is visible,
      // wait 2 seconds then hide it
      const hideTimeout = setTimeout(() => {
        setIsSearchBarVisible(false);
      }, 2000);

      return () => clearTimeout(hideTimeout);
    }
  }, [isSearchFocused, isSearchBarVisible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchBlurTimeout.current) {
        clearTimeout(searchBlurTimeout.current);
      }
    };
  }, []);

  const animatedPlayers = useAnimatedCounter(totalActivePlayers30d, 2000);
  const animatedReplays = useAnimatedCounter(totalRankedReplays30d, 2000);
  const animatedUnrankedReplays = useAnimatedCounter(totalUnrankedReplays30d, 2000);

  const navLinks = [
    { href: '/statistics', label: 'Statistics' },
    { href: '/activity', label: 'Game Activity' },
    { href: '/leaderboards', label: 'Leaderboards' },
    { href: '/api-docs', label: 'API' },
    { href: '/about', label: 'About' },
    { href: '/donate', label: 'Donate' }
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
              <span className="font-russo-one text-xl text-white">
                ewgf<span className="text-blue-400 dark:text-blue-500">.gg</span>
              </span>
            </Link>

            {/* Desktop Navigation - Modernized */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`relative px-6 py-2.5 font-medium text-sm transition-all duration-300 group ${
                    link.href === '/donate' 
                      ? 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-lg shadow-lg hover:shadow-pink-500/50 animate-pulse-slow hover:scale-105' 
                      : 'text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {link.href !== '/donate' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-400 group-hover:w-3/4 transition-all duration-300" />
                    </>
                  )}
                </Link>
              ))}
              
              {/* My Profile Button */}
              <AnimatePresence>
                {polarisId && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => router.push(`/player/${polarisId}`)}
                    className="ml-4 px-6 py-2.5 border border-purple-500 hover:border-purple-400 text-purple-400 hover:text-purple-300 font-medium text-sm rounded-lg transition-colors duration-200"
                  >
                    My Profile
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Stats */}
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
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4">
            <div className="flex space-x-4 flex-wrap gap-y-2 justify-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-sm font-medium transition-colors ${
                    link.href === '/donate'
                      ? 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white px-3 py-1 rounded-lg animate-pulse-slow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {polarisId && (
                <button
                  onClick={() => router.push(`/player/${polarisId}`)}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  My Profile
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Integrated Search Bar for Desktop */}
        <div className="hidden md:block border-t border-gray-700/50 bg-gray-800/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-2xl mx-auto">
              <SearchBar onFocus={handleSearchFocus} onBlur={handleSearchBlur} />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden border-t border-gray-700/50 bg-gray-800/50 dark:bg-gray-900/50">
          <div className="px-4 py-3">
            <div className="max-w-md mx-auto">
              <SearchBar onFocus={handleSearchFocus} onBlur={handleSearchBlur} />
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
                  <SearchBar onFocus={handleSearchFocus} onBlur={handleSearchBlur} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for content - matches header height */}
      <div className="h-52 md:h-44"></div>
    </>
  );
}
