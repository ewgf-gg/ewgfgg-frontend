// First, let's create a custom hook for the animated counter
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { totalReplaysAtom, totalPlayersAtom } from '@/atoms/tekkenStatsAtoms';

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

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * endValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [endValue, duration]);

  return count;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [totalReplays] = useAtom(totalReplaysAtom);
  const [totalPlayers] = useAtom(totalPlayersAtom);
  const router = useRouter();

  const animatedPlayers = useAnimatedCounter(totalPlayers, 2000);
  const animatedReplays = useAnimatedCounter(totalReplays, 2000);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/player/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet" />
      <header className="fixed top-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm shadow-lg z-50">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and left-side navigation */}
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="font-['Russo_One'] text-2xl text-white"
              >
                ewgf<span className="text-blue-400">.gg</span>
              </Link>
              <div className="flex space-x-6">
                <Link
                  href="/statistics"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-semibold"
                >
                  All Statistics
                </Link>
                <Link
                  href="/#"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-semibold"
                >
                  About
                </Link>
              </div>
            </div>

            {/* Centered search bar */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Search player... (Player name / TEKKEN-ID)"
                    className="w-full h-10 pl-10 pr-4 text-sm bg-gray-700/50 text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all hover:bg-gray-700/70"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </form>
            </div>

            {/* Enhanced right-aligned stats with animation */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Players</span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
                  {formatNumber(animatedPlayers)}
                </span>
              </div>
              <div className="h-8 w-px bg-gray-700" />
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Replays</span>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent drop-shadow-sm">
                  {formatNumber(animatedReplays)}
                </span>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="h-16"></div>
    </>
  );
}