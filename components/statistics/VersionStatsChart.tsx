'use client';

import React, { useMemo, useState, useEffect } from 'react';
import useWindowSize, { isMobileView } from '../../lib/hooks/useWindowSize';
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
import { characterColors } from '../../app/state/atoms/tekkenStatsAtoms';
import { useAtomValue } from 'jotai';
import { characterIconMap, characterIdMap } from '../../app/state/types/tekkenTypes';

interface VersionStatsChartProps {
  data: { [character: string]: number };
  title: string;
  valueLabel: string;
}

interface ChartData {
  character: string;
  characterId: number;
  value: number;
  originalValue: number;
  valueLabel: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartData;
  }>;
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

interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

const CustomXAxisTick: React.FC<CustomXAxisTickProps> = ({ x = 0, y = 0, payload }) => {
  if (!payload) return null;
  
  const { width } = useWindowSize();
  const isMobile = isMobileView(width);
  
  // For mobile, display character name text instead of portrait
  if (isMobile) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-5}
          y={0}
          dy={4}
          textAnchor="end"
          fill="currentColor"
          fontSize={12}
          className="font-medium"
        >
          {payload.value}
        </text>
      </g>
    );
  }
  
  // For desktop, keep the portrait images
  return (
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
};

export function VersionStatsChart({ data, valueLabel }: VersionStatsChartProps) {
  const colors = useAtomValue(characterColors);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const { width } = useWindowSize();
  const isMobile = isMobileView(width);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, [isInitialRender]);

  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([character, value]) => {
        // Find the character ID by matching the name
        const characterId = Object.entries(characterIdMap)
                // eslint-disable-next-line
          .find(([_, name]) => name === character)?.[0];
        return {
          character,
          characterId: characterId ? parseInt(characterId) : -1,
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
    <ResponsiveContainer width="100%" height={isMobile ? 600 : 400}>
      <BarChart
        data={chartData}
        layout={isMobile ? "vertical" : "horizontal"}
        margin={isMobile ? 
          { top: 10, right: 30, left: 40, bottom: 10 } :
          { top: 20, right: 20, left: 20, bottom: 30 }
        }
        onMouseLeave={() => setActiveIndex(null)}
      >
        {isMobile ? (
          <>
            <XAxis 
              type="number" 
              domain={[domainMin, domainMax]}
              tickFormatter={(value) => valueLabel === 'winrate' ? `${value.toFixed(1)}%` : formatNumber(value)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="character"
              type="category"
              tickLine={false}
              axisLine={false}
              interval={0}
              width={40}
              tick={<CustomXAxisTick />}
            />
          </>
        ) : (
          <>
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
          </>
        )}
        {valueLabel === 'winrate' && (
          <ReferenceLine 
            y={isMobile ? undefined : 50}
            x={isMobile ? 50 : undefined}
            stroke="hsl(var(--muted-foreground))" 
            strokeDasharray="3 3"
            label={{ 
              value: "50%", 
              position: isMobile ? "top" : "right",
              fill: "hsl(var(--muted-foreground))"
            }}
          />
        )}
        <Tooltip content={<ChartTooltip />} cursor={false} />
        <Bar
          dataKey="value"
          radius={isMobile ? [0, 8, 8, 0] : [4, 4, 0, 0]}
          isAnimationActive={true}
          animationBegin={isInitialRender ? 500 : 100}
          animationDuration={1000}
          animationEasing="ease"
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          {chartData.map((entry, index) => {
            const colorMapping = colors.find(c => c.id === entry.characterId.toString());
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
            position={isMobile ? "right" : "top"}
            formatter={(value: number) => {
              if (valueLabel === 'winrate') {
                return `${value.toFixed(2)}%`;
              }
              return formatNumber(value);
            }}
            offset={10}
            angle={isMobile ? 0 : -30}
            style={{ fontSize: '12px' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
