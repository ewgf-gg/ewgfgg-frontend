/* eslint-disable react/prop-types */

import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { Battle, BattleType } from '../../app/state/types/tekkenTypes';
import { format, subDays } from 'date-fns';
import { Button } from '../ui/button';
import { rankDivisionColors } from '../../app/state/atoms/tekkenStatsAtoms';

interface TekkenPowerChartProps {
  battles: Battle[];
  playerName: string;
  polarisId: string;
}

interface ChartDataPoint {
  date: string;
  tekkenPower: number;
  formattedDate: string;
  rankDivision: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: ChartDataPoint;
  r?: number;
  value?: number;
  index?: number;
}

type TimeSpan = '7d' | '30d' | 'all';

const CustomTooltip = React.memo<CustomTooltipProps>(({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-2 rounded-md">
        <p className="font-bold">{data.formattedDate}</p>
        <p>Tekken Power: {data.tekkenPower.toLocaleString()}</p>
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

// Memoize rank division calculation
const getRankDivision = (tekkenPower: number): number => {
  if (tekkenPower >= 350000) return 12; // God of Destruction
  if (tekkenPower >= 250000) return 11; // Tekken God Supreme
  if (tekkenPower >= 240000) return 10; // Tekken God
  if (tekkenPower >= 230000) return 9;  // Tekken Emperor
  if (tekkenPower >= 210000) return 8;  // Tekken King
  if (tekkenPower >= 170000) return 7;  // Fujin-Bushin
  if (tekkenPower >= 135000) return 6;  // Mighty-Battle Ruler
  if (tekkenPower >= 100000) return 5;  // Garyu-Tenryu
  if (tekkenPower >= 75000) return 4;   // Vanquisher-Eliminator
  if (tekkenPower >= 50000) return 3;   // Warrior-Dominator
  if (tekkenPower >= 35000) return 2;   // Brawler-Cavalry
  if (tekkenPower >= 10000) return 1;   // 1st Dan-Fighter
  return 0;                             // Beginner
};

// Memoize custom dot component
const CustomDot = ({ cx = 0, cy = 0, payload, r = 4 }: CustomDotProps) => {
  if (!payload) return null;
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={r} 
      fill={payload.color} 
      stroke="none"
    />
  );
};

const TimeRangeButtons = React.memo(({ 
  timeSpan, 
  setTimeSpan 
}: { 
  timeSpan: TimeSpan; 
  setTimeSpan: (span: TimeSpan) => void;
}) => (
  <div className="flex gap-2">
    <Button
      variant={timeSpan === '7d' ? 'default' : 'outline'}
      onClick={() => setTimeSpan('7d')}
      size="sm"
    >
      <span className="inline sm:hidden">7D</span>
      <span className="hidden sm:inline">Last 7 Days</span>
    </Button>
    <Button
      variant={timeSpan === '30d' ? 'default' : 'outline'}
      onClick={() => setTimeSpan('30d')}
      size="sm"
    >
      <span className="inline sm:hidden">30D</span>
      <span className="hidden sm:inline">Last 30 Days</span>
    </Button>
    <Button
      variant={timeSpan === 'all' ? 'default' : 'outline'}
      onClick={() => setTimeSpan('all')}
      size="sm"
    >
      <span className="inline sm:hidden">All</span>
      <span className="hidden sm:inline">All Time</span>
    </Button>
  </div>
));

TimeRangeButtons.displayName = 'TimeRangeButtons';

const TekkenPowerChart: React.FC<TekkenPowerChartProps> = ({
  battles,
  polarisId
}) => {
  const [timeSpan, setTimeSpan] = useState<TimeSpan>('all');

  // Calculate all-time tekken power data with bucketing to reduce data points
  const allTimeData = useMemo(() => {
    if (battles.length === 0) return [];
    
    // Filter for ranked battles only
    const rankedBattles = battles.filter(battle => 
      battle.battleType === BattleType.RANKED_BATTLE
    );
    
    if (rankedBattles.length === 0) return [];
    
    // Sort battles by date (oldest first)
    const sortedBattles = rankedBattles.slice().sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Group battles by day to reduce data points
    const battlesByDay: Record<string, { 
      date: string; 
      tekkenPower: number; 
      rankDivision: number;
      color: string;
    }> = {};
    
    sortedBattles.forEach(battle => {
      const date = new Date(battle.date);
      const dayKey = format(date, 'yyyy-MM-dd'); // Group by day
      const isPlayer1 = battle.player1PolarisId === polarisId;
      const tekkenPower = isPlayer1 ? battle.player1TekkenPower : battle.player2TekkenPower;
      
      // For each day, keep the latest battle's tekken power
      if (!battlesByDay[dayKey] || new Date(battle.date) > new Date(battlesByDay[dayKey].date)) {
        const rankDivision = getRankDivision(tekkenPower);
        const color = rankDivisionColors.init.find(c => c.id === rankDivision.toString())?.color || '#718096';
        
        battlesByDay[dayKey] = {
          date: battle.date,
          tekkenPower,
          rankDivision,
          color
        };
      }
    });
    
    // Get all days sorted
    const days = Object.keys(battlesByDay).sort();
    
    // For very large datasets, further reduce points by sampling
    const maxDataPoints = 100; // Maximum number of data points to display
    const skipFactor = days.length > maxDataPoints ? Math.floor(days.length / maxDataPoints) : 1;
    
    const processedData: ChartDataPoint[] = [];
    let prevRankDivision: number | null = null;
    
    days
      .filter((_, index) => index % skipFactor === 0 || index === days.length - 1) // Sample data points
      .forEach(dayKey => {
        const dayData = battlesByDay[dayKey];
        const date = new Date(dayData.date);
        
        // Add transition point if rank changed
        if (prevRankDivision !== null && prevRankDivision !== dayData.rankDivision) {
          // Find the previous data point
          const prevPoint = processedData[processedData.length - 1];
          
          // Add a transition point with the new tekken power but old rank
          processedData.push({
            date: dayData.date,
            tekkenPower: dayData.tekkenPower,
            formattedDate: format(date, 'MMM d, yyyy'),
            rankDivision: prevRankDivision,
            color: prevPoint.color
          });
        }
        
        // Add the regular data point
        processedData.push({
          date: dayData.date,
          tekkenPower: dayData.tekkenPower,
          formattedDate: format(date, 'MMM d, yyyy'),
          rankDivision: dayData.rankDivision,
          color: dayData.color
        });
        
        prevRankDivision = dayData.rankDivision;
      });
    
    return processedData;
  }, [battles, polarisId]);

  // Filter display data based on timespan
  const displayData = useMemo(() => {
    if (timeSpan === 'all') return allTimeData;

    const cutoffDate = subDays(new Date(), timeSpan === '7d' ? 7 : 30);
    const cutoffIndex = allTimeData.findIndex(
      point => new Date(point.date) >= cutoffDate
    );

    if (cutoffIndex === -1) return [];
    return allTimeData.slice(cutoffIndex);
  }, [allTimeData, timeSpan]);

  // Memoize min and max tekken power calculations
  const { minTekkenPower, maxTekkenPower } = useMemo(() => ({
    minTekkenPower: Math.max(0, Math.floor(Math.min(...displayData.map(d => d.tekkenPower)) - 1000)),
    maxTekkenPower: Math.ceil(Math.max(...displayData.map(d => d.tekkenPower)) + 1000)
  }), [displayData]);

  if (displayData.length === 0) {
    return (
      <SimpleChartCard
        title="Tekken Power Over Time"
        description="Track your Tekken Power progression"
        action={<TimeRangeButtons timeSpan={timeSpan} setTimeSpan={setTimeSpan} />}
      >
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No matches found</p>
        </div>
      </SimpleChartCard>
    );
  }

  return (
    <SimpleChartCard
      title="Tekken Power Over Time"
      description="Track your Tekken Power progression"
      action={<TimeRangeButtons timeSpan={timeSpan} setTimeSpan={setTimeSpan} />}
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
              {rankDivisionColors.init.map((ColorMapping) => (
                <linearGradient
                  key={ColorMapping.id}
                  id={`gradient-${ColorMapping.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={ColorMapping.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={ColorMapping.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <XAxis
              dataKey="formattedDate"
              angle={-45}
              textAnchor="end"
              height={30}
              interval="preserveStartEnd"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[minTekkenPower, maxTekkenPower]}
              tickFormatter={(value) => value.toLocaleString()}
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="tekkenPower"
              stroke="#000000"
              fill={`url(#gradient-${displayData[displayData.length - 1]?.rankDivision || '0'})`}
              strokeWidth={2}
              dot={(props) => <CustomDot {...props} />}
              isAnimationActive={false}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SimpleChartCard>
  );
};

export default React.memo(TekkenPowerChart);
