import {
  GameRankDistribution,
  rankOrderMap,
  InitialData,
  PlayerSearchResult,
  GameVersion,
  RankDistribution,
  VersionPopularityStats,
  VersionWinrateStats
} from '@/app/state/types/tekkenTypes';
import { SetStateAction } from 'react';
import { fetchWithConfig, fetchStatistics } from '@/lib/api-config';

const transformRankDistribution = (entries: Array<{ rank: number, percentage: number }>): RankDistribution[] => {
  return entries.map(entry => ({
      rank: rankOrderMap[entry.rank].toString(),
      percentage: entry.percentage
  }));
};

export const getInitialData = async (
  setGameVersions?: (value: SetStateAction<string[]>) => void
): Promise<InitialData> => {
  try {
      const [
          statsSummary,
          winrates,
          popularity,
          winrateChanges,
          rankDistributionData
      ] = await Promise.all([
          fetchStatistics('stats-summary'),
          fetchStatistics('top-winrates'),
          fetchStatistics('top-popularity'),
          fetchStatistics('winrate-changes'),
          fetchStatistics('rankDistribution')
      ]);

      const distributionData = {} as GameRankDistribution;
      
      Object.entries(rankDistributionData).forEach(([version, data]) => {
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
          winrateChanges
      };
  } catch (error) {
      throw new Error('Failed to fetch initial data');
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

export async function fetchVersionPopularity(): Promise<VersionPopularityStats> {
  try {
      return await fetchStatistics('version-popularity');
  } catch (error) {
      console.error('Failed to fetch version popularity statistics:', error);
      throw new Error('Failed to fetch version popularity statistics');
  }
}

export async function fetchVersionWinrates(): Promise<VersionWinrateStats> {
  try {
      return await fetchStatistics('version-winrates');
  } catch (error) {
      console.error('Failed to fetch version winrate statistics:', error);
      throw new Error('Failed to fetch version winrate statistics');
  }
}