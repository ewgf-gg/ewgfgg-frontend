"use client";

import React, { useState } from 'react';
import CharacterWinLossChart from '../../../components/player-charts/SelectedCharacterWinrate';
import CharacterWinrateChart from '../../../components/player-charts/CharacterWinrateChart';
import CharacterDistributionChart from '../../../components/player-charts/CharacterDistributionChart';
import BestMatchupChart from '../../../components/player-charts/BestMatchupChart';
import WorstMatchupChart from '../../../components/player-charts/WorstMatchupChart';
import WinrateOverTimeChart from '../../../components/player-charts/WinrateOverTimeChart';
import TekkenPowerChart from '../../../components/player-charts/TekkenPowerChart';
import { CharacterSelector } from '../../../components/player-stats/CharacterSelector';
import { UserInfoCard } from '../../../components/player-stats/UserInfoCard';
import { StatPentagonChart } from '../../../components/player-stats/StatPentagonChart';
import { StatPentagonTiles } from '../../../components/player-stats/StatPentagonTiles';
import { RecentBattlesCard } from '../../../components/player-charts/RecentBattlesCard';
import { FormattedPlayerStats, characterIdMap } from '../../state/types/tekkenTypes';
import { StatPentagonData } from '../../state/types/tekkenTypes';
import { AnimatePresence, motion } from 'framer-motion';


interface PlayerProfileProps {
  stats: FormattedPlayerStats;
  statPentagonData?: StatPentagonData | null;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ stats, statPentagonData }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSelectCharacter = (id: string) => {
    setSelectedCharacterId(prev => (prev === id ? null : id));
  };

  // Use playedCharacters directly for the selector
  const characterStats = stats.playedCharacters || {};

  // Find the character ID for the selected character name
  const selectedCharacterNumericId = selectedCharacterId
     // eslint-disable-next-line
    ? parseInt(Object.entries(characterIdMap).find(([_, name]) => name === selectedCharacterId)?.[0] || '0')
    : null;

  // Filter battles for charts by selected character
  const filteredBattlesForCharts = selectedCharacterId 
    ? stats.battles.filter(battle => {
        const player1Character = characterIdMap[battle.player1CharacterId];
        const player2Character = characterIdMap[battle.player2CharacterId];
        return player1Character === selectedCharacterId || player2Character === selectedCharacterId;
      })
    : stats.battles;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-auto">
          <UserInfoCard
            username={stats.username}
            regionId={stats.regionId}
            polarisId={stats.polarisId}
            latestBattle={stats.latestBattle}
            mainCharacterAndRank={stats.mainCharacterAndRank}
          />
        </div>
        <div className="h-auto">
          {statPentagonData ? (
            <StatPentagonChart 
              stats={statPentagonData} 
              showDetails={showDetails}
              onToggleDetails={setShowDetails} 
            />
          ) : (
            <div className="w-full max-w-md mx-auto overflow-visible h-full max-h-[350px] flex flex-col relative">
              <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-amber-400 font-medium">Unable to fetch stat pentagon; Server busy</p>
              </div>
            </div>
          )}
        </div>
        
      </div>
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
      
      <div className="w-full">
        <CharacterSelector
          characters={characterStats}
          onSelectCharacter={handleSelectCharacter}
          selectedCharacterId={selectedCharacterId}
        />
      </div>
      {selectedCharacterId !== null && selectedCharacterNumericId !== null && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CharacterWinLossChart 
              battles={filteredBattlesForCharts}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
              polarisId={stats.polarisId}
              playedCharacters={stats.playedCharacters}
            />
            <BestMatchupChart 
              battles={filteredBattlesForCharts}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
              polarisId={stats.polarisId}
              playedCharacters={stats.playedCharacters}
            />
            <WorstMatchupChart 
              battles={filteredBattlesForCharts}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
              polarisId={stats.polarisId}
              playedCharacters={stats.playedCharacters}
            />
          </div>
          <div className="w-full">
            <CharacterWinrateChart
              battles={filteredBattlesForCharts}
              selectedCharacterId={selectedCharacterNumericId}
              polarisId={stats.polarisId}
              playerName={stats.username}
              playedCharacters={stats.playedCharacters}
            />
          </div>
          <div className="w-full">
            <CharacterDistributionChart
              battles={filteredBattlesForCharts}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
              polarisId={stats.polarisId}
            />
          </div>
          <div className="w-full">
            <WinrateOverTimeChart
              battles={filteredBattlesForCharts}
              playerName={stats.username}
              selectedCharacterId={selectedCharacterNumericId}
              polarisId={stats.polarisId}
            />
          </div>
        </div>
      )}

      <div className="w-full">
        <TekkenPowerChart
          battles={stats.battles}
          playerName={stats.username}
          polarisId={stats.polarisId}
        />
      </div>

      <RecentBattlesCard
        battles={stats.battles}
        playerName={stats.username}
        polarisId={stats.polarisId}
      />
    </div>
  );
};
