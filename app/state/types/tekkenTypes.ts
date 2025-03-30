// types/tekkenTypes.ts

export interface ColorMapping {
    id: string;
    color: string;
}
  
export interface RankDistribution {
    rank: string;
    percentage: number;
}
  
export type DistributionMode = 'overall' | 'standard';
export type GameVersion = string;
  
export type GameRankDistribution = {
    [key: string]: {
      [mode in DistributionMode]: RankDistribution[];
    };
}

export interface PlayerMetadata{
    playerName: string;
    polarisId: string;
    regionId: number;
    areaId: number;
    latestBattleDate: string;
    tekkenPower: number;
    mainCharacterAndRank: Record<string, string>;
}

export interface CharacterStats {
    characterName: string;
    danName: string;
    danRank: number;
    wins: number;
    losses: number;
}

export interface FormattedCharacter {
    name: string;
    matches: number;
    winRate: number;
}
  
export interface FormattedMatch {
    opponent: string;
    character: string;
    result: 'win' | 'loss';
    date: string;
}

export interface MainCharacterAndRank {
    danRank: string;
    characterName: string;
}
  
export interface FormattedPlayerStats {
    username: string;
    polarisId: string;
    rank: string;
    winRate: number;
    totalMatches: number;
    favoriteCharacters: FormattedCharacter[];
    recentMatches: FormattedMatch[];
    characterStatsWithVersion: CharacterStatsWithVersion[];
    characterBattleStats: CharacterBattleStats[];
    battles: Battle[];
    regionId: number;
    areaId: number;
    latestBattle: number;
    mainCharacterAndRank: MainCharacterAndRank;
}

export interface Battle {
    date: string;
    player1Name: string;
    player1CharacterId: number;
    player1PolarisId: string;
    player1DanRank: number | null;
    player1RegionId: number | null;
    player1TekkenPower: number;
    player2Name: string;
    player2CharacterId: number;
    player2PolarisId: string;
    player2DanRank: number | null;
    player2RegionId: number | null;
    player2TekkenPower: number;
    player1RoundsWon: number;
    player2RoundsWon: number;
    winner: number;
    stageId: number;
    gameVersion: string;
}

export interface CharacterStatsWithVersion extends CharacterStats {
    gameVersion: string;
    characterId: number;
}

export interface CharacterBattleStats {
    characterId: number;
    characterName: string;
    totalBattles: number;
    percentage: number;
}

export interface PlayerStats {
    playerId: string;
    name: string;
    tekkenPower: number;
    latestBattle: number;
    regionId: number;
    areaId: number;
    mainCharacterAndRank: MainCharacterAndRank;
    characterStats: Record<string, CharacterStats>;
    battles: Battle[];
}

export interface HomeContentProps {
    initialData: InitialData;
}
  
export interface ChartProps {
    title: string;
    description?: string;
    delay?: number;
    rank: string;
    onRankChange: (value: string) => void;
}
  
export interface ChartData {
    character: string;
    value: number;
    originalValue: number;
}

export interface RankStats {
    globalStats: { [character: string]: number };
    regionalStats: { [region: string]: { [character: string]: number } };
}

export interface RecentlyActivePlayer {
    name: string;
    characterAndRank: {
        danRank: string;
        characterName: string;
    };
    tekkenPower: number;
    region: number;
    lastSeen: number;
    polarisId: string;
}

export interface InitialData {
    totalReplays: number;
    totalPlayers: number;
    characterWinrates: {
        masterRanks: RankStats;
        advancedRanks: RankStats;
        intermediateRanks: RankStats;
        beginnerRanks: RankStats;
    };
    characterPopularity: {
        masterRanks: RankStats;
        advancedRanks: RankStats;
        intermediateRanks: RankStats;
        beginnerRanks: RankStats;
    };
    rankDistribution: GameRankDistribution;
    winrateChanges: RankWinrateChanges;
    recentlyActivePlayers: RecentlyActivePlayer[];
}

export interface PlayerSearchResult {
    id: string;
    name: string;
    tekkenId?: string;
    regionId: number;
    mostPlayedCharacter?: string;
    danRankName?: string;
}
  
export interface SearchFormProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e: React.FormEvent) => Promise<void>;
    isLoading: boolean;
    errorMessage: string;
}
  
export interface WinrateChangeData extends ChartData {
    trend: 'increase' | 'decrease';
}
  
export type RankOption = {
    value: string;
    label: string;
    description: string;
};
  
export interface CharacterWinrates {
    masterRanks: RankStats;
    advancedRanks: RankStats;
    intermediateRanks: RankStats;
    beginnerRanks: RankStats;
}
  
export interface CharacterPopularity {
    masterRanks: RankStats;
    advancedRanks: RankStats;
    intermediateRanks: RankStats;
    beginnerRanks: RankStats;
}
  
export interface WinrateChange {
    characterId: string;
    change: number;
    trend: 'increase' | 'decrease';
    rankCategory: string;
}
  
export interface RankWinrateChanges {
    master: WinrateChange[];
    advanced: WinrateChange[];
    intermediate: WinrateChange[];
    beginner: WinrateChange[];
}

export interface VersionStats {
    [version: string]: {
        allRanks: RankStats;
        masterRanks: RankStats;
        advancedRanks: RankStats;
        intermediateRanks: RankStats;
        beginnerRanks: RankStats;
    };
}

// Constants
export const RANK_OPTIONS: RankOption[] = [
    {
        value: "masterRanks",
        label: "Master",
        description: "in Tekken God and above"
    },
    { 
      value: "advancedRanks", 
      label: "Advanced",
      description: "from Fujin→ Tekken King"
    },
    { 
      value: "intermediateRanks", 
      label: "Intermediate",
      description: "from Garyu → Battle Ruler"
    },
    { 
      value: "beginnerRanks", 
      label: "Beginner",
      description: "in Eliminator and below"
    }
];
  
export const Regions: {[key: number]: string} = {
    [-1]: 'N/A', //typescript/javascript is so weird
    0: 'Asia',
    1: 'Middle East',
    2: 'Oceania',
    3: 'Americas',
    4: 'Europe'
};
  
export const rankOrderMap: { [key: number]: string } = {
    0: 'Beginner',
    1: '1st Dan',
    2: '2nd Dan',
    3: 'Fighter',
    4: 'Strategist',
    5: 'Combatant',
    6: 'Brawler',
    7: 'Ranger',
    8: 'Cavalry',
    9: 'Warrior',
    10: 'Assailant',
    11: 'Dominator',
    12: 'Vanquisher',
    13: 'Destroyer',
    14: 'Eliminator',
    15: 'Garyu',
    16: 'Shinryu',
    17: 'Tenryu',
    18: 'Mighty Ruler',
    19: 'Flame Ruler',
    20: 'Battle Ruler',
    21: 'Fujin',
    22: 'Raijin',
    23: 'Kishin',
    24: 'Bushin',
    25: 'Tekken King',
    26: 'Tekken Emperor',
    27: 'Tekken God',
    28: 'Tekken God Supreme',
    29: 'God of Destruction'
};
  
export const rankIconMap: { [key: string]: string } = {
    'Beginner': '/static/rank-icons/BeginnerT8.png',
    '1st Dan': '/static/rank-icons/1stDanT8.png',
    '2nd Dan': '/static/rank-icons/2ndDanT8.png',
    'Fighter': '/static/rank-icons/FighterT8.png',
    'Strategist': '/static/rank-icons/StrategistT8.png',
    'Combatant': '/static/rank-icons/CombatantT8.png',
    'Brawler': '/static/rank-icons/BrawlerT8.png',
    'Ranger': '/static/rank-icons/RangerT8.png',
    'Cavalry': '/static/rank-icons/CavalryT8.png',
    'Warrior': '/static/rank-icons/WarriorT8.png',
    'Assailant': '/static/rank-icons/AssailantT8.png',
    'Dominator': '/static/rank-icons/DominatorT8.png',
    'Vanquisher': '/static/rank-icons/VanquisherT8.png',
    'Destroyer': '/static/rank-icons/DestroyerT8.png',
    'Eliminator': '/static/rank-icons/EliminatorT8.png',
    'Garyu': '/static/rank-icons/GaryuT8.png',
    'Shinryu': '/static/rank-icons/ShinryuT8.png',
    'Tenryu': '/static/rank-icons/TenryuT8.png',
    'Mighty Ruler': '/static/rank-icons/MightyRulerT8.png',
    'Flame Ruler': '/static/rank-icons/FlameRulerT8.png',
    'Battle Ruler': '/static/rank-icons/BattleRulerT8.png',
    'Fujin': '/static/rank-icons/FujinT8.png',
    'Raijin': '/static/rank-icons/RaijinT8.png',
    'Kishin': '/static/rank-icons/KishinT8.png',
    'Bushin': '/static/rank-icons/BushinT8.png',
    'Tekken King': '/static/rank-icons/TekkenKingT8.png',
    'Tekken Emperor': '/static/rank-icons/TekkenEmperorT8.png',
    'Tekken God': '/static/rank-icons/TekkenGodT8.png',
    'Tekken God Supreme': '/static/rank-icons/TekkenGodSupremeT8.png',
    'God of Destruction': '/static/rank-icons/GodOfDestructionT8.png'
};

export const characterIdMap: { [key: number]: string} = {
    0: 'Paul',
    1: 'Law',
    2: 'King',
    3: 'Yoshimitsu',
    4: 'Hwoarang',
    5: 'Xiaoyu',
    6: 'Jin',
    7: 'Bryan',
    8: 'Kazuya',
    9: 'Steve',
    10: 'Jack-8',
    11: 'Asuka',
    12: 'Devil Jin',
    13: 'Feng',
    14: 'Lili',
    15: 'Dragunov',
    16: 'Leo',
    17: 'Lars',
    18: 'Alisa',
    19: 'Claudio',
    20: 'Shaheen',
    21: 'Nina',
    22: 'Lee',
    23: 'Kuma',
    24: 'Panda',
    28: 'Zafina',
    29: 'Leroy',
    32: 'Jun',
    33: 'Reina',
    34: 'Azucena',
    35: 'Victor',
    36: 'Raven',
    38: 'Eddy',
    39: 'Lidia',
    40: 'Heihachi',
    41: 'Clive'
};

export const characterIconMap: { [key: string]: string } = {
    'Alisa': '/static/character-icons/AlisaT8.png',
    'Asuka': '/static/character-icons/AsukaT8.png',
    'Bryan': '/static/character-icons/BryanT8.png',
    'Claudio': '/static/character-icons/ClaudioT8.png',
    'Clive': '/static/character-icons/CliveT8.png',
    'Devil Jin': '/static/character-icons/Devil_JinT8.png',
    'Devil_Jin': '/static/character-icons/Devil_JinT8.png',
    'Dragunov': '/static/character-icons/DragunovT8.png',
    'Feng': '/static/character-icons/FengT8.png',
    'Hwoarang': '/static/character-icons/HwoarangT8.png',
    'Jack-8': '/static/character-icons/Jack-8T8.png',
    'Jin': '/static/character-icons/JinT8.png',
    'Jun': '/static/character-icons/JunT8.png',
    'Kazuya': '/static/character-icons/KazuyaT8.png',
    'King': '/static/character-icons/KingT8.png',
    'Kuma': '/static/character-icons/KumaT8.png',
    'Heihachi': '/static/character-icons/HeihachiT8.png',
    'Lidia': '/static/character-icons/LidiaT8.png',
    'Eddy': '/static/character-icons/EddyT8.png',
    'Reina': '/static/character-icons/ReinaT8.png',
    'Victor': '/static/character-icons/VictorT8.png',
    'Lars': '/static/character-icons/LarsT8.png',
    'Law': '/static/character-icons/LawT8.png',
    'Lee': '/static/character-icons/LeeT8.png',
    'Leroy': '/static/character-icons/LeroyT8.png',
    'Azucena': '/static/character-icons/AzucenaT8.png',
    'Leo': '/static/character-icons/LeoT8.png',
    'Lili': '/static/character-icons/LiliT8.png',
    'Nina': '/static/character-icons/NinaT8.png',
    'Panda': '/static/character-icons/PandaT8.png',
    'Paul': '/static/character-icons/PaulT8.png',
    'Raven': '/static/character-icons/RavenT8.png',
    'Shaheen': '/static/character-icons/ShaheenT8.png',
    'Steve': '/static/character-icons/SteveT8.png',
    'Xiaoyu': '/static/character-icons/XiaoyuT8.png',
    'Yoshimitsu': '/static/character-icons/YoshimitsuT8.png',
    'Zafina': '/static/character-icons/ZafinaT8.png'
};