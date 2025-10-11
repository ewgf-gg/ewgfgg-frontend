'use client';

import React, { useState, useMemo } from 'react';
import { ActivityGraphChart } from '@/components/activity-charts/ActivityGraphChart';
import { ActivePlayersFilter } from '@/components/activity-charts/ActivePlayersFilter';
import { ActivePlayersList } from '@/components/activity-charts/ActivePlayersList';
import { ActivityGraphData, ActivePlayer, ActivePlayersFilters } from '@/app/state/types/ActivityPageTypes';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

interface ActivityPageContentProps {
  graphData: ActivityGraphData;
  activePlayers: ActivePlayer[];
}

export const ActivityPageContent: React.FC<ActivityPageContentProps> = ({ 
  graphData, 
  activePlayers 
}) => {
  const [filters, setFilters] = useState<ActivePlayersFilters>({
    rank: 'all',
    region: 'all'
  });

  // Filter active players based on selected filters
  const filteredPlayers = useMemo(() => {
    return activePlayers.filter(player => {
      const rankMatch = filters.rank === 'all' || player.danRank.toString() === filters.rank;
      const regionMatch = filters.region === 'all' || player.regionId.toString() === filters.region;
      return rankMatch && regionMatch;
    });
  }, [activePlayers, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-12 sm:pt-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-center sm:text-left">Game Activity</h1>
          <p className="text-gray-400 text-center sm:text-left">
            Track ranked battle activity and see who&apos;s playing right now
          </p>
        </div>

        {/* Activity Graph */}
        <div className="mb-8">
          <ActivityGraphChart 
            data={graphData}
            title="Game Activity Over Time"
            description="Ranked battles and daily active players over the past 30 days"
          />
        </div>

        {/* Active Players Section */}
        <div className="space-y-4">
          <ActivePlayersFilter 
            filters={filters}
            onFilterChange={setFilters}
          />
          
          <ActivePlayersList 
            players={filteredPlayers}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};
