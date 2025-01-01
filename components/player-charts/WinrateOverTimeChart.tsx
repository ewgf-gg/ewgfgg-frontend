import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { Battle } from '../../app/state/types/tekkenTypes';
import { format, subDays } from 'date-fns';
import { Button } from '../ui/button';

interface WinrateOverTimeChartProps {
  battles: Battle[];
  playerName: string;
  selectedCharacterId?: number;
  polarisId: string
}

interface ChartDataPoint {
  date: string;
  winRate: number;
  formattedDate: string;
  totalGames: number;
  wins: number;
  losses: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

type TimeSpan = '7d' | '30d' | 'all';

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-2 rounded-md">
        <p className="font-bold">{data.formattedDate}</p>
        <p>Win Rate: {data.winRate.toFixed(1)}%</p>
        <p>Wins: {data.wins}</p>
        <p>Losses: {data.losses}</p>
        <p>Total Games: {data.totalGames}</p>
      </div>
    );
  }
  return null;
};

const WinrateOverTimeChart: React.FC<WinrateOverTimeChartProps> = ({
  battles,
  playerName,
  selectedCharacterId,
  polarisId
}) => {
  const [timeSpan, setTimeSpan] = useState<TimeSpan>('all');

  // Calculate all-time winrate data once
  const allTimeData = useMemo(() => {
    // Filter battles for selected character if specified
    const filteredBattles = selectedCharacterId 
      ? battles.filter(battle => 
          battle.player1CharacterId === selectedCharacterId ||
          battle.player2CharacterId === selectedCharacterId
        )
      : battles;

    // Calculate running win rate
    let wins = 0;
    let losses = 0;
    
    return filteredBattles.slice().reverse().map((battle) => {
      const isPlayer1 = battle.player1PolarisId === polarisId;
      const won = isPlayer1 ? battle.winner === 1 : battle.winner === 2;
      
      if (won) wins++;
      else losses++;
      
      const totalGames = wins + losses;
      const winRate = (wins / totalGames) * 100;
      
      const date = new Date(battle.date);
      
      return {
        date: battle.date,
        winRate,
        formattedDate: format(date, 'MMM d, yyyy HH:mm'),
        totalGames,
        wins,
        losses
      };
    });
  }, [battles, playerName, selectedCharacterId]);

  // Filter display data based on timespan
  const displayData = useMemo(() => {
    if (timeSpan === 'all') return allTimeData;

    const cutoffDate = subDays(new Date(), timeSpan === '7d' ? 7 : 30);
    const cutoffIndex = allTimeData.findIndex(
      point => new Date(point.date) >= cutoffDate
    );

    // If no data within the timespan, return empty array
    if (cutoffIndex === -1) return [];

    // Return data from cutoff point onwards
    return allTimeData.slice(cutoffIndex);
  }, [allTimeData, timeSpan]);

  const timeRangeButtons = (
    <div className="flex gap-2">
      <Button
        variant={timeSpan === '7d' ? 'default' : 'outline'}
        onClick={() => setTimeSpan('7d')}
        size="sm"
      >
        Last 7 Days
      </Button>
      <Button
        variant={timeSpan === '30d' ? 'default' : 'outline'}
        onClick={() => setTimeSpan('30d')}
        size="sm"
      >
        Last 30 Days
      </Button>
      <Button
        variant={timeSpan === 'all' ? 'default' : 'outline'}
        onClick={() => setTimeSpan('all')}
        size="sm"
      >
        All Time
      </Button>
    </div>
  );

  if (displayData.length === 0) {
    return (
      <SimpleChartCard
        title="Win Rate Over Time"
        description="Track your win rate progression"
        action={timeRangeButtons}
      >
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No matches found</p>
        </div>
      </SimpleChartCard>
    );
  }

  // Calculate min and max winrates for dynamic Y-axis domain
  const minWinRate = Math.max(0, Math.floor(Math.min(...displayData.map(d => d.winRate)) - 5));
  const maxWinRate = Math.min(100, Math.ceil(Math.max(...displayData.map(d => d.winRate)) + 5));

  return (
    <SimpleChartCard
      title="Win Rate Over Time"
      description="Track your win rate progression"
      action={timeRangeButtons}
    >
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={displayData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 100
            }}
          >
            <defs>
              <linearGradient id="winRateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              horizontal={true}
              vertical={false}
              strokeDasharray="3 3" 
              opacity={0.2} 
            />
            <XAxis
              dataKey="formattedDate"
              angle={-45}
              textAnchor="end"
              height={30}
              interval="preserveStartEnd"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[minWinRate, maxWinRate]}
              ticks={Array.from({ length: 5 }, (_, i) => minWinRate + (maxWinRate - minWinRate) * i / 4)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="winRate"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#winRateGradient)"
              isAnimationActive={false}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SimpleChartCard>
  );
};

export default WinrateOverTimeChart;
