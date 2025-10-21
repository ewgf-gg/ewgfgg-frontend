'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VersionStatsChart } from './VersionStatsChart';
import { formatVersion } from '@/lib/statistics-utils';
import type { AggregatedCharacterStats, AggregatedWinRateStats } from '@/app/state/types/StatisticsPageTypes';

interface VersionStatsContentProps {
  pickRates: AggregatedCharacterStats;
  winRates: AggregatedWinRateStats;
  selectedRegion: string;
  selectedRank: string;
  selectedVersion: number;
}

type ChartView = 'popularity' | 'winrate';

export function VersionStatsContent({ 
  pickRates, 
  winRates,
  selectedRegion,
  selectedRank,
  selectedVersion
}: VersionStatsContentProps) {
  const [chartView, setChartView] = useState<ChartView>('popularity');
  
  // Check if we have data to display
  const hasPickRateData = Object.keys(pickRates).length > 0;
  const hasWinrateData = Object.keys(winRates).length > 0;
  
  // Convert winRates to simple object for chart (keeping full data for tooltip)
  const winRateValues = useMemo(() => {
    const values: { [key: string]: number } = {};
    for (const [char, data] of Object.entries(winRates)) {
      values[char] = data.winRate;
    }
    return values;
  }, [winRates]);

  // Create contextual descriptions
  const descriptions = useMemo(() => {
    const versionStr = formatVersion(selectedVersion);
    const regionStr = selectedRegion === 'global' ? 'all regions' : selectedRegion;
    const rankStr = selectedRank === 'allRanks' ? 'all ranks' : `${selectedRank}+`;

    return {
      pickRate: `Total battles per character for ${versionStr} • ${regionStr} • ${rankStr}`,
      winRate: `Win rate percentage per character for ${versionStr} • ${regionStr} • ${rankStr}`
    };
  }, [selectedVersion, selectedRegion, selectedRank]);

  // Determine which data to show based on selected view
  const currentData = chartView === 'popularity' ? pickRates : winRateValues;
  const currentValueLabel = chartView === 'popularity' ? 'picks' : 'winrate';
  const currentTitle = chartView === 'popularity' ? 'Character Popularity' : 'Character Winrates';
  const currentDescription = chartView === 'popularity' ? descriptions.pickRate : descriptions.winRate;
  const hasCurrentData = chartView === 'popularity' ? hasPickRateData : hasWinrateData;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">{currentTitle}</CardTitle>
                <CardDescription>{currentDescription}</CardDescription>
              </div>
              <div className="flex bg-gray-800/50 rounded-lg p-1 gap-1">
                <button
                  onClick={() => setChartView('popularity')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    chartView === 'popularity'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Popularity
                </button>
                <button
                  onClick={() => setChartView('winrate')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    chartView === 'winrate'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Winrate
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {hasCurrentData ? (
              <VersionStatsChart
                data={currentData}
                title=""
                valueLabel={currentValueLabel}
                winRateDetails={chartView === 'winrate' ? winRates : undefined}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No {chartView} data available for this selection
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
