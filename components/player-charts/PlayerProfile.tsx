import React, { useState } from 'react';
import CharacterWinLossChart from './SelectedCharacterWinrate';
import CharacterWinrateChart from './CharacterWinrateChart';
import CharacterDistributionChart from './CharacterDistributionChart';
import BestMatchupChart from './BestMatchupChart';
import WorstMatchupChart from './WorstMatchupChart';
import WinrateOverTimeChart from './WinrateOverTimeChart';
import TekkenPowerChart from './TekkenPowerChart';
import { CharacterSelector } from '../player-stats/CharacterSelector';
import { UserInfoCard } from '../player-stats/UserInfoCard';
import { RecentBattlesCard } from './RecentBattlesCard';
import { FormattedPlayerStats, CharacterStats } from '../../app/state/types/tekkenTypes';

interface CharacterStatsRecord extends Omit<CharacterStats, 'danRank'> {
  gameVersion: string;
}

export const PlayerProfile: React.FC<{ stats: FormattedPlayerStats }> = ({ stats }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('all');

  // Extract character stats for the selector
  const characterStats = stats.characterStatsWithVersion.reduce((acc, stat) => {
    const key = `CharacterStatsId(playerId=0, characterId=${stat.characterId}, gameVersion=${stat.gameVersion})`;
    acc[key] = {
      characterName: stat.characterName,
      danName: stat.danName,
      wins: stat.wins,
      losses: stat.losses,
      gameVersion: stat.gameVersion
    };
    return acc;
  }, {} as Record<string, CharacterStatsRecord>);

  // Get the selected character's ID for charts
  const selectedCharacterNumericId = selectedCharacterId
    ? parseInt(selectedCharacterId.match(/characterId=(\d+)/)?.[1] || '0')
    : null;

  // Filter battles for charts (with character and version filters)
  const getFilteredBattlesForCharts = () => {
    let filtered = stats.battles;
    
    // Apply character filter if selected
    if (selectedCharacterId !== null && selectedCharacterNumericId !== null) {
      filtered = filtered.filter(battle => 
        battle.player1CharacterId === selectedCharacterNumericId ||
        battle.player2CharacterId === selectedCharacterNumericId
      );
    }

    // Apply version filter if a specific version is selected
    if (selectedVersion !== 'all') {
      filtered = filtered.filter(battle => 
        battle.gameVersion.toString() === selectedVersion
      );
    }

    return filtered;
  };

  const filteredBattlesForCharts = getFilteredBattlesForCharts();

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
        onVersionChange={setSelectedVersion}
      />

      {selectedCharacterId !== null && selectedCharacterNumericId !== null && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CharacterWinLossChart 
              battles={filteredBattlesForCharts}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
              polarisId={stats.polarisId}
            />
            <BestMatchupChart 
              battles={filteredBattlesForCharts}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
              polarisId={stats.polarisId}
            />
            <WorstMatchupChart 
              battles={filteredBattlesForCharts}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
              polarisId={stats.polarisId}
            />
          </div>
          <div className="w-full">
            <CharacterWinrateChart
              battles={filteredBattlesForCharts}
              selectedCharacterId={selectedCharacterNumericId}
              polarisId={stats.polarisId}
              playerName={stats.username}
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
        selectedVersion={selectedVersion}
      />
    </div>
  );
};
