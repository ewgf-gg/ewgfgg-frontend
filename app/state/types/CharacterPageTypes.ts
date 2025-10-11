// Backend API Response Types
export interface CharacterStatsApiResponse {
    character_id: string;
    total_matches: number;
    total_wins: number;
    winrate: number;
    pickrate: number;
    total_unique_players: number;
    total_mains: number | null;
    mained_by_percent: number | null;
    median_rank: string | null;
    rank_distribution: Record<string, number>;
    daily_trends: DailyTrend[];
    matchups: MatchupStats[];
}

export interface DailyTrend {
    date: string;
    matches: number;
    wins: number;
    winrate: number;
    pickrate: number;
}

export interface MatchupStats {
    opp_character: string;
    total_games: number;
    wins: number;
    winrate: number;
}

// Frontend Display Types (for backwards compatibility with existing components)
export interface CharacterStatsResponse {
    characterName: string;
    characterIcon: string;
    overallStats: CharacterOverallStats;
    matchups: CharacterMatchup[];
    rankDistribution: RankDistribution[];
    topPlayers: TopPlayer[];
    trendData: TrendData[];
}

export interface CharacterOverallStats {
    winRate: number;
    pickRate: number;
    totalMatches: number;
    averageRank: string;
    totalPlayers: number;
    mainedBy: number; // Number of players who main this character
    mainedByPercent?: number; // Percentage of players who main this character
}

export interface CharacterMatchup {
    opponentCharacter: string;
    opponentIcon: string;
    winRate: number;
    totalGames: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
}

export interface RankDistribution {
    rank: string;
    count: number;
    percentage: number;
}

export interface TopPlayer {
    rank: number;
    playerName: string;
    polarisId: string;
    region: string;
    tekkenPower: number;
    currentRank: string;
    winRate: number;
    totalGames: number;
}

export interface TrendData {
    date: string; // ISO date string
    winRate: number;
    pickRate: number;
    popularity: number;
}
