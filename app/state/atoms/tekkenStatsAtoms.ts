// atoms/tekkenStatsAtoms.ts

import { atom } from 'jotai';
import type { 
  ColorMapping, 
  CharacterWinrates, 
  CharacterPopularity, 
  RankWinrateChanges,
  GameRankDistribution,
  PlayerStats,
  RankStats
} from '../types/tekkenTypes';

const initialRankStats: RankStats = {
  globalStats: {},
  regionalStats: {}
};

const initialWinrates: CharacterWinrates = {
  highRank: initialRankStats,
  mediumRank: initialRankStats,
  lowRank: initialRankStats
};

const initialPopularity: CharacterPopularity = {
  highRank: initialRankStats,
  mediumRank: initialRankStats,
  lowRank: initialRankStats
};

const initialWinrateChanges: RankWinrateChanges = {
  highRank: [],
  mediumRank: [],
  lowRank: []
};

export const rankColorsAtom = atom<ColorMapping[]>([
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
  { id: 'Tekken Emperor', color: '#10002b' },
  { id: 'Tekken God', color: '#ffe94e' },
  { id: 'Tekken God Supreme', color: '#b69121' },
  { id: 'God of Destruction', color: '#9e0059' }
]);

export const characterColors = atom<ColorMapping[]>([
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
  { id: '16', color: '#800000' }, // Leo - Peru
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
  { id: '41', color: '#780000' } // Clive - Dark Red
]);

export const rankDivisionColors = atom<ColorMapping[]>([
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
]);

export const totalReplaysAtom = atom<number>(0);
export const totalPlayersAtom = atom<number>(0);
export const gameVersionsAtom = atom<string[]>([]);
export const currentVersionAtom = atom<string>('');
export const currentModeAtom = atom<'overall' | 'standard'>('overall');
export const isLoadingAtom = atom(false);
export const errorMessageAtom = atom('');
export const searchQueryAtom = atom('');
export const characterWinratesAtom = atom<CharacterWinrates>(initialWinrates);
export const characterPopularityAtom = atom<CharacterPopularity>(initialPopularity);
export const winrateChangesAtom = atom<RankWinrateChanges>(initialWinrateChanges);
export const rankDistributionAtom = atom<GameRankDistribution>({} as GameRankDistribution);

export const playerStatsAtom = atom<PlayerStats | null>(null);
export const playerStatsLoadingAtom = atom(false);
export const playerStatsErrorAtom = atom<string | null>(null);

export const getColor = (id: string): string => {
  const colors = rankColorsAtom.init;
  const ColorMapping = colors.find(item => item.id === id);
  return ColorMapping ? ColorMapping.color : '#718096'; // Default color if rank not found
};
