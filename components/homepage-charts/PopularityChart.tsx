// components/charts/PopularityChart.tsx
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip } from 'recharts';
import { characterPopularityAtom } from '../../app/state/atoms/tekkenStatsAtoms';
import { ChartCard } from '../shared/ChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { ChartProps } from '../../app/state/types/tekkenTypes';
import { characterIconMap } from '../../app/state/types/tekkenTypes';

// Create a custom tooltip specifically for popularity data
const PopularityTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <img
            src={characterIconMap[label]}
            alt={label}
            className="w-6 h-6"
          />
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-sm">
          {payload[0].value.toLocaleString()} character picks
        </div>
      </div>
    );
  }
  return null;
};

export const PopularityChart: React.FC<Omit<ChartProps, 'rank' | 'onRankChange'>> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [rank, setRank] = useState("highRank");
  const [characterPopularity] = useAtom(characterPopularityAtom);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, []);

  const data = React.useMemo(() => {
    const rankData = characterPopularity[rank as keyof typeof characterPopularity] || {};
    return Object.entries(rankData)
      .map(([character, totalBattles]) => ({
        character,
        count: totalBattles,
        originalCount: totalBattles
      }))
      .sort((a, b) => b.originalCount - a.originalCount);
  }, [characterPopularity, rank]);

  return (
    <ChartCard {...props} rank={rank} onRankChange={setRank}>
      <BarChart
        width={400}
        height={200}
        data={data}
        layout="vertical"
        margin={{ left: 100, right: 58, top: 8, bottom: 8 }}
      >
        <YAxis
          dataKey="character"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={<CustomYAxisTick />}
          width={60}
        />
        <XAxis type="number" hide />
        <Tooltip content={<PopularityTooltip />} />
        <Bar
          dataKey="count"
          fill="hsl(var(--primary))"
          radius={[0, 4, 4, 0]}
          isAnimationActive={true}
          animationBegin={isInitialRender ? 500 : 100}
          animationDuration={1000}
          animationEasing="ease"
        >
          <LabelList
            dataKey="originalCount"
            position="right"
            formatter={(value: number) => value.toLocaleString()}
          />
        </Bar>
      </BarChart>
    </ChartCard>
  );
};
