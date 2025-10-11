import React, { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip, Cell, ReferenceLine, ResponsiveContainer } from 'recharts';
import { trendsAtom } from '@/app/state/atoms/tekkenStatsAtoms';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { CustomTooltip } from '../shared/CustomTooltip';
import { TrendEntry } from '@/app/state/types/tekkenTypes';

interface WinRateTrendsProps {
  title: string;
  description?: string;
  delay?: number;
}

interface ChartDataEntry {
  characterId: string;
  change: number;
  trend: 'increase' | 'decrease';
}

export const WinRateTrends: React.FC<WinRateTrendsProps> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [trends] = useAtom(trendsAtom);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, [isInitialRender]);

  const { data, domain } = useMemo(() => {
    // Transform trends data to chart format
    const chartData: ChartDataEntry[] = trends
      .map((entry: TrendEntry) => ({
        characterId: entry.tkChar,
        change: entry.delta,
        trend: entry.trend
      }))
      .sort((a: ChartDataEntry, b: ChartDataEntry) => {
        // If one is positive and one is negative, positive comes first
        if (a.change >= 0 && b.change < 0) return -1;
        if (a.change < 0 && b.change >= 0) return 1;
        
        // If both are positive or both are negative, sort by absolute magnitude
        return Math.abs(b.change) - Math.abs(a.change);
      });
    
    if (chartData.length === 0) {
      return {
        data: [],
        domain: [-1, 1] as [number, number]
      };
    }
    
    const changes = chartData.map((d: ChartDataEntry) => d.change);
    const maxAbsChange = Math.ceil(Math.max(...changes.map(Math.abs)));
    const domainPadding = maxAbsChange * 0.1;
    
    return {
      data: chartData,
      domain: [-maxAbsChange - domainPadding, maxAbsChange + domainPadding] as [number, number]
    };
  }, [trends]);

  const getBarColor = (change: number) => {
    return change >= 0
      ? 'hsl(142.1 76.2% 36.3%)' 
      : 'hsl(0 84.2% 60.2%)'    
  };

  return (
    <SimpleChartCard {...props}>
      <div className="w-full" style={{ minHeight: "200px" }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 100, right: 58, top: 8, bottom: 8 }}
      >
        <YAxis
          dataKey="characterId"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={<CustomYAxisTick />}
          width={60}
        />
        <XAxis
          type="number"
          domain={domain}
          tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`}
        />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={false}
          />
        <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeWidth={1} />
        <Bar
          dataKey="change"
          radius={[0, 4, 4, 0]}
          isAnimationActive={true}
          animationBegin={isInitialRender ? 900 : 100}
          animationDuration={1000}
          animationEasing="ease"
        >
          {data.map((entry: ChartDataEntry, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={getBarColor(entry.change)}
            />
          ))}
          <LabelList
            dataKey="change"
            position="right"
            formatter={(value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`}
            style={{ fontSize: '14px' }}
          />
        </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SimpleChartCard>
  );
};
