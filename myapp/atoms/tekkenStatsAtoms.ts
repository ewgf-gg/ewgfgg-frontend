import { atom } from 'jotai';

export const totalReplaysAtom = atom(1234567);
export const totalPlayersAtom = atom(98765);
export const mostPopularCharacterAtom = atom('Lee Chaolan');

export const rankDistributionAtom = atom([
  { rank: 'Beginner', percentage: 10 },
  { rank: '1st Dan', percentage: 8 },
  { rank: '2nd Dan', percentage: 7 },
  { rank: 'Fighter', percentage: 6 },
  { rank: 'Strategist', percentage: 5 },
  { rank: 'Combatant', percentage: 5 },
  { rank: 'Brawler', percentage: 5 },
  { rank: 'Ranger', percentage: 4 },
  { rank: 'Cavalry', percentage: 4 },
  { rank: 'Warrior', percentage: 4 },
  { rank: 'Assailant', percentage: 4 },
  { rank: 'Dominator', percentage: 3 },
  { rank: 'Vanquisher', percentage: 3 },
  { rank: 'Destroyer', percentage: 3 },
  { rank: 'Eliminator', percentage: 3 },
  { rank: 'Garyu', percentage: 2 },
  { rank: 'Shinry', percentage: 2 },
  { rank: 'Tenryu', percentage: 2 },
  { rank: 'Mighty Ruler', percentage: 2 },
  { rank: 'Flame Ruler', percentage: 2 },
  { rank: 'Battle Ruler', percentage: 2 },
  { rank: 'Fujin', percentage: 1 },
  { rank: 'Raijin', percentage: 1 },
  { rank: 'Kishin', percentage: 1 },
  { rank: 'Bushin', percentage: 1 },
  { rank: 'Tekken King', percentage: 0.5 },
  { rank: 'Tekken Emperor', percentage: 0.3 },
  { rank: 'Tekken God', percentage: 0.1 },
  { rank: 'Tekken God Supreme', percentage: 0.05 },
  { rank: 'God of Destruction', percentage: 0.05 }
]);