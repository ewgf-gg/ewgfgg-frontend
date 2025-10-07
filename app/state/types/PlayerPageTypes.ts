export interface PlayerStatsResponse {
    playerMetadata: PlayerMetadata;
    mainChar: Record<string, string>;   //  {"Alisa": "BUSHIN"})
    totalStatsByBattleType: Record<string, MatchupStat>; //  {"RANKED_BATTLE": {...}, "PLAYER_BATTLE": {...}}
    totalStatsBySeason: Record<string, MatchupStat>;
    playedCharacters: Record<string, Record<string, PlayerMatchupSummary>>; // { "Alisa": "RANKED_BATTLE" : {...} }
    recentActivity: DailyActivity[];
    battles: Battle[];
}

export interface PlayerMetadata {
    polarisId: string;
    name: string;
    region: string;
    language: string;
    platform: string;
    isBanned: boolean;
    isDonor: boolean;
    isVerified: boolean;
    banReason: string | null;
    pastPlayerNames: Record<string, string>; // {pastName : lastUsedDate (ISO string)}
    tekkenPower: number;
    latestBattle: string;  // ISO date string
}

export interface PlayerMatchupSummary {
    wins: number;
    losses: number;
    draws: number;
    currentSeasonRank: string | null;
    allTimeHighestRank: string | null;
    characterWinrate: number | null;
    bestMatchup: Record<string, number>; // { characterName : winRate }
    worstMatchup: Record<string , number>; // { characterName : winRate }
    currentSeasonMatchups: Record<string, MatchupStat>; // { characterName : MatchupStat }
    allTimeMatchups: Record<string, MatchupStat>; // { characterName : MatchupStat }
}

export interface MatchupStat {
    wins: number;
    losses: number;
    winRate: number | null;
    totalMatches: number;
}

export interface DailyActivity {
    date: string; // ISO date string
    wins: number;
    losses: number;
}

export interface Battle {
    battleAt: string; // ISO date string
    battleType: string;
    gameVersion: number;
    winner: number; 
    stageId: number;
    
    p1Name: string;
    p1PolarisId: string;
    p1Char: string;
    p1Region: string | null;
    p1TekkenPower: number;
    p1DanRank: string;
    p1RoundsWon: number;
    
    p2Name: string;
    p2PolarisId: string;
    p2Char: string;
    p2Region: number | null;
    p2DanRank: string;
    p2TekkenPower: number;
    p2RoundsWon: number;
}

export interface StatPentagonData {
    defense: number;
    attack: number;
    technique: number;
    appeal: number;
    spirit: number;
    attackComponents: {
      heavyDamage: number;
      aggressiveness: number;
      dominance: number;
      attackFrequency: number;
    };
    defenseComponents: {
      composure: number;
      block: number;
      evasion: number;
      throwEscape: number;
    };
    techniqueComponents: {
      judgement: number;
      stageUse: number;
      retaliation: number;
      accuracy: number;
    };
    spiritComponents: {
      closeBattles: number;
      concentration: number;
      fightingSpirit: number;
      comeback: number;
    };
    appealComponents: {
      fairness: number;
      ambition: number;
      versatility: number;
      respect: number;
    };
  }

