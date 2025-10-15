"use client";

import { Suspense, useState } from 'react';
import { VersionStatsContent } from '@/components/statistics/VersionStatsContent';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { VersionSelector } from '@/components/statistics/VersionSelector';
import { RegionSelector } from '@/components/statistics/RegionSelector';
import { RankSelector } from '@/components/statistics/RankSelector';
import { VersionStats } from '@/app/state/types/tekkenTypes';
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Trophy, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { RankCategory } from '@/components/statistics/RankSelector';

const formatVersion = (version: string) => {
  const major = Math.floor(parseInt(version) / 10000);
  const minor = Math.floor((parseInt(version) % 10000) / 100);
  const patch = parseInt(version) % 100;
  return `Version ${major}.${minor}.${patch}`;
};

const getVersionLabel = (version: string, latestVersion: string) => {
  const formattedVersion = formatVersion(version);
  return version === latestVersion ? `${formattedVersion} (Latest)` : formattedVersion;
};

interface StatisticsPageContentProps {
  popularityData: VersionStats;
  winrateData: VersionStats;
  error: string | null;
}

export default function StatisticsPageContent({ 
  popularityData, 
  winrateData,
  error
}: StatisticsPageContentProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [selectedRank, setSelectedRank] = useState<RankCategory>('allRanks');

  // Set initial version to the latest version if not already set
  if (!selectedVersion && popularityData && Object.keys(popularityData).length > 0) {
    const versions = Object.keys(popularityData).sort((a, b) => parseInt(b) - parseInt(a));
    setSelectedVersion(versions[0]);
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-lg">Error: {error}</div>
            <p className="text-gray-400 mt-2">Failed to load statistics data</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!popularityData || !winrateData || !selectedVersion) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <EWGFLoadingAnimation />
        </main>
        <Footer />
      </div>
    );
  }

  const versions = Object.keys(popularityData).sort((a, b) => parseInt(b) - parseInt(a));
  const latestVersion = versions[0];

  // Calculate quick stats for display
  const currentPopularityData = selectedRegion === 'global'
    ? popularityData[selectedVersion][selectedRank].globalStats
    : popularityData[selectedVersion][selectedRank].regionalStats[selectedRegion] || {};

  const currentWinrateData = selectedRegion === 'global'
    ? winrateData[selectedVersion][selectedRank].globalStats
    : winrateData[selectedVersion][selectedRank].regionalStats[selectedRegion] || {};

  const totalCharacters = Object.keys(currentPopularityData).length;
  const totalBattles = Object.values(currentPopularityData).reduce((a: number, b: any) => a + b, 0);
  const avgWinrate = Object.keys(currentWinrateData).length > 0
    ? (Object.values(currentWinrateData).reduce((a: number, b: any) => a + b, 0) / Object.keys(currentWinrateData).length).toFixed(2)
    : '0.00';

  const statCards = [
    {
      title: 'Total Characters',
      value: totalCharacters.toString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      description: 'Playable roster'
    },
    {
      title: 'Total Battles',
      value: totalBattles.toLocaleString(),
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
      description: 'Tracked matches'
    },
    {
      title: 'Average Winrate',
      value: `${avgWinrate}%`,
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
                <Card className="overflow-hidden bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50">
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
                versions={versions}
                selectedVersion={selectedVersion}
                onVersionChange={setSelectedVersion}
                getVersionLabel={(version) => getVersionLabel(version, latestVersion)}
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

        {/* Charts Section */}
        <Suspense fallback={<EWGFLoadingAnimation />}>
          <VersionStatsContent
            popularityData={popularityData}
            winrateData={winrateData}
            selectedVersion={selectedVersion}
            selectedRegion={selectedRegion}
            selectedRank={selectedRank}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
