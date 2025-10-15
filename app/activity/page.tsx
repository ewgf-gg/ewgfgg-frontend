import React from 'react';
import { ActivityPageContent } from './ActivityPageContent';
import { 
  ActivityGraphData, 
  ActivePlayer,
  GameActivityResponse,
  BackendActivePlayer,
  WeeklyTrend 
} from '@/app/state/types/ActivityPageTypes';
import { rankOrderMap, Regions } from '@/app/state/types/tekkenTypes';
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { fetchGameActivity } from '@/lib/api';

export const revalidate = 30;

// Transform backend WeeklyTrend data to frontend ActivityGraphData
function transformWeeklyTrends(weeklyTrends: WeeklyTrend[]): ActivityGraphData {
  
  const battleActivity = weeklyTrends.map(trend => {
    const date = new Date(trend.weekStart);
    return {
      date: trend.weekStart,
      battles: trend.totalBattles,
      timestamp: Math.floor(date.getTime() / 1000)
    };
  });

  const playerActivity = weeklyTrends.map(trend => {
    const date = new Date(trend.weekStart);
    return {
      date: trend.weekStart,
      activePlayers: trend.uniquePlayers,
      timestamp: Math.floor(date.getTime() / 1000)
    };
  });
  return {
    battleActivity,
    playerActivity
  };
}

// Create reverse lookup map for efficient rank name to danRank conversion
const rankNameToDanRankMap = Object.entries(rankOrderMap).reduce((acc, [key, value]) => {
  acc[value] = parseInt(key);
  return acc;
}, {} as Record<string, number>);

// Transform backend ActivePlayer data to frontend ActivePlayer
function transformActivePlayers(backendPlayers: BackendActivePlayer[]): ActivePlayer[] {
  return backendPlayers.map(player => {
    const regionId = player.regionId ?? -1;
    const rankName = player.currentRank || 'Beginner';
    
    // Use direct lookup instead of linear search - O(1) instead of O(n)
    const danRank = rankNameToDanRankMap[rankName] ?? 0;
    
    return {
      name: player.playerName,
      polarisId: player.ewgfId.toString(),
      rank: rankName,
      danRank: danRank,
      region: Regions[regionId] || 'N/A',
      regionId: regionId,
      mainCharacter: player.lastCharacter || 'Unknown',
      lastSeen: Math.floor(new Date(player.lastSeen).getTime() / 1000),
      tekkenPower: player.tekkenProwess ?? 0
    };
  });
}

export default async function ActivityPage() {
  let graphData: ActivityGraphData | null = null;
  let activePlayers: ActivePlayer[] = [];
  let error: string | null = null;
  
  try {
    const response = await fetchGameActivity() as GameActivityResponse;
    
    // Transform backend data to frontend format
    graphData = transformWeeklyTrends(response.weeklyTrends);
    activePlayers = transformActivePlayers(response.activePlayers);
    
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch data';
    console.error('Error fetching activity data:', err);
  }

  // Show loading state while fetching data
  if (!graphData) {
    if (!error) {
      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
            <EWGFLoadingAnimation />
          </main>
          <Footer />
        </div>
      );
    }
  }

  // Pass the fetched data to the client component
  return (
    <ActivityPageContent 
      graphData={graphData || { battleActivity: [], playerActivity: [] }}
      activePlayers={activePlayers}
    />
  );
}
