import { atom } from 'jotai';

export const totalReplaysAtom = atom(1234567);
export const totalPlayersAtom = atom(98765);
export const mostPopularCharacterAtom = atom('Lee Chaolan');

export const rankDistributionAtom = atom([
  { rank: 'God of Destruction', percentage: 1 },
  { rank: 'Tekken God', percentage: 2 },
  { rank: 'Tekken Supreme', percentage: 3 },
  { rank: 'Bushin', percentage: 5 },
  { rank: 'Fujin', percentage: 10 },
  { rank: 'Raijin', percentage: 15 },
  { rank: '1st Dan', percentage: 20 },
  { rank: 'Garyu', percentage: 25 },
  { rank: 'Destroyer', percentage: 19 },
]);