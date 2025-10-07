'use client';

import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { Header } from './ui/Header';
import Footer from './ui/Footer';
import { StatsGrid } from './homepage-charts/StatsGrid';
import { RankDistributionChart } from './homepage-charts/RankDistributionChart';
import { RegionDistributionChart } from './homepage-charts/RegionDistributionChart';
import {
  dataViewModeAtom,
  homepageDataAtom,
  pickratesAtom,
  winratesAtom,
  activePlayersAtom,
  rankDistributionNewAtom
} from '../app/state/atoms/tekkenStatsAtoms';
import { HomeContentProps } from '../app/state/types/tekkenTypes';
import React from 'react'

export default function HomeContent({ initialData }: HomeContentProps) {
  const [dataViewMode, setDataViewMode] = useAtom(dataViewModeAtom);
  const [, setHomepageData] = useAtom(homepageDataAtom);
  const [, setPickrates] = useAtom(pickratesAtom);
  const [, setWinrates] = useAtom(winratesAtom);
  const [, setActivePlayers] = useAtom(activePlayersAtom);
  const [, setRankDistribution] = useAtom(rankDistributionNewAtom);

  // Use ref to ensure we only initialize once
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialData) {
      initialized.current = true;
      
      // Batch updates in a microtask to prevent re-renders
      queueMicrotask(() => {
        setHomepageData(initialData);
        // Set initial data based on view mode
        if (dataViewMode === '30days') {
          setPickrates(initialData['30d_pickrates']);
          setWinrates(initialData['30d_winrates']);
          setRankDistribution(initialData['30d_rank_distib']);
        } else {
          setPickrates(initialData['ver_pickrates']);
          setWinrates(initialData['ver_winrates']);
          // Use ver_distribution entries if available
          if (initialData['ver_distribution'] && initialData['ver_distribution'].length > 0) {
            setRankDistribution(initialData['ver_distribution'][0].entries);
          }
        }
        setActivePlayers(initialData['active_players']);
      });
    }
  }, [initialData, dataViewMode, setHomepageData, setPickrates, setWinrates, 
      setActivePlayers, setRankDistribution]);

  // Update data when view mode changes
  useEffect(() => {
    if (initialized.current && initialData) {
      if (dataViewMode === '30days') {
        setPickrates(initialData['30d_pickrates']);
        setWinrates(initialData['30d_winrates']);
        setRankDistribution(initialData['30d_rank_distib']);
      } else {
        setPickrates(initialData['ver_pickrates']);
        setWinrates(initialData['ver_winrates']);
        // Use ver_distribution entries if available
        if (initialData['ver_distribution'] && initialData['ver_distribution'].length > 0) {
          setRankDistribution(initialData['ver_distribution'][0].entries);
        }
      }
    }
  }, [dataViewMode, initialData, setPickrates, setWinrates, setRankDistribution]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-16 sm:pt-12">
        {/* Version Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg bg-gray-800 p-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dataViewMode === '30days' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setDataViewMode('30days')}
            >
              Last 30 Days
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dataViewMode === 'currentVersion' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setDataViewMode('currentVersion')}
            >
              Current Game Version
            </button>
          </div>
        </div>
        
        <StatsGrid />
        <RankDistributionChart />
      </main>
      <Footer />
    </div>
  );
}
