import PlayerPageContent from '@/app/player/[polarisId]/PlayerPageContent';
import { fetchPlayerData } from '@/lib/api-config';
import { PlayerStats } from '../../state/types/tekkenTypes';
import React from 'react';

export const revalidate = 0;

interface PageProps {
  params: {
    polarisId: string;
  };
}

export default async function PlayerStatsPage({ params }: PageProps) {
  const { polarisId } = params;
  
  let playerStats: PlayerStats | null = null;
  let error: string | null = null;
  
  try {
    playerStats = await fetchPlayerData(polarisId);
    if (!playerStats) {
      throw new Error('No player data found');
    }
    
    if (!playerStats.polarisId || !playerStats.name || !playerStats.playedCharacters) {
      throw new Error('Invalid player stats data structure');
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('Error fetching player stats:', err);
  }

  return (
    <PlayerPageContent 
      error={error}
      playerStats={playerStats}
      polarisId={polarisId}
    />
  );
}
