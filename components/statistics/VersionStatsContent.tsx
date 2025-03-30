'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VersionStatsChart } from './VersionStatsChart';
import { VersionStats } from '@/app/state/types/tekkenTypes';

interface VersionStatsContentProps {
  popularityData: VersionStats;
  winrateData: VersionStats;
  selectedVersion: string;
  selectedRegion: string;
  selectedRank: 'allRanks' | 'masterRanks' | 'advancedRanks' | 'intermediateRanks' | 'beginnerRanks';
}

export function VersionStatsContent({ 
  popularityData, 
  winrateData, 
  selectedVersion, 
  selectedRegion, 
  selectedRank 
}: VersionStatsContentProps) {
  // If selectedRegion is 'global', use globalStats, otherwise use the numeric region ID
  const currentPopularityData = selectedRegion === 'global'
    ? popularityData[selectedVersion][selectedRank].globalStats
    : popularityData[selectedVersion][selectedRank].regionalStats[selectedRegion] || {};

  const currentWinrateData = selectedRegion === 'global'
    ? winrateData[selectedVersion][selectedRank].globalStats
    : winrateData[selectedVersion][selectedRank].regionalStats[selectedRegion] || {};

  // Check if we have data to display
  const hasPopularityData = Object.keys(currentPopularityData).length > 0;
  const hasWinrateData = Object.keys(currentWinrateData).length > 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="text-2xl font-bold">Character Popularity</CardTitle>
              <CardDescription>Character pick rates across different ranks</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {hasPopularityData ? (
              <VersionStatsChart
                data={currentPopularityData}
                title=""
                valueLabel="picks"
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No popularity data available for this selection
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="text-2xl font-bold">Character Winrates</CardTitle>
              <CardDescription>Character win rates across different ranks</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {hasWinrateData ? (
              <VersionStatsChart
                data={currentWinrateData}
                title=""
                valueLabel="winrate"
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No winrate data available for this selection
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
