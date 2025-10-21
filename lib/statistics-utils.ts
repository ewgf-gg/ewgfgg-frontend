import { rankOrderMap, rankEnumToLabel } from '@/app/state/types/tekkenTypes';
import type {
  CharacterPickRate,
  CharacterWinRate,
  AggregatedCharacterStats,
  ProcessedStatisticsData,
  StatisticsPageResponse
} from '@/app/state/types/StatisticsPageTypes';

/**
 * Capitalize character name from API format to display format
 * e.g., "paul" -> "Paul", "devil jin" -> "Devil Jin"
 */
export function capitalizeCharacter(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('_', ' ');
}


/**
 * Get rank order number from rank display name
 * e.g., "Beginner" -> 0, "Tekken God" -> 27, "Cavalry" -> 8
 * API sends rank names in display format like "Tekken God", "Cavalry", etc.
 */
export function getRankOrder(danRank: string): number {
  // Direct lookup in rankOrderMap by display name (case-insensitive)
  const orderEntry = Object.entries(rankOrderMap).find(
    ([_, displayName]) => displayName.toLowerCase() === danRank.toLowerCase()
  );
  
  if (orderEntry) {
    return parseInt(orderEntry[0]);
  }
  
  // If not found, return 0 (Beginner) as default
  console.warn(`Rank not found: "${danRank}", defaulting to order 0`);
  return 0;
}

/**
 * Get all ranks in descending order from rankOrderMap (highest to lowest)
 */
export function getAllRanksInOrder(): Array<{ value: string; label: string; order: number }> {
  return Object.entries(rankOrderMap)
    .filter(([order]) => parseInt(order) < 100) // Exclude alternative GoD ranks
    .map(([order, label]) => ({
      value: label,
      label: label,
      order: parseInt(order)
    }))
    .sort((a, b) => b.order - a.order); // Sort descending (highest rank first)
}

/**
 * Filter pick rates by region and minimum rank order (cumulative)
 */
export function filterPickRates(
  data: CharacterPickRate[],
  region: string,
  minRankOrder: number
): CharacterPickRate[] {
  return data.filter(item => {
    const matchesRegion = region === 'global' || item.region === region;
    const matchesRank = getRankOrder(item.danRank) >= minRankOrder;
    return matchesRegion && matchesRank;
  });
}

/**
 * Filter win rates by region and minimum rank order (cumulative)
 */
export function filterWinRates(
  data: CharacterWinRate[],
  region: string,
  minRankOrder: number
): CharacterWinRate[] {
  return data.filter(item => {
    const matchesRegion = region === 'global' || item.region === region;
    const matchesRank = getRankOrder(item.danRank) >= minRankOrder;
    return matchesRegion && matchesRank;
  });
}

/**
 * Aggregate pick rates by character
 */
export function aggregatePickRates(
  data: CharacterPickRate[]
): AggregatedCharacterStats {
  const grouped = data.reduce((acc, item) => {
    const char = capitalizeCharacter(item.character);
    acc[char] = (acc[char] || 0) + item.totalGames;
    return acc;
  }, {} as AggregatedCharacterStats);

  return grouped;
}

/**
 * Aggregate win rates by character
 * Returns win rate as a percentage with total wins and games
 */
export function aggregateWinRates(
  data: CharacterWinRate[]
): import('@/app/state/types/StatisticsPageTypes').AggregatedWinRateStats {
  // Group by character and sum wins/games
  const grouped = data.reduce((acc, item) => {
    const char = capitalizeCharacter(item.character);
    if (!acc[char]) {
      acc[char] = { wins: 0, games: 0 };
    }
    acc[char].wins += item.totalWins;
    acc[char].games += item.totalGames;
    return acc;
  }, {} as Record<string, { wins: number; games: number }>);

  // Calculate win rates
  const winRates: import('@/app/state/types/StatisticsPageTypes').AggregatedWinRateStats = {};
  for (const [char, stats] of Object.entries(grouped)) {
    winRates[char] = {
      winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
      totalWins: stats.wins,
      totalGames: stats.games
    };
  }

  return winRates;
}

/**
 * Process statistics data based on filters
 */
export function processStatisticsData(
  data: StatisticsPageResponse,
  selectedRegion: string,
  selectedRankOrder: number
): ProcessedStatisticsData {
  // Filter data
  const filteredPickRates = filterPickRates(data.pickRates, selectedRegion, selectedRankOrder);
  const filteredWinRates = filterWinRates(data.winRates, selectedRegion, selectedRankOrder);

  // Aggregate data
  const pickRates = aggregatePickRates(filteredPickRates);
  const winRates = aggregateWinRates(filteredWinRates);

  // Calculate summary stats
  const totalBattles = Object.values(pickRates).reduce((sum, val) => sum + val, 0);
  const characterCount = Object.keys(pickRates).length;
  const averageWinrate = characterCount > 0
    ? Object.values(winRates).reduce((sum, val) => sum + val.winRate, 0) / characterCount
    : 0;

  return {
    pickRates,
    winRates,
    totalBattles,
    characterCount,
    averageWinrate
  };
}

/**
 * Format version number for display
 * e.g., 50200 -> "Version 5.02.00"
 */
export function formatVersion(version: number | string): string {
  const versionNum = typeof version === 'string' ? parseInt(version) : version;
  const major = Math.floor(versionNum / 10000);
  const minor = Math.floor((versionNum % 10000) / 100);
  const patch = versionNum % 100;
  return `Version ${major}.${minor.toString().padStart(2, '0')}.${patch.toString().padStart(2, '0')}`;
}

/**
 * Get version label with "Latest" tag if applicable
 */
export function getVersionLabel(version: number, latestVersion: number): string {
  const formattedVersion = formatVersion(version);
  return version === latestVersion ? `${formattedVersion} (Latest)` : formattedVersion;
}
