import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { Battle } from '@/app/state/types/tekkenTypes';
import { characterIconMap } from '@/app/state/types/tekkenTypes';

interface CharacterBattlesChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  playerName: string;
}

interface ChartDataItem {
  characterId: number;
  characterName: string;
  battles: number;
  percentage: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md">
        <p className="font-bold">{label}</p>
        <p>Matches: {payload[0].value}</p>
        <p>Percentage: {payload[1].value.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const CharacterBattlesChart: React.FC<CharacterBattlesChartProps> = ({ 
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

  // Count opponent character frequencies
  const opponentStats = characterBattles.reduce((acc, battle) => {
    const isPlayer1 = battle.player1Name === playerName;
    const opponentCharId = isPlayer1 ? battle.player2CharacterId : battle.player1CharacterId;
    
    acc[opponentCharId] = (acc[opponentCharId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Convert to chart data format and sort by frequency
  const chartData: ChartDataItem[] = Object.entries(opponentStats)
    .map(([charId, count]) => ({
      characterId: parseInt(charId),
      characterName: Object.keys(characterIconMap).find(name => 
        characterIconMap[name].includes(`${charId}T8.png`)
      ) || `Character ${charId}`,
      battles: count,
      percentage: (count / characterBattles.length) * 100
    }))
    .sort((a, b) => b.battles - a.battles);

  return (
    <SimpleChartCard 
      title="Character Match-up Distribution" 
      description="Frequency of character match-ups in battles"
    >
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="characterName"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ value: 'Matches', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="battles" fill="#4ade80" name="Matches" />
            <Bar dataKey="percentage" fill="#60a5fa" name="Percentage" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SimpleChartCard>
  );
};

export default CharacterBattlesChart;
