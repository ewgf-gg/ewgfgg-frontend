"use client";

import React from 'react';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { PlayerProfile } from '@/app/player/[polarisId]/PlayerProfile';
import { PlayerStatsResponse, StatPentagonData } from '../../state/types/PlayerPageTypes';

interface PlayerPageContentProps {
  error: string | null;
  playerStats: PlayerStatsResponse | null;
  polarisId: string;
  statPentagonData?: StatPentagonData | null;
}

export default function PlayerPageContent({ 
  error, 
  playerStats, 
  polarisId,
  statPentagonData
}: PlayerPageContentProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-8">
        </h1>
        
        <div>
          {error ? (
            <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <svg 
                  className="w-5 h-5 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            </div>
          ) : playerStats ? (
            <div className="max-w-6xl mx-auto">
              <PlayerProfile 
                stats={playerStats} 
                polarisId={polarisId}
                statPentagonData={statPentagonData} 
              />
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-xl">No player data found for {polarisId}.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
