/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import useWindowSize, { isMobileView } from '../../lib/hooks/useWindowSize';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { Battle, characterIdMap, characterIconMap, PlayedCharacter } from '../../app/state/types/tekkenTypes';
import Image from 'next/image';

interface CharacterWinrateChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  // eslint-disable-next-line
  playerName: string;
  polarisId: string;
  playedCharacters?: Record<string, PlayedCharacter>;
}

interface WinrateData {
  characterName: string;
  characterId: number;
  wins: number;
  losses: number;
  winRate: number;
  totalMatches: number;
}

interface CustomTooltipPayload {
  payload: WinrateData;
  value: number;
  name: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}

const CustomTooltip = React.memo<CustomTooltipProps>(({ active, payload }) => {
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
        <p>Wins: {data.wins}</p>
        <p>Losses: {data.losses}</p>
        <p>Winrate: {data.winRate.toFixed(1)}%</p>
        <p>Total Matches: {data.totalMatches}</p>
        {data.totalMatches < 20 && (
          <p className="text-yellow-500 text-sm mt-1">* Limited match data</p>
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

const CustomAxisTick: React.FC<CustomAxisTickProps> = ({ x = 0, y = 0, payload }) => {
  if (!payload) return null;
  const { width } = useWindowSize();
  const isMobile = isMobileView(width);

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

  // For desktop horizontal layout
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

const CharacterWinrateChart: React.FC<CharacterWinrateChartProps> = ({
  selectedCharacterId,
  playedCharacters
}) => {
  // Get the character name from the ID
  const getCharacterName = (characterId: number): string => {
    return characterIdMap[characterId] || `Character ${characterId}`;
  };

  const selectedCharName = getCharacterName(selectedCharacterId);

  const chartData = useMemo(() => {
    // Get the character data from playedCharacters
    const character = playedCharacters?.[selectedCharName];
    
    if (!character || !character.matchups) {
      return [];
    }
    
    // Convert matchups to chart data format
    return Object.entries(character.matchups).map(([opponentName, matchup]) => ({
      characterName: opponentName,
      // eslint-disable-next-line
      characterId: Object.entries(characterIdMap).find(([_, name]) => name === opponentName)?.[0] || 0,
      wins: matchup.wins,
      losses: matchup.losses,
      winRate: matchup.winRate,
      totalMatches: matchup.totalMatches
    })).sort((a, b) => b.winRate - a.winRate);
  }, [selectedCharName, playedCharacters]);

  const selectedCharacterName = characterIdMap[selectedCharacterId];
  const selectedCharacterIcon = selectedCharacterName ? characterIconMap[selectedCharacterName] : null;

  if (chartData.length === 0) {
    return (
      <SimpleChartCard
        title="Character Matchup Winrates"
        description="No matchup data available for this character"
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
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No matches found</p>
        </div>
      </SimpleChartCard>
    );
  }

  const { width } = useWindowSize();
  const isMobile = isMobileView(width);

  return (
    <SimpleChartCard
      title="Character Matchup Winrates"
      description="Winrate distribution against different characters"
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
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(value) => `${value}%`}
                    fontSize={12}
                    stroke="#666"
                    tickLine={false}
                  />
                  <YAxis 
                    dataKey="characterName"
                    type="category"
                    width={40}
                    tick={<CustomAxisTick />}
                    interval={0}
                    axisLine={false}
                  />
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
                </>
              ) : (
                <>
                  <XAxis 
                    dataKey="characterName"
                    height={40}
                    tick={<CustomAxisTick />}
                    interval={0}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(value) => `${value}%`}
                    fontSize={12}
                    stroke="#666"
                    tickLine={false}
                  />
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
                </>
              )}
              <Tooltip 
                content={<CustomTooltip />}
                cursor={false}
              />
              <Bar 
                dataKey="winRate" 
                name="Winrate"
                radius={isMobile ? [0, 8, 8, 0] : [8, 8, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.winRate)}
                    opacity={entry.totalMatches < 20 ? 0.5 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <WinrateLegend />
      </div>
    </SimpleChartCard>
  );
};

export default React.memo(CharacterWinrateChart);
