// Types for Game Activity page

export interface BattleActivityDataPoint {
  date: string;
  battles: number;
  timestamp: number;
}

export interface PlayerActivityDataPoint {
  date: string;
  activePlayers: number;
  timestamp: number;
}

export interface ActivityGraphData {
  battleActivity: BattleActivityDataPoint[];
  playerActivity: PlayerActivityDataPoint[];
}

export interface ActivePlayer {
  name: string;
  polarisId: string;
  rank: string;
  danRank: number;
  region: string;
  regionId: number;
  mainCharacter: string;
  lastSeen: number;
  tekkenPower: number;
}

export interface ActivePlayersFilters {
  rank: string;
  region: string;
}

export interface ActivityPageData {
  graphData: ActivityGraphData;
  activePlayers: ActivePlayer[];
}

// Backend response types
export interface WeeklyTrend {
  weekStart: string; // LocalDate from backend
  totalBattles: number;
  rankedBattles: number;
  playerBattles: number;
  quickBattles: number;
  groupBattles: number;
  uniquePlayers: number;
}

export interface BackendActivePlayer {
  ewgfId: number;
  playerName: string;
  regionId: number | null;
  lastCharacter: string | null; // Just the character name string
  tekkenProwess: number | null;
  lastSeen: string; // Instant from backend (ISO string)
  currentRank: string | null; // Just the rank name string like "Tekken Emperor"
}

export interface GameActivityResponse {
  weeklyTrends: WeeklyTrend[];
  activePlayers: BackendActivePlayer[];
}
