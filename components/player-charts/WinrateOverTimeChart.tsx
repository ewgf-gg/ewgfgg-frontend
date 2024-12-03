import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, Label } from 'recharts';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { Battle, rankOrderMap, rankIconMap } from '../../app/state/types/tekkenTypes';
import { format, subDays } from 'date-fns';
import Image from 'next/image';
import { Button } from '../ui/button';

interface WinrateOverTimeChartProps {
  battles: Battle[];
  playerName: string;
  selectedCharacterId?: number;
}

interface ChartDataPoint {
  date: string;
  winRate: number;
  formattedDate: string;
  totalGames: number;
  wins: number;
  losses: number;
  isPromotion?: boolean;
  isDemotion?: boolean;
  danRank: number | null;
  previousRank?: string;
  newRank?: string;
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
        {data.isPromotion && (
          <div className="flex items-center gap-2 text-green-500">
            <span>Promoted to</span>
            <img 
              src={rankIconMap[data.newRank!]} 
              alt={data.newRank} 
              className="h-6 w-6 object-contain"
            />
          </div>
        )}
        {data.isDemotion && (
          <div className="flex items-center gap-2 text-red-500">
            <span>Demoted to</span>
            <img 
              src={rankIconMap[data.newRank!]} 
              alt={data.newRank} 
              className="h-6 w-6 object-contain"
            />
          </div>
        )}
      </div>
    );
  }
  return null;
};

const WinrateOverTimeChart: React.FC<WinrateOverTimeChartProps> = ({
  battles,
  playerName,
  selectedCharacterId
}) => {
  const [timeSpan, setTimeSpan] = useState<TimeSpan>('all');

  const processData = (battles: Battle[]): ChartDataPoint[] => {
    // Filter battles for selected character if specified
    let filteredBattles = selectedCharacterId 
      ? battles.filter(battle => 
          battle.player1CharacterId === selectedCharacterId ||
          battle.player2CharacterId === selectedCharacterId
        )
      : battles;

    // Apply time span filter
    if (timeSpan !== 'all') {
      const cutoffDate = subDays(new Date(), timeSpan === '7d' ? 7 : 30);
      filteredBattles = filteredBattles.filter(battle => 
        new Date(battle.date) >= cutoffDate
      );
    }

    let wins = 0;
    let losses = 0;
    let lastDanRank: number | null = null;
    
    return filteredBattles.map((battle) => {
      const isPlayer1 = battle.player1Name === playerName;
      const won = isPlayer1 ? battle.winner === 1 : battle.winner === 2;
      const currentDanRank = isPlayer1 ? battle.player1DanRank : battle.player2DanRank;
      
      if (won) wins++;
      else losses++;
      
      const totalGames = wins + losses;
      const winRate = (wins / totalGames) * 100;
      
      const date = new Date(battle.date);

      // Detect rank changes
      const isPromotion = lastDanRank !== null && currentDanRank !== null && currentDanRank > lastDanRank;
      const isDemotion = lastDanRank !== null && currentDanRank !== null && currentDanRank < lastDanRank;
      
      // Get rank names for labels
      const previousRank = lastDanRank !== null ? rankOrderMap[lastDanRank] : undefined;
      const newRank = currentDanRank !== null ? rankOrderMap[currentDanRank] : undefined;
      
      lastDanRank = currentDanRank;
      
      return {
        date: battle.date,
        winRate,
        formattedDate: format(date, 'MMM d, yyyy HH:mm'),
        totalGames,
        wins,
        losses,
        isPromotion,
        isDemotion,
        danRank: currentDanRank,
        previousRank,
        newRank
      };
    });
  };

  const chartData = processData(battles.slice().reverse());

  if (chartData.length === 0) {
    return (
      <SimpleChartCard
        title="Win Rate Over Time"
        description="Track your win rate progression"
      >
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No matches found</p>
        </div>
      </SimpleChartCard>
    );
  }

  return (
    <SimpleChartCard
      title="Win Rate Over Time"
      description="Track your win rate progression"
    >
      <div className="flex gap-2 mb-4">
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
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 30,
              right: 30,
              left: 0,
              bottom: 0
            }}
          >
            <defs>
              <linearGradient id="winRateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="formattedDate"
              angle={-45}
              textAnchor="end"
              height={80}
              interval="preserveStartEnd"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="winRate"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#winRateGradient)"
              isAnimationActive={false}
            />
            {chartData.map((point, index) => (
              <React.Fragment key={index}>
                {point.isPromotion && point.newRank && (
                  <ReferenceDot
                    x={point.formattedDate}
                    y={point.winRate}
                    r={6}
                    fill="#22c55e"
                    stroke="none"
                  >
                    <Label
                      value={`Promoted to ${point.newRank}`}
                      position="top"
                      fill="#22c55e"
                      fontSize={12}
                      offset={15}
                    />
                  </ReferenceDot>
                )}
                {point.isDemotion && point.newRank && (
                  <ReferenceDot
                    x={point.formattedDate}
                    y={point.winRate}
                    r={6}
                    fill="#ef4444"
                    stroke="none"
                  >
                    <Label
                      value={`Demoted to ${point.newRank}`}
                      position="bottom"
                      fill="#ef4444"
                      fontSize={12}
                      offset={15}
                    />
                  </ReferenceDot>
                )}
              </React.Fragment>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SimpleChartCard>
  );
};

export default WinrateOverTimeChart;
