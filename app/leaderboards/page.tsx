import React, { Suspense } from 'react';
import LeaderboardsPageContent from './LeaderboardsPageContent';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Loading from './loading';
import { fetchStatistics } from '@/lib/api-config';
import { LeaderboardData } from '@/app/state/types/tekkenTypes';

export const revalidate = 60; 

export default async function LeaderboardsPage() {
  const leaderboardData = await fetchStatistics('leaderboards') as LeaderboardData;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <Suspense fallback={<Loading />}>
        <main className="flex-grow container mx-auto px-4 py-8">
          <LeaderboardsPageContent leaderboardData={leaderboardData} />
        </main>
      </Suspense>
      <Footer />
    </div>
  );
}
