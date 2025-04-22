import { fetchStatistics } from '@/lib/api-config';

export async function getGlobalStats() {
  try {
    const statsSummary = await fetchStatistics('stats-summary');
    return {
      totalPlayers: statsSummary.totalPlayers,
      totalReplays: statsSummary.totalReplays
    };
  } catch (error) {
    console.error('Failed to fetch global stats:', error);
    return {
      totalPlayers: 0,
      totalReplays: 0
    };
  }
}
