import React from 'react';
import { useAtomValue } from 'jotai';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { activePlayersAtom } from '../../app/state/atoms/tekkenStatsAtoms';
import { regionColors } from '../../app/state/types/tekkenTypes';

interface RegionData {
  name: string;
  value: number;
  percentage: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: RegionData;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-2 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Players: {data.value.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground">
          {data.percentage.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percentage
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);


  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-sm font-medium"
    >
      {`${percentage.toFixed(0)}%`}
    </text>
  );
};

export const RegionDistributionChart: React.FC<{ delay?: number }> = ({ delay = 1.0 }) => {
  const activePlayers = useAtomValue(activePlayersAtom);

  const { data, totalPlayers } = React.useMemo(() => {
    const total = activePlayers.reduce((sum, region) => sum + region.count, 0);
    
    // Map region names to display names
    const regionNameMap: { [key: string]: string } = {
      'ASIA': 'Asia',
      'AMERICAS': 'Americas',
      'EUROPE': 'Europe',
      'OCEANIA': 'Oceania',
      'MIDDLE_EAST': 'Middle East'
    };
    
    const regionData = activePlayers.map(region => ({
      name: regionNameMap[region.region] || region.region,
      value: region.count,
      percentage: (region.count / total) * 100
    })).sort((a, b) => b.value - a.value);
    
    return { data: regionData, totalPlayers: total };
  }, [activePlayers]);

  return (
    <SimpleChartCard 
      title="Recently Active Players" 
      description="Within the last 15 minutes"
      delay={delay}
      headerClassName="pb-2 pt-3"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="text-2xl font-bold fill-current"
          >
            {totalPlayers.toLocaleString()}
          </text>
          <text 
            x="50%" 
            y="50%" 
            dy={20}
            textAnchor="middle" 
            dominantBaseline="middle"
            className="text-xs text-muted-foreground fill-current"
          >
            players
          </text>
          <Pie
            data={data}
            cx="50%"
            cy="55%"
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={50}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={regionColors[entry.name.toUpperCase().replace(' ', '_')] || '#718096'} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={10}
            formatter={(value: string) => value}
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </SimpleChartCard>
  );
};
