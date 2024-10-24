"use client"

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
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
  characterStats: { [key: string]: CharacterStats };
}

export default function PlayerStatsPage(props: { params: Promise<{ username: string }> }) {
  const params = use(props.params);
  const { username } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8080/api/player-stats/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch player stats');
        }
        const data: PlayerStats = await response.json();
        setPlayerStats(data);
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

  // Convert the API data to the format expected by PlayerProfile
  const formattedPlayerStats = playerStats ? {
    username: playerStats.name,
    rank: Object.values(playerStats.characterStats)[0]?.danName || 'Unknown',
    winRate: calculateWinRate(playerStats.characterStats),
    totalMatches: calculateTotalMatches(playerStats.characterStats),
    favoriteCharacters: formatFavoriteCharacters(playerStats.characterStats),
    recentMatches: [], // You might need to fetch this separately or modify your API
  } : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.h1 
          {...{className: "text-5xl font-bold text-center mb-4"}}
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
              {...{className: "flex justify-center items-center mb-8"}}
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
              {...{className: "text-center text-red-500"}}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          ) : formattedPlayerStats ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <PlayerProfile stats={formattedPlayerStats} />
            </motion.div>
          ) : (
            <motion.p 
              key="not-found"
              {...{className: "text-center"}}
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

function calculateWinRate(characterStats: { [key: string]: CharacterStats }): number {
  let totalWins = 0;
  let totalMatches = 0;
  Object.values(characterStats).forEach(stats => {
    totalWins += stats.wins;
    totalMatches += stats.wins + stats.losses;
  });
  return totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;
}

function calculateTotalMatches(characterStats: { [key: string]: CharacterStats }): number {
  return Object.values(characterStats).reduce((total, stats) => total + stats.wins + stats.losses, 0);
}

function formatFavoriteCharacters(characterStats: { [key: string]: CharacterStats }) {
  return Object.values(characterStats)
    .map(stats => ({
      name: stats.characterName,
      matches: stats.wins + stats.losses,
      winRate: stats.wins / (stats.wins + stats.losses) * 100
    }))
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 3);
}