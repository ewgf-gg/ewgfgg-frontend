'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityGraphData, BattleActivityDataPoint } from '@/app/state/types/ActivityPageTypes';

interface ActivityGraphChartProps {
  data: ActivityGraphData;
  title?: string;
  description?: string;
}

interface ChartDataPoint {
  date: string;
  battles: number;
  activePlayers: number;
  timestamp: number;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="font-medium mb-2 text-white">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="font-medium text-white">{entry.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ActivityGraphChart: React.FC<ActivityGraphChartProps> = ({ 
  data, 
  title = "Game Activity Over Time",
  description = "Ranked battles and daily active players"
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Combine the data for the chart
  const chartData: ChartDataPoint[] = React.useMemo(() => {
    const battleMap = new Map<string, BattleActivityDataPoint>();
    data.battleActivity.forEach(item => {
      battleMap.set(item.date, item);
    });

    const playerMap = new Map<string, number>();
    data.playerActivity.forEach(item => {
      playerMap.set(item.date, item.activePlayers);
    });

    // Get all unique dates and sort them
    const allDates = new Set([
      ...data.battleActivity.map(d => d.date),
      ...data.playerActivity.map(d => d.date)
    ]);

    return Array.from(allDates)
      .sort((a, b) => {
        const battleA = battleMap.get(a);
        const battleB = battleMap.get(b);
        return (battleA?.timestamp || 0) - (battleB?.timestamp || 0);
      })
      .map(date => {
        const battleData = battleMap.get(date);
        return {
          date,
          battles: battleData?.battles || 0,
          activePlayers: playerMap.get(date) || 0,
          timestamp: battleData?.timestamp || 0
        };
      });
  }, [data]);

  if (!isClient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{title}</CardTitle>
            {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px] flex items-center justify-center">
              <p className="text-gray-400">Loading chart...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
          {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBattles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value.toString();
                }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                  return value.toString();
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="battles"
                name="Ranked Battles"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorBattles)"
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="activePlayers"
                name="Daily Active Players"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorPlayers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};
