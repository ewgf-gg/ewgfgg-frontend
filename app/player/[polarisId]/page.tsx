import PlayerPageContent from '@/app/player/[polarisId]/PlayerPageContent';
import { fetchPlayerData, fetchStatPentagon } from '@/lib/api-config';
import { PlayerStatsResponse, StatPentagonData } from '../../state/types/PlayerPageTypes';
import React from 'react';

export const revalidate = 0;

interface PageProps {
  params: {
    polarisId: string;
  };
}

export default async function PlayerStatsPage({ params }: PageProps) {
  const { polarisId } = params;
  
  let playerStats: PlayerStatsResponse | null = null;
  let statPentagonData: StatPentagonData | null = null;
  const error: string | null = null;
  
  try {
    // Fetch player stats and stat pentagon data in parallel
    const [playerStatsResult, statPentagonResult] = await Promise.all([
      fetchPlayerData(polarisId),
      // eslint-disable-next-line
      fetchStatPentagon(polarisId).catch(err => {
        console.error('Error fetching stat pentagon data');
        return null;
      })
    ]);
    
    playerStats = playerStatsResult;
    statPentagonData = statPentagonResult;
    
    if (!playerStats) {
      throw new Error('No player data found');
    }
    
    if (!playerStats.playerMetadata.polarisId || !playerStats.playerMetadata.name || !playerStats.playedCharacters) {
      throw new Error('Invalid player stats data structure');
    }
    // eslint-disable-next-line
  } catch (err) {
    console.error('Error fetching player stats:');
  }

  return (
    <PlayerPageContent 
      error={error}
      playerStats={playerStats}
      polarisId={polarisId}
      statPentagonData={statPentagonData}
    />
  );
}
