import React, { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip, Cell, ReferenceLine, ResponsiveContainer } from 'recharts';
import { winrateChangesAtom } from '@/app/state/atoms/tekkenStatsAtoms';
import { ChartCard } from '../shared/ChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { CustomTooltip } from '../shared/CustomTooltip';
import { ChartProps } from '@/app/state/types/tekkenTypes';

export const WinRateTrends: React.FC<Omit<ChartProps, 'rank' | 'onRankChange'>> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [rank, setRank] = useState("intermediateRanks");
  const [winrateChanges] = useAtom(winrateChangesAtom);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, [isInitialRender]);

  const { data, domain } = useMemo(() => {
    // Map the rank values from the selector to the keys in the winrateChangesAtom
    const rankMap: Record<string, keyof typeof winrateChanges> = {
      "masterRanks": "master",
      "advancedRanks": "advanced",
      "intermediateRanks": "intermediate",
      "beginnerRanks": "beginner"
    };
    
    const mappedRank = rankMap[rank] || "master";
    const rankData = winrateChanges[mappedRank] || [];
    
    const chartData = [...rankData]
      .map(entry => ({
        ...entry,
        change: entry.trend === 'decrease' ? -entry.change : entry.change
      }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    
    const changes = chartData.map(d => d.change);
    const maxAbsChange = Math.ceil(Math.max(...changes.map(Math.abs)));
    const domainPadding = maxAbsChange * 0.1;
    
    return {
      data: chartData,
      domain: [-maxAbsChange - domainPadding, maxAbsChange + domainPadding] as [number, number]
    };
  }, [winrateChanges, rank]);

  const getBarColor = (change: number) => {
    return change >= 0
      ? 'hsl(142.1 76.2% 36.3%)' 
      : 'hsl(0 84.2% 60.2%)'    
  };

  return (
    <ChartCard {...props} rank={rank} onRankChange={setRank}>
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
          {data.map((entry, index) => (
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
    </ChartCard>
  );
};
