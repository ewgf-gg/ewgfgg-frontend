'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { totalPlayersAtom } from '../../app/state/atoms/tekkenStatsAtoms';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { Regions } from '../../app/state/types/tekkenTypes';
import dynamic from 'next/dynamic';

interface RegionData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: RegionData;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, percentage } = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-2 shadow-lg">
        <div className="font-medium">{name}</div>
        <div className="text-sm">{`${percentage.toFixed(2)}% of players`}</div>
      </div>
    );
  }
  return null;
};

interface ChartComponentProps {
  data: RegionData[];
  totalPlayers: number;
  isInitialRender: boolean;
}

const regionColors = {
  asia: '#4169E1',       // Royal Blue
  europe: '#38b000',     // Green
  americas: '#ff6d00',   // Orange
  oceania: '#7b2cbf',    // Purple
  middleEast: '#ffb700', // Gold
  unassigned: '#6c757d'  // Gray
};

const CustomLegend = ({ payload }: any) => {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-2">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 mr-1 rounded-sm" 
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}: {entry.payload.percentage.toFixed(1)}%</span>
        </li>
      ))}
    </ul>
  );
};

const Chart: React.FC<ChartComponentProps> = ({ 
  data, 
  totalPlayers,
  isInitialRender 
}) => (
  <div className="w-full h-full relative">
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          isAnimationActive={true}
          animationBegin={isInitialRender ? 500 : 100}
          animationDuration={1000}
          animationEasing="ease"
          // Remove the label prop to prevent labels on the pie itself
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <div className="text-2xl font-bold">{totalPlayers.toLocaleString()}</div>
      <div className="text-xs text-muted-foreground">Total Players</div>
    </div>
  </div>
);

const ClientSideChart = dynamic(() => Promise.resolve(Chart), {
  ssr: false
});

interface RegionalDistributionChartProps {
  title: string;
  description?: string;
  delay?: number;
}

export const RegionalDistributionChart: React.FC<RegionalDistributionChartProps> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const totalPlayers = useAtomValue(totalPlayersAtom);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, [isInitialRender]);

  // This would normally come from an API or state
  // Using the sample data provided in the task
  const regionDistribution = useMemo(() => {
    return {
      asia: 16.12582,
      europe: 25.009096,
      americas: 39.247414,
      oceania: 2.8285391,
      middleEast: 3.2277505,
      unassigned: 13.561381
    };
  }, []);

  const chartData = useMemo(() => {
    return Object.entries(regionDistribution).map(([region, percentage]) => {
      const regionName = region === 'middleEast' ? 'Middle East' : 
                         region === 'unassigned' ? 'Unassigned' : 
                         region.charAt(0).toUpperCase() + region.slice(1);
      
      return {
        name: regionName,
        value: Math.round(totalPlayers * (percentage / 100)),
        percentage,
        color: regionColors[region as keyof typeof regionColors]
      };
    });
  }, [regionDistribution, totalPlayers]);

  return (
    <SimpleChartCard {...props} height={200}>
      <ClientSideChart
        data={chartData}
        totalPlayers={totalPlayers}
        isInitialRender={isInitialRender}
      />
    </SimpleChartCard>
  );
};

export default RegionalDistributionChart;
