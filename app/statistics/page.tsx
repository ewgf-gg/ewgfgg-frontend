import React from 'react';
import StatisticsPageContent from '@/app/statistics/StatisticsPageContent';
import { fetchAllGameVersions, fetchVersionedStatistics } from '@/lib/api-config';
import type { StatisticsPageResponse } from '@/app/state/types/StatisticsPageTypes';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';

export const metadata = {
  title: 'Character Statistics | EWGF.gg',
  description: 'Comprehensive character statistics including pick rates, win rates, and trends across all ranks'
};

export default async function StatisticsPage() {
  try {
    // Fetch all available game versions
    const versions = await fetchAllGameVersions();
    
    if (!versions || versions.length === 0) {
      throw new Error('No game versions available');
    }

    // Convert string versions to numbers and get the maximum
    const versionNumbers = versions.map(v => parseInt(v));
    const maxVersion = Math.max(...versionNumbers);

    // Fetch statistics for the latest version
    const initialData: StatisticsPageResponse = await fetchVersionedStatistics(maxVersion);

    return (
      <StatisticsPageContent
        availableVersions={versionNumbers}
        initialVersion={maxVersion}
        initialData={initialData}
      />
    );
  } catch (error) {
    console.error('Error loading statistics page:', error);
    
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-lg">Error loading statistics</div>
            <p className="text-gray-400 mt-2">
              {error instanceof Error ? error.message : 'Failed to load statistics data'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
