// atoms/tekkenStatsAtoms.ts

import { atom } from 'jotai';
import type { 
  RankColor, 
  CharacterWinrates, 
  CharacterPopularity, 
  RankWinrateChanges,
  GameRankDistribution,
  PlayerStats
} from '../types/tekkenTypes';

const initialWinrates: CharacterWinrates = {
  highRank: {},
  mediumRank: {},
  lowRank: {}
};

const initialPopularity: CharacterPopularity = {
  highRank: {},
  mediumRank: {},
  lowRank: {}
};

const initialWinrateChanges: RankWinrateChanges = {
  highRank: [],
  mediumRank: [],
  lowRank: []
};

export const rankColorsAtom = atom<RankColor[]>([
  { rank: 'Beginner', color: '#99582A' },
  { rank: '1st Dan', color: '#adb5bd' },
  { rank: '2nd Dan', color: '#7d8597' },
  { rank: 'Fighter', color: '#48cae4' },
  { rank: 'Strategist', color: '#00b4d8' },
  { rank: 'Combatant', color: '#0077b6' },
  { rank: 'Brawler', color: '#38b000' },
  { rank: 'Ranger', color: '#008000' },
  { rank: 'Cavalry', color: '#006400' },
  { rank: 'Warrior', color: '#ffea00' },
  { rank: 'Assailant', color: '#ffd000' },
  { rank: 'Dominator', color: '#ffb700' },
  { rank: 'Vanquisher', color: '#ff8500' },
  { rank: 'Destroyer', color: '#ff6d00' },
  { rank: 'Eliminator', color: '#ff4800' },
  { rank: 'Garyu', color: '#ad2831' },
  { rank: 'Shinryu', color: '#800e13' },
  { rank: 'Tenryu', color: '#640d14' },
  { rank: 'Mighty Ruler', color: '#7b2cbf' },
  { rank: 'Flame Ruler', color: '#5a189a' },
  { rank: 'Battle Ruler', color: '#3c096c' },
  { rank: 'Fujin', color: '#014f86' },
  { rank: 'Raijin', color: '#01497c' },
  { rank: 'Kishin', color: '#013a63' },
  { rank: 'Bushin', color: '#012a4a' },
  { rank: 'Tekken King', color: '#240046' },
  { rank: 'Tekken Emperor', color: '#10002b' },
  { rank: 'Tekken God', color: '#ffe94e' },
  { rank: 'Tekken God Supreme', color: '#b69121' },
  { rank: 'God of Destruction', color: '#9e0059' }
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

// New atom for player stats
export const playerStatsAtom = atom<PlayerStats | null>(null);
export const playerStatsLoadingAtom = atom(false);
export const playerStatsErrorAtom = atom<string | null>(null);

// Helper function
export const getColor = (rank: string): string => {
  const colors = rankColorsAtom.init;
  const rankColor = colors.find(item => item.rank === rank);
  return rankColor ? rankColor.color : '#718096'; // Default color if rank not found
};
