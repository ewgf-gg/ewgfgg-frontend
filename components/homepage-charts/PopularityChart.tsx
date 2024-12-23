// components/charts/PopularityChart.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { characterPopularityAtom, characterColors } from '../../app/state/atoms/tekkenStatsAtoms';
import { ChartCard } from '../shared/ChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { ChartProps } from '../../app/state/types/tekkenTypes';
import { characterIconMap, characterIdMap } from '../../app/state/types/tekkenTypes';
import dynamic from 'next/dynamic';

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

// Create the chart component
const Chart: React.FC<{
  data: any[];
  domainMin: number;
  domainMax: number;
  ticks: number[];
  isInitialRender: boolean;
  colors: any[];
}> = ({ data, domainMin, domainMax, ticks, isInitialRender, colors }) => (
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
      tickFormatter={(value) => value.toLocaleString()}
      ticks={ticks}
      axisLine={false}
      tickLine={false}
      tick={false}
    />
    <Tooltip content={<PopularityTooltip />} />
    <Bar
      dataKey="count"
      radius={[0, 4, 4, 0]}
      isAnimationActive={true}
      animationBegin={isInitialRender ? 500 : 100}
      animationDuration={1000}
      animationEasing="ease"
    >
      {data.map((entry) => {
        const colorMapping = entry.characterId !== -1 
          ? colors.find(c => c.id === entry.characterId.toString()) 
          : null;
        return (
          <Cell 
            key={`cell-${entry.character}`} 
            fill={colorMapping?.color || 'hsl(var(--primary))'}
          />
        );
      })}
      <LabelList
        dataKey="originalCount"
        position="right"
        formatter={(value: number) => value.toLocaleString()}
      />
    </Bar>
  </BarChart>
);

// Create a client-side only version of the chart
const ClientSideChart = dynamic(() => Promise.resolve(Chart), {
  ssr: false
});

export const PopularityChart: React.FC<Omit<ChartProps, 'rank' | 'onRankChange'>> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [rank, setRank] = useState("highRank");
  const [characterPopularity] = useAtom(characterPopularityAtom);
  const colors = useAtomValue(characterColors);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, []);

  const { data, domainMin, domainMax } = useMemo(() => {
    const rankData = characterPopularity[rank as keyof typeof characterPopularity]?.globalStats || {};
    
    const chartData = Object.entries(rankData)
      .map(([character, totalBattles]) => {
        // Find character ID from the map
        const characterEntry = Object.entries(characterIdMap).find(([_, name]) => name === character);
        return {
          character,
          characterId: characterEntry ? parseInt(characterEntry[0]) : -1,
          count: totalBattles,
          originalCount: totalBattles
        };
      })
      .sort((a, b) => b.originalCount - a.originalCount);
    
    const minCount = Math.floor(Math.min(...chartData.map(d => d.count)));
    const maxCount = Math.ceil(Math.max(...chartData.map(d => d.count)));
    const domainPadding = (maxCount - minCount) * 0.05;
    
    return {
      data: chartData,
      domainMin: Math.max(0, minCount - domainPadding),
      domainMax: maxCount + domainPadding
    };
  }, [characterPopularity, rank]);

  const ticks = useMemo(() => {
    return Array.from(
      { length: 5 },
      (_, i) => Math.round(domainMin + (domainMax - domainMin) * (i / 4))
    );
  }, [domainMin, domainMax]);

  return (
    <ChartCard {...props} rank={rank} onRankChange={setRank}>
      <ClientSideChart
        data={data}
        domainMin={domainMin}
        domainMax={domainMax}
        ticks={ticks}
        isInitialRender={isInitialRender}
        colors={colors}
      />
    </ChartCard>
  );
};
