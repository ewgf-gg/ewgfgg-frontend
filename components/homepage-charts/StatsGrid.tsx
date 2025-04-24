import React from 'react';
import { PopularityChart } from './PopularityChart';
import { WinrateChart } from './WinrateChart';
import { WinRateTrends } from './WinrateChangesChart';
import { RecentlyActivePlayersChart } from './RecentlyActivePlayersChart';

export const StatsGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
    <PopularityChart
      title="Popular Characters"
      description="Most picked characters"
      delay={0.4}
    />
    <WinrateChart
      title="Highest Win Rates"
      description="Characters with highest winrates"
      delay={0.6}
    />
    <WinRateTrends
      title="Win Rate Trends"
      description="Win rate trends since last patch"
      delay={0.8}
    />
    <RecentlyActivePlayersChart
      title="Recently Active Players"
      description="Last seen players on ranked"
      delay={1.0}
    />
  </div>
);
