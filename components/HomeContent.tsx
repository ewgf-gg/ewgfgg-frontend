// components/HomeContent.tsx
'use client';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Header } from './ui/Header';
import Footer from './ui/Footer';
import { StatsGrid } from './StatsGrid';
import { RankDistributionChart } from './homepage-charts/RankDistributionChart';
import EWGFLoadingAnimation from './EWGFLoadingAnimation';
import {
  isLoadingAtom,
  totalReplaysAtom,
  totalPlayersAtom,
  gameVersionsAtom,
  rankDistributionAtom,
  characterWinratesAtom,
  characterPopularityAtom,
  winrateChangesAtom
} from '../app/state/atoms/tekkenStatsAtoms';
import { HomeContentProps } from '../app/state/types/tekkenTypes';

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
        // Immediately set loading to false once data is initialized
        setIsLoading(false);
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
