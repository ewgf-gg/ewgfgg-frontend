import React from 'react';
import { PopularityChart } from './PopularityChart';
import { WinrateChart } from './WinrateChart';
import { WinRateTrends } from './WinrateChangesChart';
import { RegionDistributionChart } from './RegionDistributionChart';

export const StatsGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 sm:mb-16">
    <PopularityChart
      title="Popular Characters"
      description="Across all ranks globally"
      delay={0.4}
    />
    <WinrateChart
      title="Highest Win Rates"
      description="Across all ranks globally"
      delay={0.6}
    />
    <WinRateTrends
      title="Win Rate Trends"
      description="Across all ranks globally"
      delay={0.8}
    />
    <RegionDistributionChart />
  </div>
);
