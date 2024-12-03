import React from 'react';
import { Battle, characterIdMap } from '../../app/state/types/tekkenTypes';
import MatchupCard from './MatchupCard';

interface WorstMatchupChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  playerName: string;
}

const WorstMatchupChart: React.FC<WorstMatchupChartProps> = ({ 
  battles, 
  selectedCharacterId, 
  playerName 
}) => {
  const worstMatchup = React.useMemo(() => {
    // Filter battles for selected character
    const characterBattles = battles.filter(battle => {
      const isPlayer1 = battle.player1Name === playerName;
      return isPlayer1 
        ? battle.player1CharacterId === selectedCharacterId
        : battle.player2CharacterId === selectedCharacterId;
    });

    // Calculate winrates against each character
    const matchups = characterBattles.reduce((acc, battle) => {
      const isPlayer1 = battle.player1Name === playerName;
      const opponentCharId = isPlayer1 ? battle.player2CharacterId : battle.player1CharacterId;
      const won = isPlayer1 ? battle.winner === 1 : battle.winner === 2;

      if (!acc[opponentCharId]) {
        acc[opponentCharId] = {
          wins: 0,
          losses: 0,
          totalMatches: 0,
          winRate: 0
        };
      }

      if (won) {
        acc[opponentCharId].wins++;
      } else {
        acc[opponentCharId].losses++;
      }
      
      acc[opponentCharId].totalMatches++;
      acc[opponentCharId].winRate = (acc[opponentCharId].wins / acc[opponentCharId].totalMatches) * 100;

      return acc;
    }, {} as Record<number, { wins: number; losses: number; totalMatches: number; winRate: number; }>);

    // Convert to array and sort by winrate, prioritizing matchups with more games
    const sortedMatchups = Object.entries(matchups)
      .map(([characterId, stats]) => ({
        characterId: parseInt(characterId),
        ...stats
      }))
      .filter(matchup => matchup.totalMatches >= 3) // Only consider matchups with at least 3 games
      .sort((a, b) => {
        if (Math.abs(b.winRate - a.winRate) < 0.001) {
          return b.totalMatches - a.totalMatches;
        }
        return a.winRate - b.winRate; // Sort ascending for worst matchup
      });

    if (sortedMatchups.length === 0) return null;

    const worst = sortedMatchups[0];
    return {
      characterName: characterIdMap[worst.characterId] || `Character ${worst.characterId}`,
      winRate: worst.winRate,
      totalMatches: worst.totalMatches
    };
  }, [battles, selectedCharacterId, playerName]);

  if (!worstMatchup) {
    return null;
  }

  return (
    <MatchupCard
      characterName={worstMatchup.characterName}
      winRate={worstMatchup.winRate}
      title="Worst Matchup"
      description="Your lowest win rate"
    />
  );
};

export default WorstMatchupChart;
