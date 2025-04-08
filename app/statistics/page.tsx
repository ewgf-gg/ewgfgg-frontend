import React from 'react';
import StatisticsPageContent from '@/app/statistics/StatisticsPageContent';
import { fetchStatistics } from '@/lib/api-config';
import { VersionStats } from '@/app/state/types/tekkenTypes';
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StatisticsPage() {
  let popularityData: VersionStats | null = null;
  let winrateData: VersionStats | null = null;
  let error: string | null = null;
  
  try {
    // Fetch data on the server
    const [popularity, winrates] = await Promise.all([
      fetchStatistics('version-popularity'),
      fetchStatistics('version-winrates')
    ]);
    
    popularityData = popularity;
    winrateData = winrates;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch data';
    console.error('Error fetching statistics data:', err);
  }

  // Show loading state while fetching data
  if (!popularityData || !winrateData) {
    if (!error) {
      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
            <EWGFLoadingAnimation />
          </main>
          <Footer />
        </div>
      );
    }
  }

  // Pass the fetched data to the client component
  return (
    <StatisticsPageContent 
      popularityData={popularityData || {}}
      winrateData={winrateData || {}}
      error={error}
    />
  );
}
