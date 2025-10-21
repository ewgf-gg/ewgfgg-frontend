/* eslint-disable react/prop-types */
'use client';

import React, { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, LabelList } from 'recharts';
import useWindowSize, { isMobileView } from '../../lib/hooks/useWindowSize';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { characterIdMap, characterIconMap, characterColors } from '../../app/state/types/tekkenTypes';
import { Battle, PlayerMatchupSummary } from '../../app/state/types/PlayerPageTypes';
import { selectedBattleTypeAtom, showCurrentSeasonAtom } from '../../app/state/atoms/tekkenStatsAtoms';
import Image from 'next/image';

interface CharacterMatchupAnalysisChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  playerName: string;
  polarisId: string;
  playedCharacters?: Record<string, Record<string, PlayerMatchupSummary>>;
}

interface WinrateData {
  characterName: string;
  characterId: number;
  wins: number;
  losses: number;
  winRate: number;
  totalMatches: number;
}

interface DistributionData {
  characterName: string;
  characterId: number;
  totalMatches: number;
}

type ChartMode = 'winrate' | 'distribution';

interface CustomTooltipPayload {
  payload: WinrateData | DistributionData;
  value: number;
  name: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
  mode: ChartMode;
}

const CustomTooltip = React.memo<CustomTooltipProps>(({ active, payload, mode }) => {
  if (active && payload?.[0]) {
    const data = payload[0].payload;
    const iconPath = characterIconMap[data.characterName];

    return (
      <div className="bg-background border border-border p-2 rounded-md">
        <div className="flex items-center gap-2 mb-1">
          {iconPath && (
            <Image
              src={iconPath}
              alt={data.characterName}
              width={24}
              height={24}
              style={{ objectFit: 'contain' }}
              loading="lazy"
            />
          )}
          <p className="font-bold">{data.characterName}</p>
        </div>
        {mode === 'winrate' && 'wins' in data && (
          <>
            <p>Wins: {data.wins}</p>
            <p>Losses: {data.losses}</p>
            <p>Winrate: {data.winRate.toFixed(1)}%</p>
            <p>Total Matches: {data.totalMatches}</p>
            {data.totalMatches < 20 && (
              <p className="text-yellow-500 text-sm mt-1">* Limited match data</p>
            )}
          </>
        )}
        {mode === 'distribution' && (
          <p>Total Matches: {data.totalMatches}</p>
        )}
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

interface CustomAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

const CustomAxisTick: React.FC<CustomAxisTickProps & { isMobile: boolean }> = ({ 
  x = 0, 
  y = 0, 
  payload,
  isMobile
}) => {
  if (!payload) return null;

  // For mobile vertical layout
  if (isMobile) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={-5} 
          y={0} 
          dy={4} 
          textAnchor="end" 
          fill="currentColor" 
          fontSize={12}
          className="font-medium"
        >
          {payload.value}
        </text>
      </g>
    );
  }

  // For desktop horizontal layout - use character icons
  const iconPath = characterIconMap[payload.value];
  if (!iconPath) {
    // Fallback to text if icon not found
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="middle" 
          fill="currentColor"
          fontSize={12}
          className="font-medium"
        >
          {payload.value}
        </text>
      </g>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject width={24} height={24} x={-12} y={0}>
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
        >
          <Image
            src={iconPath}
            alt={payload.value}
            width={24}
            height={24}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </foreignObject>
    </g>
  );
};

const getBarColor = (winrate: number): string => {
  if (winrate > 52) return '#4ade80'; // green
  if (winrate >= 48) return '#facc15'; // yellow
  return '#ef4444'; // red
};

const WinrateLegend = () => (
  <div className="flex justify-center items-center gap-4 mt-2 text-sm text-muted-foreground">
    <div className="flex items-center gap-1">
      <div className="w-3 h-3 bg-[#4ade80]"></div>
      <span>&gt;52%</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-3 h-3 bg-[#facc15]"></div>
      <span>48-52%</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-3 h-3 bg-[#ef4444]"></div>
      <span>&lt;48%</span>
    </div>
  </div>
);

const CharacterMatchupAnalysisChart: React.FC<CharacterMatchupAnalysisChartProps> = ({
  battles,
  selectedCharacterId,
  polarisId,
  playerName,
  playedCharacters
}) => {
  const [mode, setMode] = useState<ChartMode>('winrate');
  const { width } = useWindowSize();
  const isMobile = isMobileView(width);
  
  // Get current selections from atoms
  const selectedBattleType = useAtomValue(selectedBattleTypeAtom);
  const showCurrentSeason = useAtomValue(showCurrentSeasonAtom);

  // Get the character name from the ID
  const getCharacterName = (characterId: number): string => {
    return characterIdMap[characterId] || `Character ${characterId}`;
  };

  const selectedCharName = getCharacterName(selectedCharacterId);

  // Winrate chart data - now respects battle type and season selection
  const winrateChartData = useMemo(() => {
    const characterData = playedCharacters?.[selectedCharName];
    
    if (!characterData) {
      return [];
    }
    
    // Use the selected battle type
    const battleTypeData = characterData[selectedBattleType];
    
    if (!battleTypeData) {
      return [];
    }
    
    // Use current season or all time based on atom
    const matchups = showCurrentSeason 
      ? battleTypeData.currentSeasonMatchups 
      : battleTypeData.allTimeMatchups;
    
    if (!matchups) {
      return [];
    }
    
    return Object.entries(matchups).map(([opponentName, matchup]: [string, any]) => {
      const charIdEntry = Object.entries(characterIdMap).find(([_, name]) => name === opponentName);
      return {
        characterName: opponentName,
        characterId: charIdEntry ? parseInt(charIdEntry[0]) : 0,
        wins: matchup.wins,
        losses: matchup.losses,
        winRate: matchup.winRate || 0,
        totalMatches: matchup.totalMatches
      };
    }).sort((a, b) => b.winRate - a.winRate);
  }, [selectedCharName, playedCharacters, selectedBattleType, showCurrentSeason]);

  // Distribution chart data - now respects battle type and season selection
  const { distributionChartData, maxMatches, yAxisTicks } = useMemo(() => {
    const characterData = playedCharacters?.[selectedCharName];
    
    if (!characterData) {
      return { distributionChartData: [], maxMatches: 10, yAxisTicks: [0, 2, 4, 6, 8, 10] };
    }
    
    // Use the selected battle type
    const battleTypeData = characterData[selectedBattleType];
    
    if (!battleTypeData) {
      return { distributionChartData: [], maxMatches: 10, yAxisTicks: [0, 2, 4, 6, 8, 10] };
    }
    
    // Use current season or all time based on atom
    const matchups = showCurrentSeason 
      ? battleTypeData.currentSeasonMatchups 
      : battleTypeData.allTimeMatchups;
    
    if (!matchups) {
      return { distributionChartData: [], maxMatches: 10, yAxisTicks: [0, 2, 4, 6, 8, 10] };
    }
    
    const sortedData = Object.entries(matchups).map(([opponentName, matchup]: [string, any]) => {
      const charIdEntry = Object.entries(characterIdMap).find(([_, name]) => name === opponentName);
      return {
        characterName: opponentName,
        characterId: charIdEntry ? parseInt(charIdEntry[0]) : 0,
        totalMatches: matchup.totalMatches
      };
    }).sort((a, b) => b.totalMatches - a.totalMatches);

    const max = sortedData.length > 0 
      ? Math.ceil(Math.max(...sortedData.map(d => d.totalMatches)) / 5) * 5 
      : 10;
    
    const ticks = [];
    const tickCount = 5;
    for (let i = 0; i <= tickCount; i++) {
      ticks.push(Math.round((max / tickCount) * i));
    }

    return { 
      distributionChartData: sortedData,
      maxMatches: max,
      yAxisTicks: ticks
    };
  }, [selectedCharName, playedCharacters, selectedBattleType, showCurrentSeason]);

  const selectedCharacterName = characterIdMap[selectedCharacterId];
  const selectedCharacterIcon = selectedCharacterName ? characterIconMap[selectedCharacterName] : null;

  // Helper function to get battle type display name
  const getBattleTypeName = (type: string) => {
    switch (type) {
      case 'RANKED_BATTLE': return 'Ranked';
      case 'QUICK_BATTLE': return 'Quick';
      case 'PLAYER_BATTLE': return 'Player';
      case 'GROUP_BATTLE': return 'Group';
      default: return type;
    }
  };

  // Create dynamic description based on mode, character, battle type, and season
  const getDescription = () => {
    const battleTypeName = getBattleTypeName(selectedBattleType);
    const seasonText = showCurrentSeason ? 'Current Season' : 'All Time';
    
    if (mode === 'winrate') {
      return `Your winrate distribution for ${selectedCharacterName} • ${battleTypeName} • ${seasonText}`;
    } else {
      return `Total matches played for ${selectedCharacterName} • ${battleTypeName} • ${seasonText}`;
    }
  };

  const chartData = mode === 'winrate' ? winrateChartData : distributionChartData;

  if (chartData.length === 0) {
    return (
      <SimpleChartCard
        title="Character Matchup Analysis"
        description="No matchup data available for this character"
      >
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No matches found</p>
        </div>
      </SimpleChartCard>
    );
  }

  return (
    <SimpleChartCard
      title="Character Matchup Analysis"
      description={getDescription()}
      height="400px"
      action={
        <div className="flex bg-gray-800/50 rounded-lg p-1 gap-1">
          <button
            onClick={() => setMode('winrate')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              mode === 'winrate'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Winrate
          </button>
          <button
            onClick={() => setMode('distribution')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              mode === 'distribution'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Distribution
          </button>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow" style={{ minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout={isMobile ? "vertical" : "horizontal"}
              margin={isMobile ? 
                { top: 10, right: 30, left: 40, bottom: 10 } :
                { top: 20, right: 30, left: 20, bottom: 40 }
              }
            >
              {isMobile ? (
                <>
                  <XAxis 
                    type="number"
                    domain={mode === 'winrate' ? [0, 100] : [0, maxMatches]}
                    ticks={mode === 'winrate' ? [0, 25, 50, 75, 100] : yAxisTicks}
                    tickFormatter={mode === 'winrate' ? (value) => `${value}%` : undefined}
                    fontSize={12}
                    stroke="#666"
                    tickLine={false}
                  />
                  <YAxis 
                    dataKey="characterName"
                    type="category"
                    width={40}
                    tick={<CustomAxisTick isMobile={isMobile} />}
                    interval={0}
                    axisLine={false}
                  />
                  {mode === 'winrate' && (
                    <ReferenceLine 
                      x={50} 
                      stroke="#666" 
                      strokeDasharray="3 3"
                      strokeWidth={1}
                      label={{
                        value: "50%",
                        position: "top",
                        fill: "#666",
                        fontSize: 12
                      }}
                    />
                  )}
                </>
              ) : (
                <>
                  <XAxis 
                    dataKey="characterName"
                    height={40}
                    tick={<CustomAxisTick isMobile={isMobile} />}
                    interval={0}
                  />
                  <YAxis 
                    domain={mode === 'winrate' ? [0, 100] : [0, maxMatches]}
                    ticks={mode === 'winrate' ? [0, 25, 50, 75, 100] : yAxisTicks}
                    tickFormatter={mode === 'winrate' ? (value) => `${value}%` : undefined}
                    fontSize={12}
                    stroke="#666"
                    tickLine={false}
                  />
                  {mode === 'winrate' && (
                    <ReferenceLine 
                      y={50} 
                      stroke="#666" 
                      strokeDasharray="3 3"
                      strokeWidth={1}
                      label={{
                        value: "50%",
                        position: "right",
                        fill: "#666",
                        fontSize: 12
                      }}
                    />
                  )}
                </>
              )}
              <Tooltip 
                content={<CustomTooltip mode={mode} />}
                cursor={false}
              />
              <Bar 
                dataKey={mode === 'winrate' ? 'winRate' : 'totalMatches'}
                name={mode === 'winrate' ? 'Winrate' : 'Total Matches'}
                radius={isMobile ? [0, 8, 8, 0] : [8, 8, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => {
                  let fill: string;
                  if (mode === 'winrate' && 'winRate' in entry) {
                    fill = getBarColor(entry.winRate);
                  } else {
                    const entryData = entry as DistributionData;
                    const colorMapping = characterColors.find(c => c.id === entryData.characterId.toString());
                    fill = colorMapping?.color || '#718096';
                  }
                  
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={fill}
                      opacity={mode === 'winrate' && 'totalMatches' in entry && entry.totalMatches < 20 ? 0.5 : 1}
                    />
                  );
                })}
                {mode === 'distribution' && (
                  <LabelList 
                    dataKey="totalMatches"
                    position={isMobile ? "right" : "top"}
                    fontSize={12}
                    fill="currentColor"
                    offset={5}
                  />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {mode === 'winrate' && <WinrateLegend />}
      </div>
    </SimpleChartCard>
  );
};

export default React.memo(CharacterMatchupAnalysisChart);
