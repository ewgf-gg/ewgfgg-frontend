'use client';

export const dynamic = 'force-dynamic';
export const revalidate = false;

import { Suspense } from 'react';
import { VersionStatsContent } from '@/components/statistics/VersionStatsContent';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { VersionSelector } from '@/components/statistics/VersionSelector';
import { RegionSelector } from '@/components/statistics/RegionSelector';
import { RankSelector } from '@/components/statistics/RankSelector';
import { fetchVersionPopularity, fetchVersionWinrates } from '@/lib/api';
import { VersionStats } from '@/app/state/types/tekkenTypes';
import  EWGFLoadingAnimation  from '@/components/EWGFLoadingAnimation';
import { useState, useEffect } from 'react';
import React from 'react';

type RankCategory = 'allRanks' | 'highRank' | 'mediumRank' | 'lowRank';

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

export default function StatisticsPage() {
  const [popularityData, setPopularityData] = useState<VersionStats | null>(null);
  const [winrateData, setWinrateData] = useState<VersionStats | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [selectedRank, setSelectedRank] = useState<RankCategory>('allRanks');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [popularity, winrates] = await Promise.all([
          fetchVersionPopularity(),
          fetchVersionWinrates()
        ]);
        setPopularityData(popularity);
        setWinrateData(winrates);
        // Set initial version to the latest version
        if (!selectedVersion && Object.keys(popularity).length > 0) {
          const versions = Object.keys(popularity).sort((a, b) => parseInt(b) - parseInt(a));
          setSelectedVersion(versions[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
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
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Character Statistics</h1>
        <div className="flex justify-end gap-4 mb-8">
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
