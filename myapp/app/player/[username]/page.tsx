"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { PlayerProfile } from '@/components/PlayerProfile';
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation'; // Import the new component

interface PlayerStats {
  username: string;
  rank: string;
  winRate: number;
  totalMatches: number;
  favoriteCharacters: { name: string; matches: number; winRate: number }[];
  recentMatches: { opponent: string; character: string; result: 'win' | 'loss'; date: string }[];
}

export default function PlayerStatsPage({ params }: { params: { username: string } }) {
  const { username } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate fetching player data
        const mockPlayerStats: PlayerStats = {
          username: username,
          rank: 'Butthead',
          winRate: 65,
          totalMatches: 1000,
          favoriteCharacters: [
            { name: 'Jin', matches: 300, winRate: 70 },
            { name: 'Kazuya', matches: 200, winRate: 60 },
            { name: 'Paul', matches: 100, winRate: 55 },
          ],
          recentMatches: [
            { opponent: 'Player1', character: 'Jin', result: 'win', date: '2023-05-01' },
            { opponent: 'Player2', character: 'Kazuya', result: 'loss', date: '2023-04-30' },
            { opponent: 'Player3', character: 'Paul', result: 'win', date: '2023-04-29' },
          ],
        };

        setPlayerStats(mockPlayerStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchPlayerStats();
    }
  }, [username]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.h1 
          className="text-5xl font-bold text-center mb-4" // Reduced bottom margin
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Player Stats for {username}
        </motion.h1>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              className="flex justify-center items-center mb-8" // Added bottom margin
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EWGFLoadingAnimation />
            </motion.div>
          ) : error ? (
            <motion.p 
              key="error"
              className="text-center text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          ) : playerStats ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <PlayerProfile stats={playerStats} />
            </motion.div>
          ) : (
            <motion.p 
              key="not-found"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              No player data found.
            </motion.p>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
