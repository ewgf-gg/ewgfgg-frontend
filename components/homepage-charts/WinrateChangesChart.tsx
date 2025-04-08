import React, { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip, Cell, ReferenceLine, ResponsiveContainer } from 'recharts';
import { winrateChangesAtom } from '@/app/state/atoms/tekkenStatsAtoms';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { CustomTooltip } from '../shared/CustomTooltip';
import { characterIdMap } from '@/app/state/types/tekkenTypes';

interface WinRateTrendsProps {
  title: string;
  description?: string;
  delay?: number;
}

export const WinRateTrends: React.FC<WinRateTrendsProps> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [winrateChanges] = useAtom(winrateChangesAtom);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, [isInitialRender]);

  const { data, domain } = useMemo(() => {
    // Process the data for the chart
    const chartData = [...winrateChanges]
      .map(entry => ({
        ...entry,
        characterName: characterIdMap[parseInt(entry.characterId)] || `Unknown (${entry.characterId})`,
        // For decrease trends, make the change negative for the chart
        displayChange: entry.trend === 'decrease' ? -entry.change : entry.change,
        // Format the change for display
        formattedChange: `${entry.trend === 'decrease' ? '-' : '+'}${entry.change.toFixed(2)}%`
      }))
      // Sort by trend first (increases first), then by magnitude of change
      .sort((a, b) => {
        // If trends are different, sort increases first
        if (a.trend !== b.trend) {
          return a.trend === 'increase' ? -1 : 1;
        }
        // If trends are the same, sort by magnitude (highest first)
        return b.change - a.change;
      })
    
    const changes = chartData.map(d => d.displayChange);
    const maxAbsChange = Math.ceil(Math.max(...changes.map(Math.abs)));
    const domainPadding = maxAbsChange * 0.1;
    
    return {
      data: chartData,
      domain: [-maxAbsChange - domainPadding, maxAbsChange + domainPadding] as [number, number]
    };
  }, [winrateChanges]);

  const getBarColor = (change: number) => {
    return change >= 0
      ? 'hsl(142.1 76.2% 36.3%)' // Green for increases
      : 'hsl(0 84.2% 60.2%)'     // Red for decreases
  };

  return (
    <SimpleChartCard {...props} height={250}>
      <div className="w-full" style={{ minHeight: "200px" }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 100, right: 58, top: 8, bottom: 8 }}
          >
            <YAxis
              dataKey="characterName"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={<CustomYAxisTick />}
              width={60}
            />
            <XAxis
              type="number"
              domain={domain}
              tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
            />
            <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeWidth={1} />
            <Bar
              dataKey="displayChange"
              radius={[0, 4, 4, 0]}
              isAnimationActive={true}
              animationBegin={isInitialRender ? 900 : 100}
              animationDuration={1000}
              animationEasing="ease"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.displayChange)}
                />
              ))}
              <LabelList
                dataKey="formattedChange"
                position="right"
                style={{ fontSize: '14px' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SimpleChartCard>
  );
};
