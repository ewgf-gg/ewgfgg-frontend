/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { Battle, characterIdMap, characterIconMap } from '../../app/state/types/tekkenTypes';
import Image from 'next/image';

interface CharacterWinrateChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  // eslint-disable-next-line
  playerName: string;
  polarisId: string;

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

const renderCustomAxisTick = (props: { x: number; y: number; payload: { value: string } }) => {
  const { x, y, payload } = props;
  const iconPath = characterIconMap[payload.value];

  // Return empty SVG if no icon path
  if (!iconPath) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
          {payload.value}
        </text>
      </g>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x="-16" y="0" width="32" height="32">
        <div style={{ width: '100%', height: '100%' }}>
          <Image
            src={iconPath}
            alt={payload.value}
            width={32}
            height={32}
            style={{ objectFit: 'contain' }}
            loading="lazy"
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

const CharacterWinrateChart: React.FC<CharacterWinrateChartProps> = ({
  battles,
  selectedCharacterId,
  playerName,
  polarisId
}) => {
  const characterBattles = useMemo(() => battles.filter(battle => {
    const isPlayer1 = battle.player1PolarisId === polarisId;
    return isPlayer1 
      ? battle.player1CharacterId === selectedCharacterId
      : battle.player2CharacterId === selectedCharacterId;
  }), [battles, selectedCharacterId, playerName]);

  const chartData = useMemo(() => {
    const winrateData = characterBattles.reduce((acc, battle) => {
      const isPlayer1 = battle.player1PolarisId === polarisId;
      const opponentCharId = isPlayer1 ? battle.player2CharacterId : battle.player1CharacterId;
      const won = isPlayer1 ? battle.winner === 1 : battle.winner === 2;
      const characterName = characterIdMap[opponentCharId] || `Character ${opponentCharId}`;

      if (!acc[characterName]) {
        acc[characterName] = {
          characterName,
          characterId: opponentCharId,
          wins: 0,
          losses: 0,
          winRate: 0,
          totalMatches: 0
        };
      }

      if (won) {
        acc[characterName].wins++;
      } else {
        acc[characterName].losses++;
      }
      
      acc[characterName].totalMatches++;
      acc[characterName].winRate = (acc[characterName].wins / acc[characterName].totalMatches) * 100;

      return acc;
    }, {} as Record<string, WinrateData>);

    return Object.values(winrateData).sort((a, b) => b.winRate - a.winRate);
  }, [characterBattles, polarisId]);

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
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 40
              }}
            >
              <XAxis 
                dataKey="characterName"
                height={40}
                tick={renderCustomAxisTick}
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
              <Tooltip 
                content={<CustomTooltip />}
                cursor={false}
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
              <Bar 
                dataKey="winRate" 
                name="Winrate"
                radius={[8, 8, 0, 0]}
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
