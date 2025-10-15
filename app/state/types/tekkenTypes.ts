// types/tekkenTypes.ts

export interface LeaderboardEntry {
  ranking: number;
  playerName: string;
  polarisId: string;
  platform: number;
  score: number;
  rank: number;
  charaId: string;
}

export interface LeaderboardData {
  rankPointsLeaderboard: LeaderboardEntry[];
  tekkenProwessLeaderboard: LeaderboardEntry[];
}

export interface ColorMapping {
    id: string;
    color: string;
}
  
export interface RankDistribution {
    rank: string;
    percentage: number;
}

export interface CharacterStats {
    characterName: string;
    danName: string;
    danRank: number;
    wins: number;
    losses: number;
}

export interface MainCharacterAndRank {
    danRank: string;
    characterName: string;
}
  

export interface CharacterStatsWithVersion extends CharacterStats {
    gameVersion: string;
    characterId: number;
}

// New types for the refactored homepage
export interface PickrateEntry {
    tkChar: string;
    game_version: number | null;
    total_battles: number;
    pick_rate: number;
}

export interface WinrateEntry {
    tkChar: string;
    game_version: number | null;
    total_wins: number;
    total_games: number;
    win_rate: number;
}

export interface TrendEntry {
    asOfDate: string;
    tkChar: string;
    newWr: number;
    oldWr: number;
    delta: number;
    trend: 'increase' | 'decrease';
}

export interface ActivePlayerRegion {
    region: string;
    count: number;
}

export interface RankDistributionEntry {
    dan_rank: number;
    player_count: number;
    percentage: number;
    cumulative_percentage: number;
}

export interface VersionDistribution {
    distribution_type: string;
    game_version: number;
    as_of_date: string | null;
    entries: RankDistributionEntry[];
}

export interface HomepageData {
    "30d_pickrates": PickrateEntry[];
    "30d_winrates": WinrateEntry[];
    "30d_trends": TrendEntry[];
    "ver_pickrates": PickrateEntry[];
    "ver_winrates": WinrateEntry[];
    "ver_trends": TrendEntry[];
    "active_players": ActivePlayerRegion[];
    "ver_distribution": VersionDistribution[];
    "30d_rank_distib": RankDistributionEntry[];
}

export interface HomeContentProps {
    initialData: HomepageData;
}

export interface VersionStats {
    [version: string]: {
        [rank: string]: {
            globalStats: { [character: string]: number };
            regionalStats: { [region: string]: { [character: string]: number } };
        };
    };
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

export interface PlayerSearchResult {
    name: string;
    polarisId: string;
    isBanned: boolean;
    isVerified: boolean;
    isDonor: boolean;
    region: string;
    mainChar: Record<string, string>; // Map of TekkenCharacter to DanRank name (e.g., {"Alisa": "BUSHIN"})
    lastSeen: string; 
}
  
export interface SearchFormProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e: React.FormEvent) => Promise<void>;
    isLoading: boolean;
    errorMessage: string;
}
  

  
export interface WinrateChange {
    characterId: string;
    change: number;
    trend: 'increase' | 'decrease';
    rankCategory: string;
}

  
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
  
// Mapping from backend enum names to display labels
export const rankEnumToLabel: { [key: string]: string } = {
    'BEGINNER': 'Beginner',
    'DAN_1': '1st Dan',
    'DAN_2': '2nd Dan',
    'FIGHTER': 'Fighter',
    'STRATEGIST': 'Strategist',
    'COMBATANT': 'Combatant',
    'BRAWLER': 'Brawler',
    'RANGER': 'Ranger',
    'CAVALRY': 'Cavalry',
    'WARRIOR': 'Warrior',
    'ASSAILANT': 'Assailant',
    'DOMINATOR': 'Dominator',
    'VANQUISHER': 'Vanquisher',
    'DESTROYER': 'Destroyer',
    'ELIMINATOR': 'Eliminator',
    'GARYU': 'Garyu',
    'SHINRYU': 'Shinryu',
    'TENRYU': 'Tenryu',
    'MIGHTY_RULER': 'Mighty Ruler',
    'FLAME_RULER': 'Flame Ruler',
    'BATTLE_RULER': 'Battle Ruler',
    'FUJIN': 'Fujin',
    'RAIJIN': 'Raijin',
    'KISHIN': 'Kishin',
    'BUSHIN': 'Bushin',
    'TEKKEN_KING': 'Tekken King',
    'TEKKEN_EMPEROR': 'Tekken Emperor',
    'TEKKEN_GOD': 'Tekken God',
    'TEKKEN_GOD_SUPREME': 'Tekken God Supreme',
    'GOD_OF_DESTRUCTION': 'God of Destruction',
    'GOD_OF_DESTRUCTION_I': 'God of Destruction I',
    'GOD_OF_DESTRUCTION_II': 'God of Destruction II',
    'GOD_OF_DESTRUCTION_III': 'God of Destruction III',
    'GOD_OF_DESTRUCTION_IV': 'God of Destruction IV',
    'GOD_OF_DESTRUCTION_V': 'God of Destruction V',
    'GOD_OF_DESTRUCTION_VI': 'God of Destruction VI',
    'GOD_OF_DESTRUCTION_VII': 'God of Destruction VII',
    'GOD_OF_DESTRUCTION_INFINITY': 'God of Destruction Infinity',
    'GOD_OF_DESTRUCTION_ALT': 'God of Destruction',
    'GOD_OF_DESTRUCTION_I_ALT': 'God of Destruction I',
    'GOD_OF_DESTRUCTION_II_ALT': 'God of Destruction II',
    'GOD_OF_DESTRUCTION_III_ALT': 'God of Destruction III',
    'GOD_OF_DESTRUCTION_IV_ALT': 'God of Destruction IV',
    'GOD_OF_DESTRUCTION_V_ALT': 'God of Destruction V',
    'GOD_OF_DESTRUCTION_VI_ALT': 'God of Destruction VI',
    'GOD_OF_DESTRUCTION_VII_ALT': 'God of Destruction VII',
    'GOD_OF_DESTRUCTION_INFINITY_ALT': 'God of Destruction Infinity'
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
    'God of Destruction II': '/static/rank-icons/GodOfDestruction2T8.webp',
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
    42: 'Anna',
    43: 'Fahkumram'
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
    'Anna': '/static/character-icons/AnnaT8.webp',
    'Fahkumram': '/static/character-icons/FahkumramT8.webp'
};

export const circularCharacterIconMap: { [key: string]: string } = {
    'Alisa': '/static/circular_character_icons/alisa.webp',
    'Asuka': '/static/circular_character_icons/asuka.webp',
    'Bryan': '/static/circular_character_icons/bryan.webp',
    'Claudio': '/static/circular_character_icons/claudio.webp',
    'Clive': '/static/circular_character_icons/clive.webp',
    'Devil Jin': '/static/circular_character_icons/devil_jin.webp',
    'Dragunov': '/static/circular_character_icons/dragunov.webp',
    'Feng': '/static/circular_character_icons/feng.webp',
    'Hwoarang': '/static/circular_character_icons/hwoarang.webp',
    'Jack-8': '/static/circular_character_icons/jack-8.webp',
    'Jin': '/static/circular_character_icons/jin.webp',
    'Jun': '/static/circular_character_icons/jun.webp',
    'Kazuya': '/static/circular_character_icons/kazuya.webp',
    'King': '/static/circular_character_icons/king.webp',
    'Kuma': '/static/circular_character_icons/kuma.webp',
    'Heihachi': '/static/circular_character_icons/heihachi.webp',
    'Lidia': '/static/circular_character_icons/lidia.webp',
    'Eddy': '/static/circular_character_icons/eddy.webp',
    'Reina': '/static/circular_character_icons/reina.webp',
    'Victor': '/static/circular_character_icons/victor.webp',
    'Lars': '/static/circular_character_icons/lars.webp',
    'Law': '/static/circular_character_icons/law.webp',
    'Lee': '/static/circular_character_icons/lee.webp',
    'Leroy': '/static/circular_character_icons/leroy.webp',
    'Azucena': '/static/circular_character_icons/azucena.webp',
    'Leo': '/static/circular_character_icons/leo.webp',
    'Lili': '/static/circular_character_icons/lili.webp',
    'Nina': '/static/circular_character_icons/nina.webp',
    'Panda': '/static/circular_character_icons/panda.webp',
    'Paul': '/static/circular_character_icons/paul.webp',
    'Raven': '/static/circular_character_icons/raven.webp',
    'Shaheen': '/static/circular_character_icons/shaheen.webp',
    'Steve': '/static/circular_character_icons/steve.webp',
    'Xiaoyu': '/static/circular_character_icons/xiaoyu.webp',
    'Yoshimitsu': '/static/circular_character_icons/yoshimitsu.webp',
    'Zafina': '/static/circular_character_icons/zafina.webp',
    'Anna': '/static/circular_character_icons/anna.webp',
    'Fahkumram': '/static/circular_character_icons/fahkumram.webp'
};


export interface ColorMapping {
  id: string;
  color: string;
}

export const rankColorsAtom: ColorMapping[] = [
  { id: 'Beginner', color: '#99582A' },
  { id: '1st Dan', color: '#adb5bd' },
  { id: '2nd Dan', color: '#7d8597' },
  { id: 'Fighter', color: '#48cae4' },
  { id: 'Strategist', color: '#00b4d8' },
  { id: 'Combatant', color: '#0077b6' },
  { id: 'Brawler', color: '#38b000' },
  { id: 'Ranger', color: '#008000' },
  { id: 'Cavalry', color: '#006400' },
  { id: 'Warrior', color: '#ffea00' },
  { id: 'Assailant', color: '#ffd000' },
  { id: 'Dominator', color: '#ffb700' },
  { id: 'Vanquisher', color: '#ff8500' },
  { id: 'Destroyer', color: '#ff6d00' },
  { id: 'Eliminator', color: '#ff4800' },
  { id: 'Garyu', color: '#ad2831' },
  { id: 'Shinryu', color: '#800e13' },
  { id: 'Tenryu', color: '#640d14' },
  { id: 'Mighty Ruler', color: '#7b2cbf' },
  { id: 'Flame Ruler', color: '#5a189a' },
  { id: 'Battle Ruler', color: '#3c096c' },
  { id: 'Fujin', color: '#014f86' },
  { id: 'Raijin', color: '#01497c' },
  { id: 'Kishin', color: '#013a63' },
  { id: 'Bushin', color: '#012a4a' },
  { id: 'Tekken King', color: '#240046' },
  { id: 'Tekken Emperor', color: '#240046' },
  { id: 'Tekken God', color: '#ffe94e' },
  { id: 'Tekken God Supreme', color: '#b69121' },
  { id: 'God of Destruction', color: '#9e0059' }
];

export const characterColors: ColorMapping[] = [
  { id: '0', color: '#4169E1' },  // Paul - Royal Blue
  { id: '1', color: '#FFD700' },  // Law - Gold
  { id: '2', color: '#f48c06' },  // King - Dark Red
  { id: '3', color: '#0096c7' },  // Yoshimitsu - Teal
  { id: '4', color: '#FF4500' },  // Hwoarang - Orange Red
  { id: '5', color: '#FF69B4' },  // Xiaoyu - Hot Pink
  { id: '6', color: '#343a40' },  // Jin - Dark Grey
  { id: '7', color: '#696969' },  // Bryan - Dim Gray
  { id: '8', color: '#1d3557' },  // Kazuya - Dark Blue
  { id: '9', color: '#B8860B' },  // Steve - Dark Golden Rod
  { id: '10', color: '#708090' }, // Jack-8 - Slate Gray
  { id: '11', color: '#b8c0ff' }, // Asuka - Baby Blue
  { id: '12', color: '#9b2226' }, // Devil Jin - Dark Red
  { id: '13', color: '#f6bd60' }, // Feng - Light gold 
  { id: '14', color: '#DDA0DD' }, // Lili - Plum
  { id: '15', color: '#2F4F4F' }, // Dragunov - Dark Slate Gray
  { id: '16', color: '#e5383b' }, // Leo - Lighter red
  { id: '17', color: '#4682B4' }, // Lars - Steel Blue
  { id: '18', color: '#ff8fab' }, // Alisa - Light Pink
  { id: '19', color: '#dee2e6' }, // Claudio - Light Gray
  { id: '20', color: '#eae2b7' }, // Shaheen - Tan
  { id: '21', color: '#800080' }, // Nina - Purple
  { id: '22', color: '#483D8B' }, // Lee - Dark Slate Blue
  { id: '23', color: '#8B4513' }, // Kuma - Saddle Brown
  { id: '24', color: '#fb6f92' }, // Panda - Salmon Pink
  { id: '28', color: '#9400D3' }, // Zafina - Dark Violet
  { id: '29', color: '#2F4F4F' }, // Leroy - Dark Slate Gray
  { id: '32', color: '#e9ecef' }, // Jun - Offwhite
  { id: '33', color: '#5e548e' }, // Reina - Purple
  { id: '34', color: '#d00000' }, // Azucena - Red
  { id: '35', color: '#B22222' }, // Victor - Fire Brick
  { id: '36', color: '#003049' }, // Raven - Indigo
  { id: '38', color: '#228B22' }, // Eddy - Forest Green
  { id: '39', color: '#CD5C5C' }, // Lidia - Indian Red
  { id: '40', color: '#808080' }, // Heihachi - Gray
  { id: '41', color: '#6a040f' }, // Clive - Dark Red.
  { id: '42', color: '#14213d'}, // Anna - Pale Dark Blue
  { id: '43', color: '#e36414'} // Fahkumram - Orange
];

export const rankDivisionColors: ColorMapping[] = [
  { id: '0', color: '#99582A' },
  { id: '1', color: '#adb5bd' },
  { id: '2', color: '#38b000' },
  { id: '3', color: '#ffb700' },
  { id: '4', color: '#ff4800' },
  { id: '5', color: '#800e13' },
  { id: '6', color: '#7b2cbf' },
  { id: '7', color: '#014f86' },
  { id: '8', color: '#240046' },
  { id: '9', color: '#10002b'},
  { id: '10', color: '#ffe94e'},
  { id: '11', color: '#b69121'},
  { id: '12', color: '#9e0059'}
];

// Region colors for the new pie chart
export const regionColors: { [key: string]: string } = {
  'ASIA': '#4169E1',      // Royal Blue
  'AMERICAS': '#228B22',   // Forest Green
  'EUROPE': '#FFD700',     // Gold
  'OCEANIA': '#FF4500',    // Orange Red
  'MIDDLE_EAST': '#9400D3' // Dark Violet
};
