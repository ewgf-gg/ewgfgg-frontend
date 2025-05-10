// Tabs updated to have 2px purple border, rounded rectangle shape, and extra padding
'use client';

import React, { useState } from 'react';
import CharacterWinrateChart from './CharacterWinrateChart';
import CharacterDistributionChart from './CharacterDistributionChart';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import Image from 'next/image';
import { characterIdMap, characterIconMap } from '../../app/state/types/tekkenTypes';

interface CombinedChartProps {
  battles: any[];
  selectedCharacterId: number;
  playerName: string;
  polarisId: string;
  playedCharacters?: Record<string, any>;
}

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
}> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-2 ${
      active
        ? 'bg-purple-600 text-white border-purple-600'
        : 'bg-transparent text-purple-600 border-purple-600 hover:bg-purple-50'
    }`}
  >
    {label}
  </button>
);

const CombinedCharacterChart: React.FC<CombinedChartProps> = ({
  battles,
  selectedCharacterId,
  playerName,
  polarisId,
  playedCharacters
}) => {
  const [activeTab, setActiveTab] = useState<'winrate' | 'distribution'>('winrate');
  const selectedCharacterName = characterIdMap[selectedCharacterId];
  const selectedCharacterIcon = selectedCharacterName ? characterIconMap[selectedCharacterName] : null;

  return (
    <SimpleChartCard
      title="Character Matchups"
      description="Compare winrate and matchups against other characters"
      action={selectedCharacterIcon && (
        <Image
          src={selectedCharacterIcon}
          alt={selectedCharacterName || ''}
          width={32}
          height={32}
          style={{ objectFit: 'contain' }}
        />
      )}
    >
      <div className="flex justify-start gap-2  border-border mb-2 pb-1">
        <TabButton
          label="Winrate"
          active={activeTab === 'winrate'}
          onClick={() => setActiveTab('winrate')}
        />
        <TabButton
          label="Character Matchups"
          active={activeTab === 'distribution'}
          onClick={() => setActiveTab('distribution')}
        />
      </div>

      <div className="h-[550px] w-full max-w-full overflow-x-auto">
        <div className="min-w-[700px] h-full">
          {activeTab === 'winrate' ? (
            <CharacterWinrateChart
              selectedCharacterId={selectedCharacterId}
              playedCharacters={playedCharacters}
              playerName={playerName}
              polarisId={polarisId}
              battles={battles}
            />
          ) : (
            <CharacterDistributionChart
              selectedCharacterId={selectedCharacterId}
              playerName={playerName}
              polarisId={polarisId}
              battles={battles}
            />
          )}
        </div>
      </div>
    </SimpleChartCard>
  );
};

export default CombinedCharacterChart;
