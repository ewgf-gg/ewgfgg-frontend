import React, { useState, useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip, Cell, TooltipProps, ResponsiveContainer } from 'recharts';
import { characterPopularityAtom, characterColors } from '../../app/state/atoms/tekkenStatsAtoms';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { ColorMapping, characterIdMap, characterIconMap } from '../../app/state/types/tekkenTypes';
import dynamic from 'next/dynamic';
import Image from 'next/image';

interface PopularityData {
  character: string;
  characterId: string;
  pickRate: number;
  displayRate: string;
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
          {payload[0].payload.displayRate} pick rate
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
  colors: ColorMapping[];
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
          tickFormatter={(value: number) => `${value.toFixed(1)}%`}
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
          dataKey="pickRate"
          radius={[0, 4, 4, 0]}
          isAnimationActive={true}
          animationBegin={isInitialRender ? 500 : 100}
          animationDuration={1000}
          animationEasing="ease"
        >
          {data.map((entry) => {
            const colorMapping = colors.find(c => c.id === entry.characterId);
            return (
              <Cell 
                key={`cell-${entry.character}`} 
                fill={colorMapping?.color || 'hsl(var(--primary))'}
              />
            );
          })}
          <LabelList
            dataKey="displayRate"
            position="right"
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

interface PopularityChartProps {
  title: string;
  description?: string;
  delay?: number;
}

export const PopularityChart: React.FC<PopularityChartProps> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const [characterPopularity] = useAtom(characterPopularityAtom);
  const colors = useAtomValue(characterColors);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, [isInitialRender]);

  const { data, domainMin, domainMax } = useMemo(() => {
    // Transform the data for the chart
    const chartData: PopularityData[] = characterPopularity
      .map(item => {
        const characterName = characterIdMap[parseInt(item.characterId)];
        return {
          character: characterName || `Unknown (${item.characterId})`,
          characterId: item.characterId,
          pickRate: item.pickRate,
          displayRate: `${item.pickRate.toFixed(1)}%`
        };
      })
      .sort((a, b) => b.pickRate - a.pickRate)
    
    // Set domain for the chart
    const minRate = 0;
    const maxRate = Math.max(...chartData.map(d => d.pickRate));
    const domainPadding = maxRate * 0.1; // Add 10% padding
    
    return {
      data: chartData,
      domainMin: minRate,
      domainMax: maxRate + domainPadding
    };
  }, [characterPopularity]);

  const ticks = useMemo(() => {
    return Array.from(
      { length: 5 },
      (_, i) => Math.round((domainMin + (domainMax - domainMin) * (i / 4)) * 10) / 10
    );
  }, [domainMin, domainMax]);

  return (
    <SimpleChartCard {...props} height={200}>
      <ClientSideChart
        data={data}
        domainMin={domainMin}
        domainMax={domainMax}
        ticks={ticks}
        isInitialRender={isInitialRender}
        colors={colors}
      />
    </SimpleChartCard>
  );
};
