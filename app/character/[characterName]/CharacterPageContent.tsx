'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { CharacterOverview } from '@/components/character-stats/CharacterOverview';
import { TopPlayersLeaderboard } from '@/components/character-stats/TopPlayersLeaderboard';
import { MatchupsChart } from '@/components/character-stats/MatchupsChart';
import { RankDistributionChart } from '@/components/character-stats/RankDistributionChart';
import { TrendChart } from '@/components/character-stats/TrendChart';
import { CharacterStatsResponse } from '@/app/state/types/CharacterPageTypes';

interface CharacterPageContentProps {
  characterData: CharacterStatsResponse;
}

export default function CharacterPageContent({ characterData }: CharacterPageContentProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-16 sm:pt-12 pb-8">
        <div className="space-y-8">
          {/* Hero Section with Overview Stats */}
          <CharacterOverview
            characterName={characterData.characterName}
            characterIcon={characterData.characterIcon}
            stats={characterData.overallStats}
          />

          {/* Trend Chart - Full Width */}
          <TrendChart
            trendData={characterData.trendData}
            characterName={characterData.characterName}
          />

          {/* Rank Distribution - Full Width */}
          <RankDistributionChart
            distribution={characterData.rankDistribution}
            characterName={characterData.characterName}
          />

          {/* Matchups and Leaderboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matchups Chart */}
            <MatchupsChart
              matchups={characterData.matchups}
              characterName={characterData.characterName}
            />

            {/* Top Players Leaderboard */}
            <TopPlayersLeaderboard
              players={characterData.topPlayers}
              characterName={characterData.characterName}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
