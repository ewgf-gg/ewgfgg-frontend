import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { Battle, characterIdMap, characterIconMap } from '@/app/state/types/tekkenTypes';
import Image from 'next/image';

interface CharacterWinrateChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  playerName: string;
}

interface WinrateData {
  characterName: string;
  characterId: number;
  wins: number;
  losses: number;
  winRate: number;
  totalMatches: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: WinrateData;
    value: number;
    name: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
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
            />
          )}
          <p className="font-bold">{data.characterName}</p>
        </div>
        <p>Wins: {data.wins}</p>
        <p>Losses: {data.losses}</p>
        <p>Winrate: {data.winRate.toFixed(1)}%</p>
        <p>Total Matches: {data.totalMatches}</p>
      </div>
    );
  }
  return null;
};

const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  const iconPath = characterIconMap[payload.value];
  if (!iconPath) return null;

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x="-16" y="0" width="32" height="32">
        <Image
          src={iconPath}
          alt={payload.value}
          width={32}
          height={32}
          style={{ objectFit: 'contain' }}
        />
      </foreignObject>
    </g>
  );
};

const getBarColor = (winrate: number) => {
  if (winrate > 52) return '#4ade80'; // green
  if (winrate >= 48) return '#facc15'; // yellow
  return '#ef4444'; // red
};

const CharacterWinrateChart: React.FC<CharacterWinrateChartProps> = ({
  battles,
  selectedCharacterId,
  playerName
}) => {
  // Filter battles for selected character
  const characterBattles = battles.filter(battle => {
    const isPlayer1 = battle.player1Name === playerName;
    return isPlayer1 
      ? battle.player1CharacterId === selectedCharacterId
      : battle.player2CharacterId === selectedCharacterId;
  });

  // Calculate winrates against each character
  const winrateData = characterBattles.reduce((acc, battle) => {
    const isPlayer1 = battle.player1Name === playerName;
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

  // Convert to array and sort by winrate
  const chartData = Object.values(winrateData)
    .sort((a, b) => b.winRate - a.winRate);

  if (chartData.length === 0) {
    return (
      <SimpleChartCard
        title="Character Matchup Winrates"
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
      title="Character Matchup Winrates"
      description="Winrate distribution against different characters"
    >
      <div className="w-full h-full">
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
              tick={<CustomXAxisTick />}
              interval={0}
            />
            <YAxis 
              hide
              domain={[0, 100]}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
            />
            <ReferenceLine 
              y={50} 
              stroke="#666" 
              strokeWidth={2}
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
                <Cell key={`cell-${index}`} fill={getBarColor(entry.winRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SimpleChartCard>
  );
};

export default CharacterWinrateChart;
