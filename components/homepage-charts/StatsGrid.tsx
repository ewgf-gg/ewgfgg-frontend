import React from 'react';
import { PopularityChart } from './PopularityChart';
import { WinrateChart } from './WinrateChart';
import { WinrateChangesChart } from './WinrateChangesChart';

export const StatsGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
    <PopularityChart
      title="Most Popular Characters"
      description="Top 5 most picked characters"
      delay={0.4}
    />
    <WinrateChart
      title="Highest Win Rates"
      description="Top 5 characters by win rate"
      delay={0.6}
    />
    <WinrateChangesChart
      title="Highest Win Rate Changes"
      description="Top win rate changes since last patch"
      delay={0.8}
    />
  </div>
);
