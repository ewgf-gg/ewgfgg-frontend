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
import { RecentBattlesCard } from '../../../components/player-charts/RecentBattlesCard';
import { FormattedPlayerStats, characterIdMap } from '../../state/types/tekkenTypes';

export const PlayerProfile: React.FC<{ stats: FormattedPlayerStats }> = ({ stats }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

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
      <UserInfoCard
        username={stats.username}
        regionId={stats.regionId}
        polarisId={stats.polarisId}
        areaId={stats.areaId}
        latestBattle={stats.latestBattle}
        mainCharacterAndRank={stats.mainCharacterAndRank}
      />

      <CharacterSelector
        characters={characterStats}
        onSelectCharacter={setSelectedCharacterId}
        selectedCharacterId={selectedCharacterId}
      />

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
