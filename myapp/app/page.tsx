"use client"
import { useStatisticsData } from '@/hooks/useStatisticsData';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { SearchForm } from '@/components/SearchForm';
import { StatsGrid } from '@/components/StatsGrid';
import { RankDistributionChart } from '@/components/RankDistributionChart';
import {
  searchQueryAtom,
  isLoadingAtom,
  errorMessageAtom
} from '@/atoms/tekkenStatsAtoms';

export default function HomePage() {
  useStatisticsData(); // Added this hook
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (searchQuery.trim()) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/player-stats/${encodeURIComponent(searchQuery.trim())}`);
        if (response.ok) {
          router.push(`/player/${encodeURIComponent(searchQuery.trim())}`);
        } else {
          setErrorMessage('Player not found.');
        }
      } catch (error) {
        console.error('Error fetching player data:', error);
        setErrorMessage('An error occurred while fetching player data.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.h1
          className="text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        </motion.h1>
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
        {isLoading ? (
          <div className="flex justify-center items-center">
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