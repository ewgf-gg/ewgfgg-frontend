import { atom } from 'jotai';

interface RankColor {
  rank: string;
  color: string;
}

interface RankDistribution {
  rank: string;
  percentage: number;
}

export type DistributionMode = 'overall' | 'standard';
export type GameVersion = '10801' | '10701';


export type GameRankDistribution = {
  [key in GameVersion]: {
    [mode in DistributionMode]: RankDistribution[];
  };
}

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

export const rankDistributionAtom = atom<GameRankDistribution>({
  '10801': {
    overall: [
      { rank: 'Beginner', percentage: 3.15 },
      { rank: '1st Dan', percentage: 2.90 },
      { rank: '2nd Dan', percentage: 2.45 },
      { rank: 'Fighter', percentage: 2.85 },
      { rank: 'Strategist', percentage: 2.68 },
      { rank: 'Combatant', percentage: 2.88 },
      { rank: 'Brawler', percentage: 3.26 },
      { rank: 'Ranger', percentage: 2.95 },
      { rank: 'Cavalry', percentage: 3.17 },
      { rank: 'Warrior', percentage: 4.63 },
      { rank: 'Assailant', percentage: 4.01 },
      { rank: 'Dominator', percentage: 4.18 },
      { rank: 'Vanquisher', percentage: 5.36 },
      { rank: 'Destroyer', percentage: 4.86 },
      { rank: 'Eliminator', percentage: 5.64 },
      { rank: 'Garyu', percentage: 9.46 },
      { rank: 'Shinryu', percentage: 6.87 },
      { rank: 'Tenryu', percentage: 6.55 },
      { rank: 'Mighty Ruler', percentage: 5.34 },
      { rank: 'Flame Ruler', percentage: 4.33 },
      { rank: 'Battle Ruler', percentage: 5.32 },
      { rank: 'Fujin', percentage: 4.69 },
      { rank: 'Raijin', percentage: 3.43 },
      { rank: 'Kishin', percentage: 2.46 },
      { rank: 'Bushin', percentage: 1.95 },
      { rank: 'Tekken King', percentage: 1.08 },
      { rank: 'Tekken Emperor', percentage: 0.70 },
      { rank: 'Tekken God', percentage: 0.48 },
      { rank: 'Tekken God Supreme', percentage: 0.25 },
      { rank: 'God of Destruction', percentage: 0.12 }
    ],
    standard: [
      // Keeping existing data for 10801 standard mode
      { rank: 'Beginner', percentage: 2.06 },
      { rank: '1st Dan', percentage: 1.80 },
      { rank: '2nd Dan', percentage: 1.50 },
      { rank: 'Fighter', percentage: 1.95 },
      { rank: 'Strategist', percentage: 1.78 },
      { rank: 'Combatant', percentage: 1.78 },
      { rank: 'Brawler', percentage: 2.36 },
      { rank: 'Ranger', percentage: 1.85 },
      { rank: 'Cavalry', percentage: 2.17 },
      { rank: 'Warrior', percentage: 3.63 },
      { rank: 'Assailant', percentage: 3.01 },
      { rank: 'Dominator', percentage: 3.18 },
      { rank: 'Vanquisher', percentage: 4.36 },
      { rank: 'Destroyer', percentage: 3.86 },
      { rank: 'Eliminator', percentage: 4.64 },
      { rank: 'Garyu', percentage: 8.46 },
      { rank: 'Shinryu', percentage: 5.87 },
      { rank: 'Tenryu', percentage: 5.55 },
      { rank: 'Mighty Ruler', percentage: 6.34 },
      { rank: 'Flame Ruler', percentage: 5.33 },
      { rank: 'Battle Ruler', percentage: 6.32 },
      { rank: 'Fujin', percentage: 6.69 },
      { rank: 'Raijin', percentage: 4.43 },
      { rank: 'Kishin', percentage: 3.46 },
      { rank: 'Bushin', percentage: 2.95 },
      { rank: 'Tekken King', percentage: 2.08 },
      { rank: 'Tekken Emperor', percentage: 1.20 },
      { rank: 'Tekken God', percentage: 0.68 },
      { rank: 'Tekken God Supreme', percentage: 0.39 },
      { rank: 'God of Destruction', percentage: 0.22 }
    ]
  },
  '10701': {
    overall: [
      { rank: 'Beginner', percentage: 18.50 },
      { rank: '1st Dan', percentage: 15.20 },
      { rank: '2nd Dan', percentage: 12.80 },
      { rank: 'Fighter', percentage: 10.50 },
      { rank: 'Strategist', percentage: 8.80 },
      { rank: 'Combatant', percentage: 7.20 },
      { rank: 'Brawler', percentage: 5.90 },
      { rank: 'Ranger', percentage: 4.80 },
      { rank: 'Cavalry', percentage: 3.90 },
      { rank: 'Warrior', percentage: 2.90 },
      { rank: 'Assailant', percentage: 2.30 },
      { rank: 'Dominator', percentage: 1.80 },
      { rank: 'Vanquisher', percentage: 1.40 },
      { rank: 'Destroyer', percentage: 1.10 },
      { rank: 'Eliminator', percentage: 0.85 },
      { rank: 'Garyu', percentage: 0.65 },
      { rank: 'Shinryu', percentage: 0.45 },
      { rank: 'Tenryu', percentage: 0.35 },
      { rank: 'Mighty Ruler', percentage: 0.25 },
      { rank: 'Flame Ruler', percentage: 0.20 },
      { rank: 'Battle Ruler', percentage: 0.15 },
      { rank: 'Fujin', percentage: 0.12 },
      { rank: 'Raijin', percentage: 0.09 },
      { rank: 'Kishin', percentage: 0.07 },
      { rank: 'Bushin', percentage: 0.05 },
      { rank: 'Tekken King', percentage: 0.04 },
      { rank: 'Tekken Emperor', percentage: 0.02 },
      { rank: 'Tekken God', percentage: 0.01 },
      { rank: 'Tekken God Supreme', percentage: 0.005 },
      { rank: 'God of Destruction', percentage: 0.002 }
    ],
    standard: [
      { rank: 'Beginner', percentage: 16.20 },
      { rank: '1st Dan', percentage: 13.50 },
      { rank: '2nd Dan', percentage: 11.20 },
      { rank: 'Fighter', percentage: 9.30 },
      { rank: 'Strategist', percentage: 7.80 },
      { rank: 'Combatant', percentage: 6.50 },
      { rank: 'Brawler', percentage: 5.40 },
      { rank: 'Ranger', percentage: 4.50 },
      { rank: 'Cavalry', percentage: 3.80 },
      { rank: 'Warrior', percentage: 3.20 },
      { rank: 'Assailant', percentage: 2.90 },
      { rank: 'Dominator', percentage: 2.60 },
      { rank: 'Vanquisher', percentage: 2.30 },
      { rank: 'Destroyer', percentage: 2.00 },
      { rank: 'Eliminator', percentage: 1.70 },
      { rank: 'Garyu', percentage: 1.40 },
      { rank: 'Shinryu', percentage: 1.20 },
      { rank: 'Tenryu', percentage: 1.00 },
      { rank: 'Mighty Ruler', percentage: 0.80 },
      { rank: 'Flame Ruler', percentage: 0.65 },
      { rank: 'Battle Ruler', percentage: 0.50 },
      { rank: 'Fujin', percentage: 0.40 },
      { rank: 'Raijin', percentage: 0.30 },
      { rank: 'Kishin', percentage: 0.25 },
      { rank: 'Bushin', percentage: 0.20 },
      { rank: 'Tekken King', percentage: 0.15 },
      { rank: 'Tekken Emperor', percentage: 0.10 },
      { rank: 'Tekken God', percentage: 0.08 },
      { rank: 'Tekken God Supreme', percentage: 0.05 },
      { rank: 'God of Destruction', percentage: 0.02 }
    ]
  }
});

export const totalReplaysAtom = atom(1234567);
export const totalPlayersAtom = atom(98765);
export const mostPopularCharacterAtom = atom('Lee Chaolan');
export const searchQueryAtom = atom('');
export const isLoadingAtom = atom(false);
export const errorMessageAtom = atom('');


// Function to get color from rankColorsAtom
export const getColor = (rank: string): string => {
  const colors = rankColorsAtom.init;
  const rankColor = colors.find(item => item.rank === rank);
  return rankColor ? rankColor.color : '#718096'; // Default color if rank not found
};