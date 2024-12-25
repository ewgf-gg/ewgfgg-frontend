"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { PlayerProfile } from '@/components/player-charts/PlayerProfile';
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';
import { useAtom } from 'jotai';
import { playerStatsAtom, playerStatsLoadingAtom, playerStatsErrorAtom } from '../../state/atoms/tekkenStatsAtoms';
import type { 
  PlayerStats, 
  CharacterStats, 
  CharacterStatsWithVersion, 
  CharacterBattleStats, 
  Battle, 
  FormattedCharacter, 
  FormattedMatch, 
  FormattedPlayerStats } from '../../state/types/tekkenTypes';
  import React from 'react'

interface PageProps {
  params: {
    polarisId: string;
  };
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
  return Object.entries(characterStats)
    .map(([, stats]) => ({
      name: stats.characterName,
      matches: stats.wins + stats.losses,
      winRate: stats.wins / (stats.wins + stats.losses) * 100
    }))
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 3);
}

function formatCharacterStatsWithVersion(characterStats: Record<string, CharacterStats>): CharacterStatsWithVersion[] {
  return Object.entries(characterStats).map(([key, stats]) => {
    const characterIdMatch = key.match(/characterId=(\d+)/);
    const gameVersionMatch = key.match(/gameVersion=(\d+)/);
    
    return {
      ...stats,
      characterId: characterIdMatch ? parseInt(characterIdMatch[1]) : 0,
      gameVersion: gameVersionMatch ? gameVersionMatch[1] : '0',
    };
  });
}

function formatCharacterBattleStats(characterStats: Record<string, CharacterStats>): CharacterBattleStats[] {
  const totalBattles = calculateTotalMatches(characterStats);
  
  const characterStatsMap = new Map<string, CharacterBattleStats>();
  
  Object.entries(characterStats).forEach(([key, stats]) => {
    const characterIdMatch = key.match(/characterId=(\d+)/);
    const characterId = characterIdMatch ? parseInt(characterIdMatch[1]) : 0;
    const battles = stats.wins + stats.losses;
    
    if (characterStatsMap.has(stats.characterName)) {
      const existing = characterStatsMap.get(stats.characterName)!;
      existing.totalBattles += battles;
      existing.percentage = (existing.totalBattles / totalBattles) * 100;
    } else {
      characterStatsMap.set(stats.characterName, {
        characterId,
        characterName: stats.characterName,
        totalBattles: battles,
        percentage: (battles / totalBattles) * 100
      });
    }
  });

  return Array.from(characterStatsMap.values())
    .sort((a, b) => b.totalBattles - a.totalBattles);
}

function formatRecentMatches(battles: Battle[], playerName: string): FormattedMatch[] {
  return battles.map(battle => {
    const isPlayer1 = battle.player1Name === playerName;
    return {
      opponent: isPlayer1 ? battle.player2Name : battle.player1Name,
      character: isPlayer1 ? `Player 1 Char ${battle.player1CharacterId}` : `Player 2 Char ${battle.player2CharacterId}`,
      result: isPlayer1 ? (battle.winner === 1 ? 'win' : 'loss') : (battle.winner === 2 ? 'win' : 'loss'),
      date: battle.date
    };
  });
}

export default function PlayerStatsPage({ params }: PageProps) {
  const { polarisId } = params;
  const [playerStats, setPlayerStats] = useAtom(playerStatsAtom);
  const [isLoading, setIsLoading] = useAtom(playerStatsLoadingAtom);
  const [error, setError] = useAtom(playerStatsErrorAtom);

  useEffect(() => {
    let isMounted = true;

    const fetchPlayerStats = async () => {
      if (!polarisId) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/player-stats/${encodeURIComponent(polarisId)}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Error: ${response.status}`);
        }

        const data = await response.json();
        validatePlayerStats(data);
        
        if (isMounted) {
          setPlayerStats(data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        if (isMounted) {
          setError(errorMessage);
        }
        console.error('Error fetching player stats:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPlayerStats();

    return () => {
      isMounted = false;
    };
  }, [polarisId, setPlayerStats, setIsLoading, setError]);

  const formattedPlayerStats: FormattedPlayerStats | null = playerStats ? {
    username: playerStats.name,
    polarisId: polarisId,
    rank: Object.values(playerStats.characterStats)[0]?.danName ?? 'Unknown',
    winRate: calculateWinRate(playerStats.characterStats),
    totalMatches: calculateTotalMatches(playerStats.characterStats),
    favoriteCharacters: formatFavoriteCharacters(playerStats.characterStats),
    recentMatches: formatRecentMatches(playerStats.battles || [], playerStats.name),
    characterStatsWithVersion: formatCharacterStatsWithVersion(playerStats.characterStats),
    characterBattleStats: formatCharacterBattleStats(playerStats.characterStats),
    battles: playerStats.battles || [],
    regionId: playerStats.regionId || 0,
    areaId: playerStats.areaId || 0,
    latestBattle: playerStats.latestBattle || 0,
    mainCharacterAndRank: playerStats.mainCharacterAndRank
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
              className="max-w-6xl mx-auto"
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
              <p className="text-xl">No player data found for {polarisId}.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
