import React, { useState, useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip, Cell, TooltipProps, ResponsiveContainer } from 'recharts';
import { characterWinratesAtom, characterColors } from '../../app/state/atoms/tekkenStatsAtoms';
import { ChartCard } from '../shared/ChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { ChartProps, ColorMapping } from '../../app/state/types/tekkenTypes';
import { characterIconMap, characterIdMap } from '../../app/state/types/tekkenTypes';
import dynamic from 'next/dynamic';
import Image from 'next/image';

interface WinrateData {
  character: string;
  characterId: number;
  winrate: number;
  originalWinrate: number;
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
          Winrate: {payload[0].payload.originalWinrate.toFixed(2)}%
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
          tickFormatter={(value) => `${value.toFixed(1)}%`}
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
          dataKey="winrate"
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
            dataKey="originalWinrate"
            position="right"
            formatter={(value: number) => `${value.toFixed(2)}%`}
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

export const WinrateChart: React.FC<Omit<ChartProps, 'rank' | 'onRankChange'>> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const [rank, setRank] = useState<string>("masterRanks");
  const [characterWinrates] = useAtom(characterWinratesAtom);
  const colors = useAtomValue(characterColors);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, [isInitialRender]);

  const { data, domainMin, domainMax } = useMemo(() => {
    const rankData = characterWinrates[rank as keyof typeof characterWinrates]?.globalStats || {};
    
    // First, create the chart data with original winrates
    const chartData = Object.entries(rankData)
      .map(([character, winrate]) => {
        // Find character ID by looking up the character name in the values
        const characterId = Object.entries(characterIdMap)
        // eslint-disable-next-line
          .find(([_, name]) => name === character)?.[0];
        return {
          character,
          characterId: characterId ? parseInt(characterId) : -1,
          winrate: winrate, // Temporary value, will be normalized
          originalWinrate: winrate
        };
      })
      .sort((a, b) => b.originalWinrate - a.originalWinrate);
    
    // Find the maximum value (the highest winrate character)
    const maxOriginalWinrate = Math.max(...chartData.map(d => d.originalWinrate));
    
    // Normalize all values as percentage of maximum (0-100 scale)
    chartData.forEach(item => {
      item.winrate = (item.originalWinrate / maxOriginalWinrate) * 100;
    });
    
    // Set domain for the normalized values
    const minWinrate = 0; // Minimum will always be 0 or close to it
    const maxWinrate = 100; // Maximum will always be 100 for the highest winrate character
    const domainPadding = 5; // Add a small padding
    
    return {
      data: chartData,
      domainMin: minWinrate,
      domainMax: maxWinrate + domainPadding
    };
  }, [characterWinrates, rank]);

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
