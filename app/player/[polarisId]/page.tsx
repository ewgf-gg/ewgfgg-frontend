"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { PlayerProfile } from '@/components/player-charts/PlayerProfile';
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';
import { useAtom } from 'jotai';
import { playerStatsAtom, playerStatsLoadingAtom, playerStatsErrorAtom } from '../../state/atoms/tekkenStatsAtoms';
import { 
  PlayerStats, 
  CharacterStats, 
  CharacterStatsWithVersion, 
  CharacterBattleStats, 
  Battle, 
  FormattedCharacter, 
  FormattedMatch, 
  FormattedPlayerStats,
  PlayedCharacter,
  characterIdMap,
  rankOrderMap } from '../../state/types/tekkenTypes';
import React from 'react'

interface PageProps {
  params: {
    polarisId: string;
  };
}

// Utility functions
function validatePlayerStats(data: PlayerStats): void {
  if (!data.polarisId || !data.name || !data.playedCharacters) {
    throw new Error('Invalid player stats data structure');
  }
}

// Calculate total matches across all characters
function calculateTotalMatches(playedCharacters: Record<string, PlayedCharacter>): number {
  return Object.values(playedCharacters).reduce(
    (total, stats) => total + stats.wins + stats.losses,
    0
  );
}

// Get top 3 most played characters
function formatFavoriteCharacters(playedCharacters: Record<string, PlayedCharacter>): FormattedCharacter[] {
  return Object.entries(playedCharacters)
    .map(([characterName, stats]) => ({
      name: characterName,
      matches: stats.wins + stats.losses,
      winRate: stats.characterWinrate
    }))
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 3);
}

function formatCharacterStatsWithVersion(playedCharacters: Record<string, PlayedCharacter>): CharacterStatsWithVersion[] {
  // Find character IDs from characterIdMap
  const getCharacterId = (characterName: string): number => {
    const entry = Object.entries(characterIdMap).find(([_, name]) => name === characterName);
    return entry ? parseInt(entry[0]) : 0;
  };

  return Object.entries(playedCharacters).map(([characterName, stats]) => {
    const characterId = getCharacterId(characterName);
    
    return {
      characterName,
      danName: rankOrderMap[stats.currentSeasonDanRank || stats.previousSeasonDanRank || 0],
      danRank: stats.currentSeasonDanRank || stats.previousSeasonDanRank || 0,
      wins: stats.wins,
      losses: stats.losses,
      characterId,
      gameVersion: '0', // Default version since we don't have version info in the new structure
    };
  });
}

function formatCharacterBattleStats(playedCharacters: Record<string, PlayedCharacter>): CharacterBattleStats[] {
  const totalBattles = calculateTotalMatches(playedCharacters);
  
  // Find character IDs from characterIdMap
  const getCharacterId = (characterName: string): number => {
    const entry = Object.entries(characterIdMap).find(([_, name]) => name === characterName);
    return entry ? parseInt(entry[0]) : 0;
  };
  
  // Simply map the data without recalculating
  return Object.entries(playedCharacters).map(([characterName, stats]) => {
    const characterId = getCharacterId(characterName);
    const battles = stats.wins + stats.losses;
    
    return {
      characterId,
      characterName,
      totalBattles: battles,
      percentage: (battles / totalBattles) * 100 // This calculation is still needed as it's not in the payload
    };
  }).sort((a, b) => b.totalBattles - a.totalBattles);
}

function formatRecentMatches(battles: Battle[], polarisId: string): FormattedMatch[] {
  return battles.map(battle => {
    const isPlayer1 = battle.player1PolarisId === polarisId;
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
    rank: playerStats.mainCharacterAndRank?.danRank ?? 'Unknown',
    // Use main character's winrate directly or average of all characters
    winRate: playerStats.mainCharacterAndRank ? 
      playerStats.playedCharacters[playerStats.mainCharacterAndRank.characterName]?.characterWinrate : 
      Object.values(playerStats.playedCharacters).reduce((sum, char) => sum + char.characterWinrate, 0) / 
        Object.values(playerStats.playedCharacters).length,
    totalMatches: calculateTotalMatches(playerStats.playedCharacters),
    favoriteCharacters: formatFavoriteCharacters(playerStats.playedCharacters),
    recentMatches: formatRecentMatches(playerStats.battles || [], polarisId),
    characterStatsWithVersion: formatCharacterStatsWithVersion(playerStats.playedCharacters),
    characterBattleStats: formatCharacterBattleStats(playerStats.playedCharacters),
    battles: playerStats.battles || [],
    regionId: playerStats.regionId || 0,
    areaId: playerStats.areaId || 0,
    latestBattle: playerStats.latestBattle || 0,
    mainCharacterAndRank: playerStats.mainCharacterAndRank,
    playedCharacters: playerStats.playedCharacters
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
