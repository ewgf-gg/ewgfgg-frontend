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
          <div>Error: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!popularityData || !winrateData || !selectedVersion) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div>No data available</div>
        </main>
        <Footer />
      </div>
    );
  }

  const versions = Object.keys(popularityData).sort((a, b) => parseInt(b) - parseInt(a));
  const latestVersion = versions[0];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-12 sm:pt-8">
        <h1 className="text-4xl font-bold mb-8 text-center sm:text-left">Character Statistics</h1>
        <div className="flex flex-wrap justify-start sm:justify-end gap-4 mb-8">
          <VersionSelector
            versions={versions}
            selectedVersion={selectedVersion}
            onVersionChange={setSelectedVersion}
            getVersionLabel={(version) => getVersionLabel(version, latestVersion)}
          />
          <RegionSelector
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />
          <RankSelector
            selectedRank={selectedRank}
            onRankChange={setSelectedRank}
          />
        </div>
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
