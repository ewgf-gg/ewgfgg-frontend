"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { PlayerProfile } from '@/app/player/[polarisId]/PlayerProfile';
import { 
  PlayerStats, 
  CharacterStatsWithVersion, 
  CharacterBattleStats, 
  Battle, 
  FormattedCharacter, 
  FormattedMatch, 
  PlayedCharacter,
  characterIdMap,
  rankOrderMap,
  BattleType,
  battleTypeMap
} from '@/app/state/types/tekkenTypes';

interface PlayerPageContentProps {
  error: string | null;
  playerStats: PlayerStats | null;
  polarisId: string;
}

export default function PlayerPageContent({ 
  error, 
  playerStats, 
  polarisId 
}: PlayerPageContentProps) {
  // Client-side data transformation
  const formattedPlayerStats = useMemo(() => {
    if (!playerStats) return null;

    return {
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
      battles: (playerStats.battles || []).map(battle => ({
        ...battle,
        // Convert numeric battleType to BattleType enum
        battleType: typeof battle.battleType === 'number' 
          ? battleTypeMap[battle.battleType as unknown as number] || BattleType.RANKED_BATTLE 
          : battle.battleType
      })),
      regionId: playerStats.regionId || 0,
      latestBattle: playerStats.latestBattle || 0,
      mainCharacterAndRank: playerStats.mainCharacterAndRank,
      playedCharacters: playerStats.playedCharacters
    };
  }, [playerStats, polarisId]);

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
          {error ? (
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

// Data transformation functions moved to client component
function calculateTotalMatches(playedCharacters: Record<string, PlayedCharacter>): number {
  return Object.values(playedCharacters).reduce(
    (total, stats) => total + stats.wins + stats.losses,
    0
  );
}

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
  const getCharacterId = (characterName: string): number => {
    // eslint-disable-next-line
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
    // eslint-disable-next-line
    const entry = Object.entries(characterIdMap).find(([_, name]) => name === characterName);
    return entry ? parseInt(entry[0]) : 0;
  };
  
  return Object.entries(playedCharacters).map(([characterName, stats]) => {
    const characterId = getCharacterId(characterName);
    const battles = stats.wins + stats.losses;
    
    return {
      characterId,
      characterName,
      totalBattles: battles,
      percentage: (battles / totalBattles) * 100 // This calculation is needed as it's not in the payload
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
