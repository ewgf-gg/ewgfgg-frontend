import {
  GameRankDistribution,
  rankOrderMap,
  InitialData,
  PlayerSearchResult,
  GameVersion,
  RankDistribution,
  VersionStats
} from '@/app/state/types/tekkenTypes'
import { fetchWithConfig, fetchStatistics, fetchPlayerData } from '@/lib/api-config';

const transformRankDistribution = (entries: Array<{ rank: number, percentage: number }>): RankDistribution[] => {
  return entries.map(entry => ({
      rank: rankOrderMap[entry.rank].toString(),
      percentage: entry.percentage
  }));
};

export const getInitialData = async (): Promise<InitialData> => {
  try {
      const [
          statsSummary,
          winrates,
          popularity,
          winrateChanges,
          rankDistributionData,
          recentlyActivePlayers
      ] = await Promise.all([
          fetchStatistics('stats-summary'),
          fetchStatistics('top-winrates'),
          fetchStatistics('top-popularity'),
          fetchStatistics('winrate-changes'),
          fetchStatistics('rankDistribution'),
          fetchPlayerData('recentlyActive')
      ]);

      const distributionData = {} as GameRankDistribution;
      
      Object.entries(rankDistributionData as Record<string, { overall: Array<{ rank: number, percentage: number }>, standard: Array<{ rank: number, percentage: number }> }>)
        .forEach(([version, data]) => {
          if (version as GameVersion) {
              distributionData[version as GameVersion] = {
                  overall: transformRankDistribution(data.overall),
                  standard: transformRankDistribution(data.standard)
              };
          }
      });

      return {
          totalReplays: statsSummary.totalReplays,
          totalPlayers: statsSummary.totalPlayers,
          characterWinrates: winrates,
          characterPopularity: popularity,
          rankDistribution: distributionData,
          winrateChanges,
          recentlyActivePlayers
      };
  } catch (error) {
      console.error('Failed to fetch initial data:', error);
      throw new Error(`Failed to fetch initial data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export async function searchPlayersServer(query: string): Promise<PlayerSearchResult[]> {
  if (!query || query.length < 2) return [];
  try {
      return await fetchWithConfig(`/player-stats/search?query=${encodeURIComponent(query)}`);
  } catch (error) {
      console.error('Failed to search players:', error);
      return [];
  }
}

export async function fetchVersionPopularity(): Promise<VersionStats> {
  try {
      const response = await fetch('/api/statistics/version-popularity', {
        next: {
          revalidate: 30 
        }
      });
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Failed to fetch version popularity statistics:', error);
      throw new Error('Failed to fetch version popularity statistics');
  }
}

export async function fetchVersionWinrates(): Promise<VersionStats> {
  try {
      const response = await fetch('/api/statistics/version-winrates', {
        next: {
          revalidate: 30
        }
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Failed to fetch version winrate statistics:', error);
      throw new Error('Failed to fetch version winrate statistics');
  }
}
