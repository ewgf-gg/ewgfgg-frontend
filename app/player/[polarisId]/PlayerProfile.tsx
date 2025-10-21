"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import CharacterWinLossChart from '../../../components/player-charts/SelectedCharacterWinrate';
import BestMatchupChart from '../../../components/player-charts/BestMatchupChart';
import WorstMatchupChart from '../../../components/player-charts/WorstMatchupChart';
import { CharacterSelector } from '../../../components/player-stats/CharacterSelector';
import { UserInfoCard } from '../../../components/player-stats/UserInfoCard';
import { StatPentagonChart } from '../../../components/player-stats/StatPentagonChart';
import { StatPentagonTiles } from '../../../components/player-stats/StatPentagonTiles';
import { MatchStatsWidget } from '../../../components/player-stats/MatchStatsWidget';
import { ActivityWidget } from '../../../components/player-stats/ActivityWidget';
import { GlobalStatsWidget } from '../../../components/player-stats/GlobalStatsWidget';
import { characterIdMap, rankOrderMap } from '../../state/types/tekkenTypes';
import { PlayerStatsResponse, StatPentagonData, PlayerMatchupSummary } from '../../state/types/PlayerPageTypes';
import { AnimatePresence, motion } from 'framer-motion';
import { selectedCharacterAtom } from '../../state/atoms/tekkenStatsAtoms';
import { LazyChartWrapper } from '../../../components/shared/LazyChartWrapper';
import { ChartSkeleton } from '../../../components/shared/ChartSkeleton';

// Lazy load heavy chart components
const CharacterMatchupAnalysisChart = dynamic(
  () => import('../../../components/player-charts/CharacterMatchupAnalysisChart'),
  { 
    loading: () => <ChartSkeleton height="400px" />,
    ssr: false
  }
);

const WinrateOverTimeChart = dynamic(
  () => import('../../../components/player-charts/WinrateOverTimeChart'),
  { 
    loading: () => <ChartSkeleton height="400px" />,
    ssr: false
  }
);

const TekkenPowerChart = dynamic(
  () => import('../../../components/player-charts/TekkenPowerChart'),
  { 
    loading: () => <ChartSkeleton height="400px" />,
    ssr: false
  }
);

const RecentBattlesCard = dynamic(
  () => import('../../../components/player-charts/RecentBattlesCard'),
  { 
    loading: () => <ChartSkeleton height="600px" />,
    ssr: false
  }
);


interface PlayerProfileProps {
  stats: PlayerStatsResponse;
  polarisId: string;
  statPentagonData?: StatPentagonData | null;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ stats, polarisId, statPentagonData }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useAtom(selectedCharacterAtom);
  const [showDetails, setShowDetails] = useState(false);

  const handleSelectCharacter = (id: string) => {
    setSelectedCharacterId(prev => (prev === id ? null : id));
  };

  // Use playedCharacters directly for the selector
  const characterStats = stats.playedCharacters || {};

  // Get sorted character list (same sorting as CharacterSelector)
  const sortedCharacters = useMemo(() => {
    const aggregated = Object.entries(characterStats).map(([characterName, battleTypes]) => {
      // Sum wins and losses across all battle types
      const totals = Object.values(battleTypes).reduce(
        (sum, battleTypeStats: PlayerMatchupSummary) => ({
          wins: sum.wins + battleTypeStats.wins,
          losses: sum.losses + battleTypeStats.losses,
        }),
        { wins: 0, losses: 0 }
      );

      // Get rank from RANKED_BATTLE first, or fall back to any available battle type
      const rankedBattleStats = battleTypes['RANKED_BATTLE'] || Object.values(battleTypes)[0];
      const currentSeasonRank = rankedBattleStats?.currentSeasonRank || null;

      const totalMatches = totals.wins + totals.losses;

      return {
        characterName,
        totalMatches,
        currentSeasonRank,
      };
    });

    // Sort by rank first, then by total matches (same as CharacterSelector)
    aggregated.sort((a, b) => {
      const getRankValue = (rank: string | null): number => {
        if (!rank) return -1;
        const entry = Object.entries(rankOrderMap).find(([_, name]) => name === rank);
        return entry ? parseInt(entry[0]) : -1;
      };

      const rankA = getRankValue(a.currentSeasonRank);
      const rankB = getRankValue(b.currentSeasonRank);
      if (rankA !== rankB) return rankB - rankA;
      return b.totalMatches - a.totalMatches;
    });

    return aggregated.map(char => char.characterName);
  }, [characterStats]);

  // Reset selected character when polarisId changes (new player page)
  useEffect(() => {
    setSelectedCharacterId(null);
  }, [polarisId, setSelectedCharacterId]);

  // Set first character from sorted list as selected by default
  useEffect(() => {
    if (sortedCharacters.length > 0 && selectedCharacterId === null) {
      setSelectedCharacterId(sortedCharacters[0]);
    }
  }, [sortedCharacters, selectedCharacterId, setSelectedCharacterId]);

  // Find the character ID for the selected character name
  const selectedCharacterNumericId = selectedCharacterId
     // eslint-disable-next-line
    ? parseInt(Object.entries(characterIdMap).find(([_, name]) => name === selectedCharacterId)?.[0] || '0')
    : null;

  // Filter battles for charts by selected character
  const filteredBattlesForCharts = selectedCharacterId 
    ? stats.battles.filter(battle => {
        return battle.p1Char === selectedCharacterId || battle.p2Char === selectedCharacterId;
      })
    : stats.battles;

  return (
    <div className="space-y-6">
      {/* Header section with user info */}
      <div className="w-full">
        <UserInfoCard
          username={stats.playerMetadata.name}
          regionId={stats.playerMetadata.region}
          polarisId={polarisId}
          latestBattle={stats.playerMetadata.latestBattle}
          mainCharacterAndRank={stats.mainChar}
          pastPlayerNames={stats.playerMetadata.pastPlayerNames}
        />
      </div>

      {/* Activity, Stat Pentagon, and Global Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
        <div className="w-full h-full">
          <ActivityWidget recentActivity={stats.recentActivity} />
        </div>
        <div className="w-full h-full flex flex-col">
          {statPentagonData ? (
            <StatPentagonChart 
              stats={statPentagonData} 
              showDetails={showDetails}
              onToggleDetails={setShowDetails} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-amber-400 font-medium">Unable to fetch stat pentagon; Server busy</p>
            </div>
          )}
        </div>
        <div className="w-full h-full">
          <GlobalStatsWidget totalStatsByBattleType={stats.totalStatsByBattleType} />
        </div>
      </div>

      {/* StatPentagon Details */}
      <div className="w-full">
        <AnimatePresence initial={false} mode="wait">
          {statPentagonData && showDetails && (
            <motion.div
              key="tiles"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    when: "beforeChildren",
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="w-full flex justify-center"
            >
              <StatPentagonTiles stats={statPentagonData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Character selection and content with sidebar layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar with character selection */}
        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <CharacterSelector
            characters={characterStats}
            onSelectCharacter={handleSelectCharacter}
          />
        </div>

        {/* Main content area - only Match Stats and 3-column row */}
        {selectedCharacterId !== null && selectedCharacterNumericId !== null && (
          <div className="flex-1 space-y-8">
              <div className="w-full">
                <MatchStatsWidget 
                  totalStatsByBattleType={stats.totalStatsByBattleType}
                  playedCharacters={stats.playedCharacters}
                  selectedCharacter={selectedCharacterId}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <CharacterWinLossChart 
                  selectedCharacterId={selectedCharacterNumericId}
                  playerName={stats.playerMetadata.name}
                  polarisId={polarisId}
                  playedCharacters={stats.playedCharacters}
                />
                <BestMatchupChart 
                  battles={filteredBattlesForCharts}
                  selectedCharacterId={selectedCharacterNumericId}
                  playerName={stats.playerMetadata.name}
                  polarisId={polarisId}
                  playedCharacters={stats.playedCharacters}
                />
                <WorstMatchupChart 
                  battles={filteredBattlesForCharts}
                  selectedCharacterId={selectedCharacterNumericId}
                  playerName={stats.playerMetadata.name}
                  polarisId={polarisId}
                  playedCharacters={stats.playedCharacters}
                />
            </div>
          </div>
        )}
      </div>

      {/* Full-width character charts - only shown when character is selected */}
      {selectedCharacterId !== null && selectedCharacterNumericId !== null && (
        <div className="space-y-8">
            <LazyChartWrapper height="400px">
              <CharacterMatchupAnalysisChart
                battles={filteredBattlesForCharts}
                selectedCharacterId={selectedCharacterNumericId}
                polarisId={polarisId}
                playerName={stats.playerMetadata.name}
                playedCharacters={stats.playedCharacters}
              />
            </LazyChartWrapper>
            <LazyChartWrapper height="400px">
              <WinrateOverTimeChart
                battles={filteredBattlesForCharts}
                playerName={stats.playerMetadata.name}
                selectedCharacterId={selectedCharacterNumericId}
                polarisId={polarisId}
              />
            </LazyChartWrapper>
        </div>
      )}

      {/* Always visible charts - wrapped in LazyChartWrapper */}
      <div className="space-y-8">
        <LazyChartWrapper height="400px">
          <TekkenPowerChart
            battles={stats.battles}
            playerName={stats.playerMetadata.name}
            polarisId={polarisId}
          />
        </LazyChartWrapper>

        <LazyChartWrapper height="600px">
          <RecentBattlesCard
            battles={stats.battles}
            playerName={stats.playerMetadata.name}
            polarisId={polarisId}
          />
        </LazyChartWrapper>
      </div>
    </div>
  );
};
