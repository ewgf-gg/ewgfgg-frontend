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
    latestBattle: number;
    mainCharacterAndRank: MainCharacterAndRank;
    playedCharacters?: Record<string, PlayedCharacter>;
}

export enum BattleType {
    QUICK_BATTLE = "Quick Battle",
    RANKED_BATTLE = "Ranked Battle",
    GROUP_BATTLE = "Group Battle",
    PLAYER_BATTLE = "Player Battle"
}

// Map to convert numeric battle type from payload to BattleType enum
export const battleTypeMap: { [key: number]: BattleType } = {
    1: BattleType.QUICK_BATTLE,
    2: BattleType.RANKED_BATTLE,
    3: BattleType.GROUP_BATTLE,
    4: BattleType.PLAYER_BATTLE
};

export interface Battle {
    date: string;
    battleType: BattleType;
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

export interface Matchup {
    wins: number;
    losses: number;
    winRate: number;
    totalMatches: number;
}

export interface PlayedCharacter {
    wins: number;
    losses: number;
    currentSeasonDanRank: number | null;
    previousSeasonDanRank: number;
    characterWinrate: number;
    bestMatchup: Record<string, number>;
    worstMatchup: Record<string, number>;
    matchups: Record<string, Matchup>;
}

export interface PlayerStats {
    polarisId: string;
    name: string;
    tekkenPower: number;
    latestBattle: number;
    regionId: number;
    mainCharacterAndRank: MainCharacterAndRank;
    playedCharacters: Record<string, PlayedCharacter>;
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
    totalRankedReplays: number;
    totalPlayers: number;
    totalUnrankedReplays: number;
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
    formattedTekkenId: string;
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
      description: "from Fujin → Tekken Emperor"
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
    29: 'God of Destruction',
    30: 'God of Destruction I',
    31: 'God Of Destruction II',
    32: 'God of Destruction III',
    33: 'God of Destruction IV',
    34: 'God of Destruction V',
    35: 'God of Destruction VI',
    36: 'God of Destruction VII',
    37: 'God of Destruction Infinity',
    100: 'God of Destruction',
    101: 'God of Destruction I',
    102: 'God Of Destruction II',
    103: 'God of Destruction III',
    104: 'God of Destruction IV',
    105: 'God of Destruction V',
    106: 'God of Destruction VI',
    107: 'God of Destruction VII',
    765: 'God of Destruction Infinity'
};
  
export const rankIconMap: { [key: string]: string } = {
    'Beginner': '/static/rank-icons/BeginnerT8.webp',
    '1st Dan': '/static/rank-icons/1stDanT8.webp',
    '2nd Dan': '/static/rank-icons/2ndDanT8.webp',
    'Fighter': '/static/rank-icons/FighterT8.webp',
    'Strategist': '/static/rank-icons/StrategistT8.webp',
    'Combatant': '/static/rank-icons/CombatantT8.webp',
    'Brawler': '/static/rank-icons/BrawlerT8.webp',
    'Ranger': '/static/rank-icons/RangerT8.webp',
    'Cavalry': '/static/rank-icons/CavalryT8.webp',
    'Warrior': '/static/rank-icons/WarriorT8.webp',
    'Assailant': '/static/rank-icons/AssailantT8.webp',
    'Dominator': '/static/rank-icons/DominatorT8.webp',
    'Vanquisher': '/static/rank-icons/VanquisherT8.webp',
    'Destroyer': '/static/rank-icons/DestroyerT8.webp',
    'Eliminator': '/static/rank-icons/EliminatorT8.webp',
    'Garyu': '/static/rank-icons/GaryuT8.webp',
    'Shinryu': '/static/rank-icons/ShinryuT8.webp',
    'Tenryu': '/static/rank-icons/TenryuT8.webp',
    'Mighty Ruler': '/static/rank-icons/MightyRulerT8.webp',
    'Flame Ruler': '/static/rank-icons/FlameRulerT8.webp',
    'Battle Ruler': '/static/rank-icons/BattleRulerT8.webp',
    'Fujin': '/static/rank-icons/FujinT8.webp',
    'Raijin': '/static/rank-icons/RaijinT8.webp',
    'Kishin': '/static/rank-icons/KishinT8.webp',
    'Bushin': '/static/rank-icons/BushinT8.webp',
    'Tekken King': '/static/rank-icons/TekkenKingT8.webp',
    'Tekken Emperor': '/static/rank-icons/TekkenEmperorT8.webp',
    'Tekken God': '/static/rank-icons/TekkenGodT8.webp',
    'Tekken God Supreme': '/static/rank-icons/TekkenGodSupremeT8.webp',
    'God of Destruction': '/static/rank-icons/GodOfDestructionT8.webp',
    'God of Destruction I': '/static/rank-icons/GodOfDestruction1T8.webp',
    'God Of Destruction II': '/static/rank-icons/GodOfDestruction2T8.webp',
    'God of Destruction III': '/static/rank-icons/GodOfDestruction3T8.webp',
    'God of Destruction IV': '/static/rank-icons/GodOfDestruction4T8.webp',
    'God of Destruction V': '/static/rank-icons/GodOfDestruction5T8.webp',
    'God of Destruction VI': '/static/rank-icons/GodOfDestruction6T8.webp',
    'God of Destruction VII': '/static/rank-icons/GodOfDestruction7T8.webp',
    'God of Destruction Infinity': '/static/rank-icons/GodOfDestructionInfT8.webp'
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
    41: 'Clive',
    42: 'Anna'
};

export const characterIconMap: { [key: string]: string } = {
    'Alisa': '/static/character-icons/AlisaT8.webp',
    'Asuka': '/static/character-icons/AsukaT8.webp',
    'Bryan': '/static/character-icons/BryanT8.webp',
    'Claudio': '/static/character-icons/ClaudioT8.webp',
    'Clive': '/static/character-icons/CliveT8.webp',
    'Devil Jin': '/static/character-icons/Devil_JinT8.webp',
    'Devil_Jin': '/static/character-icons/Devil_JinT8.webp',
    'Dragunov': '/static/character-icons/DragunovT8.webp',
    'Feng': '/static/character-icons/FengT8.webp',
    'Hwoarang': '/static/character-icons/HwoarangT8.webp',
    'Jack-8': '/static/character-icons/Jack-8T8.webp',
    'Jin': '/static/character-icons/JinT8.webp',
    'Jun': '/static/character-icons/JunT8.webp',
    'Kazuya': '/static/character-icons/KazuyaT8.webp',
    'King': '/static/character-icons/KingT8.webp',
    'Kuma': '/static/character-icons/KumaT8.webp',
    'Heihachi': '/static/character-icons/HeihachiT8.webp',
    'Lidia': '/static/character-icons/LidiaT8.webp',
    'Eddy': '/static/character-icons/EddyT8.webp',
    'Reina': '/static/character-icons/ReinaT8.webp',
    'Victor': '/static/character-icons/VictorT8.webp',
    'Lars': '/static/character-icons/LarsT8.webp',
    'Law': '/static/character-icons/LawT8.webp',
    'Lee': '/static/character-icons/LeeT8.webp',
    'Leroy': '/static/character-icons/LeroyT8.webp',
    'Azucena': '/static/character-icons/AzucenaT8.webp',
    'Leo': '/static/character-icons/LeoT8.webp',
    'Lili': '/static/character-icons/LiliT8.webp',
    'Nina': '/static/character-icons/NinaT8.webp',
    'Panda': '/static/character-icons/PandaT8.webp',
    'Paul': '/static/character-icons/PaulT8.webp',
    'Raven': '/static/character-icons/RavenT8.webp',
    'Shaheen': '/static/character-icons/ShaheenT8.webp',
    'Steve': '/static/character-icons/SteveT8.webp',
    'Xiaoyu': '/static/character-icons/XiaoyuT8.webp',
    'Yoshimitsu': '/static/character-icons/YoshimitsuT8.webp',
    'Zafina': '/static/character-icons/ZafinaT8.webp',
    'Anna': '/static/character-icons/AnnaT8.webp'
};