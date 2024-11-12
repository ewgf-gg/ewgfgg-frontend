// types/tekkenTypes.ts

export interface RankColor {
    rank: string;
    color: string;
  }
  
  export interface RankDistribution {
    rank: string;
    percentage: number;
  }
  
  export type DistributionMode = 'overall' | 'standard';
  export type GameVersion = '10901' | '10701';
  
  export type GameRankDistribution = {
    [key in GameVersion]: {
      [mode in DistributionMode]: RankDistribution[];
    };
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

  export interface InitialData {
    totalReplays: number;
    totalPlayers: number;
    characterWinrates: {
      highRank: { [character: string]: number };
      mediumRank: { [character: string]: number };
      lowRank: { [character: string]: number };
    };
    characterPopularity: {
      highRank: { [character: string]: number };
      mediumRank: { [character: string]: number };
      lowRank: { [character: string]: number };
    };
    gameVersions: string[];
    rankDistribution: GameRankDistribution;
    winrateChanges: RankWinrateChanges;
  }

  export interface PlayerSearchResult {
    id: string;
    name: string;
    tekkenId?: string;
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
    highRank: { [character: string]: number };
    mediumRank: { [character: string]: number };
    lowRank: { [character: string]: number };
  }
  
  export interface CharacterPopularity {
    highRank: { [character: string]: number };
    mediumRank: { [character: string]: number };
    lowRank: { [character: string]: number };
  }
  
  export interface WinrateChange {
    characterId: string;
    change: number;
    trend: 'increase' | 'decrease';
    rankCategory: string;
  }
  
  export interface RankWinrateChanges {
    highRank: WinrateChange[];
    mediumRank: WinrateChange[];
    lowRank: WinrateChange[];
  }
  
  // Constants
  export const RANK_OPTIONS: RankOption[] = [
    { 
      value: "highRank", 
      label: "Tekken King+",
      description: "in Tekken King and above"
    },
    { 
      value: "mediumRank", 
      label: "Garyu→Bushin",
      description: "from Garyu → Bushin"
    },
    { 
      value: "lowRank", 
      label: "Eliminator-",
      description: "in Eliminator and below"
    }
  ];
  
  export const Regions: {[key: number]: string} = {
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
  
  export const characterIconMap: { [key: string]: string } = {
    'Asuka': '/static/character-icons/AsukaT8.png',
    'Bryan': '/static/character-icons/BryanT8.png',
    'Claudio': '/static/character-icons/ClaudioT8.png',
    'Devil Jin': '/static/character-icons/DevilJinT8.png',
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
    'Lidia': 'static/character-icons/LidiaT8.png',
    'Eddy': 'static/character-icons/EddyT8.png',
    'Reina': 'static/character-icons/ReinaT8.png',
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