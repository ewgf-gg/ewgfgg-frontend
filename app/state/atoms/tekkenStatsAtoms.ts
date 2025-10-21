// atoms/tekkenStatsAtoms.ts

import { atom } from 'jotai';
import type { 
  ColorMapping, 
  RecentlyActivePlayer,
  PickrateEntry,
  WinrateEntry,
  TrendEntry,
  ActivePlayerRegion,
  RankDistributionEntry,
  HomepageData
} from '../types/tekkenTypes';


// New atoms for refactored homepage
export const dataViewModeAtom = atom<'30days' | 'currentVersion'>('30days');
export const pickratesAtom = atom<PickrateEntry[]>([]);
export const winratesAtom = atom<WinrateEntry[]>([]);
export const trendsAtom = atom<TrendEntry[]>([]);
export const activePlayersAtom = atom<ActivePlayerRegion[]>([]);
export const rankDistributionNewAtom = atom<RankDistributionEntry[]>([]);
export const homepageDataAtom = atom<HomepageData | null>(null);


export const totalRankedReplaysAtom = atom<number>(0);
export const totalUnrankedReplaysAtom = atom<number>(0);
export const totalPlayersAtom = atom<number>(0);
export const totalActivePlayers30dAtom = atom<number>(0);
export const totalRankedReplays30dAtom = atom<number>(0);
export const totalUnrankedReplays30dAtom = atom<number>(0);
export const gameVersionsAtom = atom<string[]>([]);
export const currentVersionAtom = atom<string>('');
export const currentModeAtom = atom<'overall' | 'standard'>('overall');
export const isLoadingAtom = atom(false);
export const errorMessageAtom = atom('');
export const searchQueryAtom = atom('');

export const playerStatsLoadingAtom = atom(false);
export const playerStatsErrorAtom = atom<string | null>(null);
export const recentlyActivePlayersAtom = atom<RecentlyActivePlayer[]>([]);

// Player page atoms
export const selectedBattleTypeAtom = atom<string>('RANKED_BATTLE');
export const selectedCharacterAtom = atom<string | null>(null);
export const showCurrentSeasonAtom = atom<boolean>(true);
