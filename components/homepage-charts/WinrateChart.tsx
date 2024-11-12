// components/charts/WinrateChart.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip } from 'recharts';
import { characterWinratesAtom } from '@/app/state/atoms/tekkenStatsAtoms';
import { ChartCard } from '../shared/ChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { CustomTooltip } from '../shared/CustomTooltip';
import { ChartProps } from '@/app/state/types/tekkenTypes';

export const WinrateChart: React.FC<Omit<ChartProps, 'rank' | 'onRankChange'>> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [rank, setRank] = useState("highRank");
  const [characterWinrates] = useAtom(characterWinratesAtom);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, []);

  const { data, domainMin, domainMax } = useMemo(() => {
    const rankData = characterWinrates[rank as keyof typeof characterWinrates] || {};
    
    const chartData = Object.entries(rankData)
      .map(([character, winrate]) => ({
        character,
        winrate,
        originalWinrate: winrate
      }))
      .sort((a, b) => b.originalWinrate - a.originalWinrate);
    
    const minWinrate = Math.floor(Math.min(...chartData.map(d => d.winrate)));
    const maxWinrate = Math.ceil(Math.max(...chartData.map(d => d.winrate)));
    const domainPadding = (maxWinrate - minWinrate) * 0.05;
    
    return {
      data: chartData,
      domainMin: Math.max(0, minWinrate - domainPadding),
      domainMax: Math.min(100, maxWinrate + domainPadding)
    };
  }, [characterWinrates, rank]);

  const ticks = useMemo(() => {
    return Array.from(
      { length: 5 },
      (_, i) => domainMin + (domainMax - domainMin) * (i / 4)
    );
  }, [domainMin, domainMax]);

  return (
    <ChartCard {...props} rank={rank} onRankChange={setRank}>
      <BarChart
        width={400}
        height={200}
        data={data}
        layout="vertical"
        margin={{ left: 100, right: 58, top: 2, bottom: -12 }}
      >
        <YAxis
          dataKey="character"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={<CustomYAxisTick />}
          width={60}
        />
        <XAxis
          type="number"
          domain={[domainMin, domainMax]}
          tickFormatter={(value) => `${value.toFixed(1)}%`}
          ticks={ticks}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="winrate"
          fill="hsl(var(--primary))"
          radius={[0, 4, 4, 0]}
          isAnimationActive={true}
          animationBegin={isInitialRender ? 750 : 100}
          animationDuration={1000}
          animationEasing="ease"
        >
          <LabelList
            dataKey="originalWinrate"
            position="right"
            formatter={(value: number) => `${value.toFixed(2)}%`}
          />
        </Bar>
      </BarChart>
    </ChartCard>
  );
};
