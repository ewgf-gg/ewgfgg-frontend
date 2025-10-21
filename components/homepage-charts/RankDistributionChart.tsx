'use client';

import { useAtomValue } from 'jotai';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';
import { 
  rankDistributionNewAtom
} from '../../app/state/atoms/tekkenStatsAtoms';
import React from 'react';
import useWindowSize, { isMobileView } from '../../lib/hooks/useWindowSize';
import { rankIconMap, rankOrderMap, rankColorsAtom } from '../../app/state/types/tekkenTypes';
import Image from 'next/image';

interface ChartDataPoint {
  rank: string;
  percentage: number;
  cumulativePercentage: number;
  fill: string;
  playerCount: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      rank: string;
      percentage: number;
      cumulativePercentage: number;
      playerCount: number;
    };
  }>;
  label?: string;
}

interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

export const RankDistributionChart: React.FC<{ delay?: number }> = ({ delay = 1.2 }) => {
  const rankDistribution = useAtomValue(rankDistributionNewAtom);
  const { width } = useWindowSize();
  const isMobile = isMobileView(width);

  const chartData: ChartDataPoint[] = rankDistribution.map((entry) => {
    const rankName = rankOrderMap[entry.dan_rank] || 'Unknown';
    const colorEntry = rankColorsAtom.find((rc) => rc.id === rankName);
    return {
      rank: rankName,
      percentage: entry.percentage,
      cumulativePercentage: entry.cumulative_percentage,
      fill: colorEntry?.color || '#3182ce',
      playerCount: entry.player_count,
    };
  });

  const CustomXAxisTick: React.FC<CustomXAxisTickProps> = ({ x = 0, y = 0, payload }) => (
    <g transform={`translate(${x},${y})`}>
      <foreignObject 
        x={isMobile ? "-50" : "-20"}
        y={isMobile ? "-13" : "0"}
        width={isMobile ? "60" : "40"}
        height={isMobile ? "40" : "40"}
        style={{ overflow: 'visible' }}
      >
        <div className="flex items-center justify-center">
          <Image
            src={rankIconMap[payload?.value || '']}
            alt={payload?.value || ''}
            width={isMobile ? 23 : 40}
            height={isMobile ? 24 : 32}
            className={`${isMobile ? 'w-8 h-6' : 'w-30 h-8'}`}
            style={{ transformOrigin: 'center' }}
            unoptimized
          />
        </div>
      </foreignObject>
    </g>
  );
  
  // Function to format percentage with first significant digit
  const formatPercentage = (value: number) => {
    if (value === 0) return '0.00%';
    if (value >= 0.01) return `${value.toFixed(2)}%`;
    
    // For values less than 0.01%, find the first significant digit
    const valueStr = value.toString();
    const decimalIndex = valueStr.indexOf('.');
    if (decimalIndex === -1) return `${value.toFixed(2)}%`;
    
    let significantDigits = 0;
    for (let i = decimalIndex + 1; i < valueStr.length; i++) {
      significantDigits++;
      if (valueStr[i] !== '0') {
        // Found first non-zero digit, show up to this digit plus one more
        return `${value.toFixed(significantDigits + 1)}%`;
      }
    }
    
    // If we get here, all digits are zeros
    return `${value.toFixed(2)}%`;
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { percentage, cumulativePercentage, playerCount } = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Image
              src={rankIconMap[label || '']}
              alt={label || ''}
              width={20}
              height={20}
              className="w-20 h-10"
              unoptimized
            />
            <span className="font-medium">{label}</span>
          </div>
          <div className="text-sm">{`${playerCount.toLocaleString()} players`}</div>
          <div className="text-sm text-muted-foreground">{`${formatPercentage(percentage)} of the playerbase`}</div>
          <div className="text-sm text-muted-foreground">{`Top ${formatPercentage(100 - cumulativePercentage + percentage)}`}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <div>
            <CardTitle className="text-2xl font-bold">Rank Distribution</CardTitle>
            <CardDescription>Distribution of players across all ranks • Mains Only</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!chartData.length ? (
            <div className="flex justify-center items-center h-[400px]">
              <p className="text-gray-500">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={isMobile ? 600 : 400}>
              <BarChart
                data={chartData}
                layout={isMobile ? "vertical" : "horizontal"}
                margin={isMobile ? 
                  { top: 10, right: 30, left: 40, bottom: 10 } :
                  { top: 20, right: 30, left: 20, bottom: 10 }
                }
              >
                {isMobile ? (
                  <>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="rank"
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
                      dataKey="rank"
                      tickLine={true}
                      axisLine={false}
                      interval={0}
                      height={40}
                      tick={<CustomXAxisTick />}
                    />
                    <YAxis hide />
                  </>
                )}
                <RechartsTooltip 
                  content={<CustomTooltip />}
                  cursor={false}
                />
                <Bar
                  dataKey="percentage"
                  radius={isMobile ? [0, 8, 8, 0] : [8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease"
                >
                  <LabelList 
                    dataKey="percentage" 
                    position={isMobile ? "right" : "top"}
                    formatter={(value: number) => formatPercentage(value)}
                    style={{ fontSize: '12px' }} 
                  />
                  {chartData.map((entry: ChartDataPoint, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RankDistributionChart;
