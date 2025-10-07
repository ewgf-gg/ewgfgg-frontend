import React, { useState, useEffect, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip, Cell, TooltipProps, ResponsiveContainer } from 'recharts';
import { winratesAtom, characterColors } from '../../app/state/atoms/tekkenStatsAtoms';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { characterIconMap, characterIdMap } from '../../app/state/types/tekkenTypes';
import dynamic from 'next/dynamic';
import Image from 'next/image';

interface WinrateData {
  character: string;
  winRate: number;
  totalGames: number;
  wins: number;
}

interface WinrateTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: WinrateData;
  }>;
  label?: string;
}

const WinrateTooltip: React.FC<WinrateTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length && label && label in characterIconMap) {
    const data = payload[0].payload;
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
          Win rate: {data.winRate.toFixed(2)}%
        </div>
        <div className="text-sm text-muted-foreground">
          {data.wins.toLocaleString()}W / {data.totalGames.toLocaleString()} games
        </div>
      </div>
    );
  }
  return null;
};

interface ChartComponentProps {
  data: WinrateData[];
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
          tickFormatter={(value: number) => `${value}%`}
          ticks={ticks}
          axisLine={false}
          tickLine={false}
          tick={false}
        />
        <Tooltip 
          content={<WinrateTooltip />}
          cursor={false}
        />
        <Bar
          dataKey="winRate"
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
            dataKey="winRate"
            position="right"
            formatter={(value: number) => `${value.toFixed(1)}%`}
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

export const WinrateChart: React.FC<{ title: string; description?: string; delay?: number }> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const winrates = useAtomValue(winratesAtom);
  const colors = useAtomValue(characterColors);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, [isInitialRender]);

  const { data, domainMin, domainMax } = useMemo(() => {

    
    // Create chart data with winRate as percentage
    const chartData: WinrateData[] = winrates.map(item => ({
      character: item.tkChar,
      winRate: item.win_rate * 100, // Convert to percentage
      totalGames: item.total_games,
      wins: item.total_wins
    }));
    
    // Calculate domain for percentage display (0-100)
    const rates = chartData.map(d => d.winRate);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);
    
    // Add padding
    const padding = 2;
    
    return {
      data: chartData,
      domainMin: Math.max(0, minRate - padding),
      domainMax: Math.min(100, maxRate + padding)
    };
  }, [winrates]);

  const ticks = useMemo(() => {
    // Generate appropriate ticks based on domain
    const range = domainMax - domainMin;
    const step = range > 20 ? 5 : range > 10 ? 2 : 1;
    const ticks = [];
    for (let i = Math.floor(domainMin); i <= Math.ceil(domainMax); i += step) {
      ticks.push(i);
    }
    return ticks;
  }, [domainMin, domainMax]);

  return (
    <SimpleChartCard {...props}>
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
