// Statistics Page Types for new API contract

export interface CharacterWinRate {
  character: string;      // lowercase: "paul", "jin", "devil jin", etc.
  gameVersion: number;
  region: string;         // lowercase: "asia", "americas", "europe", "oceania", "middle_east"
  danRank: string;        // lowercase: "beginner", "fighter", "tekken_god", etc.
  totalGames: number;
  totalWins: number;
  winRate: number;
}

export interface CharacterPickRate {
  character: string;
  gameVersion: number;
  region: string;
  danRank: string;
  totalGames: number;
  pickRate: number;
}

export interface StatisticsRankDistribution {
  gameVersion: number;
  region: string;
  danRank: string;
  playerCount: number;
}

export interface StatisticsPageResponse {
  winRates: CharacterWinRate[];
  pickRates: CharacterPickRate[];
  rankDistribution: StatisticsRankDistribution[];
}

// Processed/aggregated data for display
export interface AggregatedCharacterStats {
  [character: string]: number;
}

export interface AggregatedWinRateStats {
  [character: string]: {
    winRate: number;
    totalWins: number;
    totalGames: number;
  };
}

export interface ProcessedStatisticsData {
  pickRates: AggregatedCharacterStats;
  winRates: AggregatedWinRateStats;
  totalBattles: number;
  characterCount: number;
  averageWinrate: number;
}
