'use client';

import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  LabelList,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { characterColors } from '@/app/state/atoms/tekkenStatsAtoms';
import { useAtomValue } from 'jotai';
import { characterIconMap, characterIdMap } from '@/app/state/types/tekkenTypes';

interface VersionStatsChartProps {
  data: { [character: string]: number };
  title: string;
  valueLabel: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-background border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <img
            src={characterIconMap[label] || ''}
            alt={label}
            className="w-6 h-6"
          />
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-sm">
          {payload[0].value.toLocaleString()} {payload[0].payload.valueLabel}
        </div>
      </div>
    );
  }
  return null;
};

const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <foreignObject 
      x="-20" 
      y="0" 
      width="40" 
      height="40" 
      style={{ overflow: 'visible' }}
    >
      <div className="flex items-center justify-center">
        <img
          src={characterIconMap[payload.value]}
          alt={payload.value}
          className="w-12 h-12"
          style={{ transformOrigin: 'center' }}
        />
      </div>
    </foreignObject>
  </g>
);

export function VersionStatsChart({ data, valueLabel }: VersionStatsChartProps) {
  const colors = useAtomValue(characterColors);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([character, value]) => {
        const characterEntry = Object.entries(characterIdMap).find(([_, name]) => name === character);
        return {
          character,
          characterId: characterEntry ? parseInt(characterEntry[0]) : -1,
          value,
          originalValue: value,
          valueLabel
        };
      })
      .sort((a, b) => b.originalValue - a.originalValue);
  }, [data, valueLabel]);

  const { domainMin, domainMax } = useMemo(() => {
    const values = chartData.map(d => d.value);
    const min = Math.floor(Math.min(...values));
    const max = Math.ceil(Math.max(...values));
    const padding = (max - min) * 0.05;

    return {
      domainMin: Math.max(0, min - padding),
      domainMax: valueLabel === 'winrate' ? Math.min(100, max + padding) : max + padding
    };
  }, [chartData, valueLabel]);

  if (!chartData.length) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ left: 20, right: 20, top: 20, bottom: 30 }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <XAxis
          dataKey="character"
          interval={0}
          tick={<CustomXAxisTick />}
          height={60}
        />
        <YAxis
          domain={[domainMin, domainMax]}
          tickFormatter={(value) => valueLabel === 'winrate' ? `${value.toFixed(1)}%` : formatNumber(value)}
          axisLine={false}
          tickLine={false}
        />
        {valueLabel === 'winrate' && (
          <ReferenceLine 
            y={50} 
            stroke="hsl(var(--muted-foreground))" 
            strokeDasharray="3 3"
            label={{ 
              value: "50%", 
              position: "right",
              fill: "hsl(var(--muted-foreground))"
            }}
          />
        )}
        <Tooltip content={<ChartTooltip />} cursor={false} />
        <Bar
          dataKey="value"
          radius={[4, 4, 0, 0]}
          isAnimationActive={true}
          animationDuration={1000}
          animationEasing="ease"
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          {chartData.map((entry, index) => {
            const colorMapping = entry.characterId !== -1 
              ? colors.find(c => c.id === entry.characterId.toString()) 
              : null;
            return (
              <Cell 
                key={`cell-${entry.character}`} 
                fill={colorMapping?.color || 'hsl(var(--primary))'}
                style={{
                  filter: activeIndex === index ? `drop-shadow(0 0 6px ${colorMapping?.color || 'hsl(var(--primary))'})` : 'none',
                  transition: 'filter 0.3s ease-in-out'
                }}
              />
            );
          })}
          <LabelList
            dataKey="originalValue"
            position="top"
            formatter={(value: number) => {
              if (valueLabel === 'winrate') {
                return `${value.toFixed(2)}%`;
              }
              return formatNumber(value);
            }}
            offset={10}
            angle={-30}
            style={{ fontSize: '12px' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
