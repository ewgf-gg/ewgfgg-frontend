import React from 'react';
import { PopularityChart } from './PopularityChart';
import { WinrateChart } from './WinrateChart';
import { WinRateTrends } from './WinrateChangesChart';

export const StatsGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
    <PopularityChart
      title="Most Popular Characters"
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
  </div>
);
