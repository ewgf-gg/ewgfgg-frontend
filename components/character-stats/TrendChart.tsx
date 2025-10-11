'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendData } from '@/app/state/types/CharacterPageTypes';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

interface TrendChartProps {
  trendData: TrendData[];
  characterName: string;
}

export function TrendChart({ trendData, characterName }: TrendChartProps) {
  const chartConfig = {
    winRate: {
      label: 'Win Rate',
      color: 'hsl(270, 70%, 65%)',
    },
    pickRate: {
      label: 'Pick Rate',
      color: 'hsl(217, 91%, 60%)',
    },
  } satisfies ChartConfig;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-white mb-2">
            {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-400">{entry.name}:</span>
              <span className="text-white font-medium">{entry.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Performance Trends Over Time
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270, 70%, 65%)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="hsl(270, 70%, 65%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(270, 70%, 65%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPickRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              formatter={(value) => <span className="text-gray-300">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="winRate"
              stroke="hsl(270, 70%, 65%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorWinRate)"
              name="Win Rate"
            />
            <Area
              type="monotone"
              dataKey="pickRate"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPickRate)"
              name="Pick Rate"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
