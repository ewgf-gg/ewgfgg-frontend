import React, { Suspense } from 'react';
import LeaderboardsPageContent from './LeaderboardsPageContent';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Loading from './loading';
import { fetchStatistics } from '@/lib/api-config';
import { LeaderboardData } from '@/app/state/types/tekkenTypes';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60; 

export default async function LeaderboardsPage() {
  let leaderboardData: LeaderboardData | null = null;
  let error = false;

  try {
    leaderboardData = await fetchStatistics('leaderboards') as LeaderboardData;
  } catch (e) {
    error = true;
    console.error('Error fetching leaderboard data:', e);
  }

  if (error || !leaderboardData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-8">
              <Image
                src="/static/hachi.webp"
                alt="Hachi"
                width={300}
                height={300}
                className="rounded-lg"
              />
            </div>
            <h1 className="text-3xl font-bold text-yellow-500">Leaderboards Unavailable</h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Tekken's servers could not be reached at this time. This can occur if they are down for maintenance / updates. If this is incorrect, please contact me on{' '}
              <Link 
                href="https://discord.gg/EUEnH99har"
                className="text-blue-400 hover:text-blue-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </Link>
              .
            </p>
            <Link
              href="/"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
            >
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
