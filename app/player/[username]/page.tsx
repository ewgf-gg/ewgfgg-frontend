"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import  Footer  from '@/components/ui/Footer';
import { PlayerProfile } from '@/components/PlayerProfile';
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';

interface CharacterStats {
  characterName: string;
  danName: string;
  danRank: number;
  wins: number;
  losses: number;
}

interface PlayerStats {
  playerId: string;
  name: string;
  tekkenPower: number;
  latestBattle: number;
  characterStats: Record<string, CharacterStats>;
}

interface FormattedCharacter {
  name: string;
  matches: number;
  winRate: number;
}

interface FormattedPlayerStats {
  username: string;
  rank: string;
  winRate: number;
  totalMatches: number;
  favoriteCharacters: FormattedCharacter[];
  recentMatches: any[];
}

interface PageProps {
  params: {
    username: string;
  };
}

export default function PlayerStatsPage({ params }: PageProps) {
  const { username } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!username) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8080/player-stats/${encodeURIComponent(username)}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Error: ${response.status}`);
        }

        const data: PlayerStats = await response.json();
        validatePlayerStats(data);
        setPlayerStats(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error fetching player stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerStats();
  }, [username]);

  const formattedPlayerStats: FormattedPlayerStats | null = playerStats ? {
    username: playerStats.name,
    rank: Object.values(playerStats.characterStats)[0]?.danName ?? 'Unknown',
    winRate: calculateWinRate(playerStats.characterStats),
    totalMatches: calculateTotalMatches(playerStats.characterStats),
    favoriteCharacters: formatFavoriteCharacters(playerStats.characterStats),
    recentMatches: [],
  } : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.h1 
          className="text-5xl font-bold text-center mb-8"
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
              className="flex justify-center items-center my-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EWGFLoadingAnimation />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <svg 
                  className="w-5 h-5 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            </motion.div>
          ) : formattedPlayerStats ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <PlayerProfile stats={formattedPlayerStats} />
            </motion.div>
          ) : (
            <motion.div 
              key="not-found"
              className="text-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xl">No player data found for {username}.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

// Utility functions
function validatePlayerStats(data: PlayerStats): void {
  if (!data.playerId || !data.name || !data.characterStats) {
    throw new Error('Invalid player stats data structure');
  }
}

function calculateWinRate(characterStats: Record<string, CharacterStats>): number {
  const totals = Object.values(characterStats).reduce(
    (acc, stats) => ({
      wins: acc.wins + stats.wins,
      total: acc.total + stats.wins + stats.losses
    }),
    { wins: 0, total: 0 }
  );

  return totals.total > 0 ? (totals.wins / totals.total) * 100 : 0;
}

function calculateTotalMatches(characterStats: Record<string, CharacterStats>): number {
  return Object.values(characterStats).reduce(
    (total, stats) => total + stats.wins + stats.losses,
    0
  );
}

function formatFavoriteCharacters(characterStats: Record<string, CharacterStats>): FormattedCharacter[] {
  return Object.values(characterStats)
    .map(stats => ({
      name: stats.characterName,
      matches: stats.wins + stats.losses,
      winRate: stats.wins / (stats.wins + stats.losses) * 100
    }))
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 3);
}