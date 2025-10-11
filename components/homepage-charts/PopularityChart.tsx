import React, { useState, useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip, Cell, TooltipProps, ResponsiveContainer } from 'recharts';
import { pickratesAtom } from '../../app/state/atoms/tekkenStatsAtoms';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { characterIconMap, characterIdMap, characterColors } from '../../app/state/types/tekkenTypes';
import dynamic from 'next/dynamic';
import Image from 'next/image';

interface PopularityData {
  character: string;
  count: number;
  originalCount: number;
  pickRate: number;
}

interface PopularityTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: PopularityData;
  }>;
  label?: string;
}

const PopularityTooltip: React.FC<PopularityTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length && label && label in characterIconMap) {
    return (
      <div className="bg-background border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <Image
            src={characterIconMap[label]}
            alt={label}
            width={24}
            height={24}
            className="w-6 h-6"
            unoptimized
          />
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-sm">
          {payload[0].payload.originalCount.toLocaleString()} battles
        </div>
        <div className="text-sm text-muted-foreground">
          Pick rate: {(payload[0].payload.pickRate * 100).toFixed(2)}%
        </div>
      </div>
    );
  }
  return null;
};

interface ChartComponentProps {
  data: PopularityData[];
  domainMin: number;
  domainMax: number;
  ticks: number[];
  isInitialRender: boolean;
  colors: any[];
}

const Chart: React.FC<ChartComponentProps> = ({ 
  data, 
  domainMin, 
  domainMax, 
  ticks, 
  isInitialRender, 
  colors 
}) => (
  <div className="w-full" style={{ minHeight: "200px" }}>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
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
          tickFormatter={(value: number) => value.toLocaleString()}
          ticks={ticks}
          axisLine={false}
          tickLine={false}
          tick={false}
        />
        <Tooltip 
          content={<PopularityTooltip />}
          cursor={false}
        />
        <Bar
          dataKey="count"
          radius={[0, 4, 4, 0]}
          isAnimationActive={true}
          animationBegin={isInitialRender ? 500 : 100}
          animationDuration={1000}
          animationEasing="ease"
        >
          {data.map((entry) => {
            const charName = entry.character;
            // Find character ID by looking up the character name in characterIdMap
            const charId = Object.entries(characterIdMap)
              .find(([_, name]) => name === charName)?.[0];
            const colorMapping = colors.find(c => c.id === charId);
            return (
              <Cell 
                key={`cell-${entry.character}`} 
                fill={colorMapping?.color || 'hsl(var(--primary))'}
              />
            );
          })}
          <LabelList
            dataKey="pickRate"
            position="right"
            formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
            style={{ fontSize: '14px' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const ClientSideChart = dynamic(() => Promise.resolve(Chart), {
  ssr: false
});

export const PopularityChart: React.FC<{ title: string; description?: string; delay?: number }> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const pickrates = useAtomValue(pickratesAtom);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, [isInitialRender]);

  const { data, domainMin, domainMax } = useMemo(() => {
    // Get top 5 pickrates
    const top5 = pickrates.slice(0, 5);
    
    // Create chart data
    const chartData: PopularityData[] = top5.map(item => ({
      character: item.tkChar,
      count: item.total_battles,
      originalCount: item.total_battles,
      pickRate: item.pick_rate
    }));
    
    // Find the maximum value for normalization
    const maxCount = Math.max(...chartData.map(d => d.count));
    
    // Normalize all values as percentage of maximum (0-100 scale)
    chartData.forEach(item => {
      item.count = (item.originalCount / maxCount) * 100;
    });
    
    return {
      data: chartData,
      domainMin: 0,
      domainMax: 105 // Add padding
    };
  }, [pickrates]);

  const ticks = useMemo(() => {
    return [0, 25, 50, 75, 100];
  }, []);

  return (
    <SimpleChartCard {...props}>
      <ClientSideChart
        data={data}
        domainMin={domainMin}
        domainMax={domainMax}
        ticks={ticks}
        isInitialRender={isInitialRender}
        colors={characterColors}
      />
    </SimpleChartCard>
  );
};
