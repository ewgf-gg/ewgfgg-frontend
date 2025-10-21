"use client";

import React, { Suspense, useState, useMemo, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { VersionStatsContent } from '@/components/statistics/VersionStatsContent';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { VersionSelector } from '@/components/statistics/VersionSelector';
import { RegionSelector } from '@/components/statistics/RegionSelector';
import { RankSelector } from '@/components/statistics/RankSelector';
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';
import { LazyChartWrapper } from '@/components/shared/LazyChartWrapper';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Trophy, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getVersionStatistics } from './actions';
import { processStatisticsData, formatVersion, getVersionLabel, getRankOrder } from '@/lib/statistics-utils';
import type { StatisticsPageResponse } from '@/app/state/types/StatisticsPageTypes';

// Lazy load the rank distribution chart
const StatisticsRankDistributionChart = dynamic(
  () => import('@/components/statistics/StatisticsRankDistributionChart'),
  { 
    loading: () => <div className="h-[400px] flex items-center justify-center"><EWGFLoadingAnimation /></div>,
    ssr: false
  }
);

interface StatisticsPageContentProps {
  availableVersions: number[];
  initialVersion: number;
  initialData: StatisticsPageResponse;
}

export default function StatisticsPageContent({ 
  availableVersions,
  initialVersion,
  initialData
}: StatisticsPageContentProps) {
  const [selectedVersion, setSelectedVersion] = useState<number>(initialVersion);
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [selectedRank, setSelectedRank] = useState<string>('allRanks');
  const [statisticsData, setStatisticsData] = useState<StatisticsPageResponse>(initialData);
  const [isPending, startTransition] = useTransition();

  // Handle version change with Server Action
  const handleVersionChange = (newVersion: string) => {
    const versionNum = parseInt(newVersion);
    
    startTransition(async () => {
      try {
        const newData = await getVersionStatistics(versionNum);
        setStatisticsData(newData);
        setSelectedVersion(versionNum);
      } catch (error) {
        console.error('Error fetching version statistics:', error);
        // Could add error toast here
      }
    });
  };

  // Get rank order for filtering (0 for "allRanks")
  const selectedRankOrder = useMemo(() => {
    if (selectedRank === 'allRanks') return 0;
    return getRankOrder(selectedRank);
  }, [selectedRank]);

  // Process data based on current filters
  const processedData = useMemo(() => {
    return processStatisticsData(statisticsData, selectedRegion, selectedRankOrder);
  }, [statisticsData, selectedRegion, selectedRankOrder]);

  const latestVersion = Math.max(...availableVersions);

  // Calculate quick stats for display
  const statCards = [
    {
      title: 'Total Characters',
      value: processedData.characterCount.toString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      description: 'Playable roster'
    },
    {
      title: 'Total Battles',
      value: processedData.totalBattles.toLocaleString(),
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
      description: 'Tracked matches'
    },
    {
      title: 'Average Winrate',
      value: `${processedData.averageWinrate.toFixed(2)}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      description: 'Across all characters'
    },
    {
      title: 'Data Version',
      value: formatVersion(selectedVersion).replace('Version ', 'v'),
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      description: 'Current patch'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-12 sm:pt-8 pb-8">
        {/* Header Section */}
        <div className="space-y-2 mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center sm:text-left"
          >
            Character Statistics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-center sm:text-left"
          >
            Comprehensive character data across versions, regions, and rank categories
          </motion.p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-400 text-sm font-medium mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-white mb-1">
                          {stat.value}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {stat.description}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Game Version</label>
              <VersionSelector
                versions={availableVersions.map(v => v.toString())}
                selectedVersion={selectedVersion.toString()}
                onVersionChange={handleVersionChange}
                getVersionLabel={(version) => getVersionLabel(parseInt(version), latestVersion)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Region</label>
              <RegionSelector
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Rank Category</label>
              <RankSelector
                selectedRank={selectedRank}
                onRankChange={setSelectedRank}
              />
            </div>
          </div>
        </motion.div>

        {/* Loading overlay during version change */}
        {isPending && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <EWGFLoadingAnimation />
          </div>
        )}

        {/* Charts Section */}
        <div className="space-y-8">
          <Suspense fallback={<EWGFLoadingAnimation />}>
            <VersionStatsContent
              pickRates={processedData.pickRates}
              winRates={processedData.winRates}
              selectedRegion={selectedRegion}
              selectedRank={selectedRank}
              selectedVersion={selectedVersion}
            />
          </Suspense>

          {/* Rank Distribution Chart - affected by game version and region */}
          <LazyChartWrapper height="400px">
            <StatisticsRankDistributionChart
              rankDistribution={statisticsData.rankDistribution}
              selectedVersion={selectedVersion}
              selectedRegion={selectedRegion}
            />
          </LazyChartWrapper>
        </div>
      </main>
      <Footer />
    </div>
  );
}
