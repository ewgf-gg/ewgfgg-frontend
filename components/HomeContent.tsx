// components/HomeContent.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Header } from '@/components/ui/Header';
import  Footer  from '@/components/ui/Footer';
import { StatsGrid } from '@/components/StatsGrid';
import { RankDistributionChart } from '@/components/homepage-charts/RankDistributionChart';
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';
import {
  isLoadingAtom,
  totalReplaysAtom,
  totalPlayersAtom,
  gameVersionsAtom,
  rankDistributionAtom,
  characterWinratesAtom,
  characterPopularityAtom,
  GameRankDistribution,
  winrateChangesAtom
} from '@/atoms/tekkenStatsAtoms';

interface InitialData {
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
    winrateChanges: {
      highRank: Array<{
        characterId: string;
        change: number;
        trend: 'increase' | 'decrease';
        rankCategory: string;
      }>;
      mediumRank: Array<{
        characterId: string;
        change: number;
        trend: 'increase' | 'decrease';
        rankCategory: string;
      }>;
      lowRank: Array<{
        characterId: string;
        change: number;
        trend: 'increase' | 'decrease';
        rankCategory: string;
      }>;
    };
  }

interface HomeContentProps {
  initialData: InitialData;
}

export default function HomeContent({ initialData }: HomeContentProps) {
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [, setTotalReplays] = useAtom(totalReplaysAtom);
  const [, setTotalPlayers] = useAtom(totalPlayersAtom);
  const [, setGameVersions] = useAtom(gameVersionsAtom);
  const [, setRankDistribution] = useAtom(rankDistributionAtom);
  const [, setCharacterWinrates] = useAtom(characterWinratesAtom);
  const [, setCharacterPopularity] = useAtom(characterPopularityAtom);
  const [, setWinrateChanges] = useAtom(winrateChangesAtom);

  useEffect(() => {
    const initializeState = async () => {
      setIsLoading(true);
      try {
        // Initialize state with server-fetched data
        setTotalReplays(initialData.totalReplays);
        setTotalPlayers(initialData.totalPlayers);
        setGameVersions(initialData.gameVersions);
        setRankDistribution(initialData.rankDistribution);
        setCharacterWinrates(initialData.characterWinrates);
        setCharacterPopularity(initialData.characterPopularity);
        setWinrateChanges(initialData.winrateChanges);
      } catch (error) {
        console.error('Error initializing state:', error);
      } finally {
        // Add a small delay to ensure the loading animation is visible
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    initializeState();
  }, [initialData]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <EWGFLoadingAnimation className="scale-100" />
          </div>
        ) : (
          <>
            <StatsGrid />
            <RankDistributionChart />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}