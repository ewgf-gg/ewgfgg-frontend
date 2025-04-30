'use client';

import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { Header } from './ui/Header';
import Footer from './ui/Footer';
import { StatsGrid } from './homepage-charts/StatsGrid';
import { RankDistributionChart } from './homepage-charts/RankDistributionChart';
import {
  gameVersionsAtom,
  rankDistributionAtom,
  characterWinratesAtom,
  characterPopularityAtom,
  winrateChangesAtom,
  totalPlayersAtom,
  totalRankedReplaysAtom,
  recentlyActivePlayersAtom,
  totalUnrankedReplaysAtom
} from '../app/state/atoms/tekkenStatsAtoms';
import { HomeContentProps } from '../app/state/types/tekkenTypes';
import React from 'react'

export default function HomeContent({ initialData }: HomeContentProps) {
  const [, setGameVersions] = useAtom(gameVersionsAtom);
  const [, setRankDistribution] = useAtom(rankDistributionAtom);
  const [, setCharacterWinrates] = useAtom(characterWinratesAtom);
  const [, setCharacterPopularity] = useAtom(characterPopularityAtom);
  const [, setWinrateChanges] = useAtom(winrateChangesAtom);
  const [, setTotalPlayers] = useAtom(totalPlayersAtom);
  const [, setTotalReplays] = useAtom(totalRankedReplaysAtom);
  const [, setTotalUnrankedReplays] = useAtom(totalUnrankedReplaysAtom);
  const [, setRecentlyActivePlayers] = useAtom(recentlyActivePlayersAtom);

  // Use ref to ensure we only initialize once
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialData) {
      initialized.current = true;
      
      // Batch updates in a microtask to prevent re-renders
      queueMicrotask(() => {
        setGameVersions(Object.keys(initialData.rankDistribution));
        setRankDistribution(initialData.rankDistribution);
        setCharacterWinrates(initialData.characterWinrates);
        setCharacterPopularity(initialData.characterPopularity);
        setWinrateChanges(initialData.winrateChanges);
        setTotalPlayers(initialData.totalPlayers);
        setTotalReplays(initialData.totalRankedReplays);
        setTotalUnrankedReplays(initialData.totalUnrankedReplays)
        setRecentlyActivePlayers(initialData.recentlyActivePlayers);
      });
    }
  }, [initialData, setGameVersions, setRankDistribution, setCharacterWinrates, 
      setCharacterPopularity, setWinrateChanges, setTotalPlayers, setTotalReplays,
      setRecentlyActivePlayers, setTotalUnrankedReplays]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <StatsGrid />
        <RankDistributionChart />
      </main>
      <Footer />
    </div>
  );
}
