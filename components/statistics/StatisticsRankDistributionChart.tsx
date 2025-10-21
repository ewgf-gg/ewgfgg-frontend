'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';
import useWindowSize, { isMobileView } from '../../lib/hooks/useWindowSize';
import { rankIconMap, rankOrderMap, rankColorsAtom } from '../../app/state/types/tekkenTypes';
import Image from 'next/image';
import type { StatisticsRankDistribution } from '@/app/state/types/StatisticsPageTypes';
import { formatVersion } from '@/lib/statistics-utils';

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
    payload: ChartDataPoint;
  }>;
  label?: string;
}

interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
  isMobile: boolean;
}

interface StatisticsRankDistributionChartProps {
  rankDistribution: StatisticsRankDistribution[];
  selectedVersion: number;
  selectedRegion: string;
}

const CustomXAxisTick: React.FC<CustomXAxisTickProps> = ({ x = 0, y = 0, payload, isMobile }) => (
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

export const StatisticsRankDistributionChart: React.FC<StatisticsRankDistributionChartProps> = ({ 
  rankDistribution,
  selectedVersion,
  selectedRegion
}) => {
  const { width } = useWindowSize();
  const isMobile = isMobileView(width);

  // Process rank distribution data - filter by version and region
  const chartData: ChartDataPoint[] = useMemo(() => {
    // Filter by selected version and region, then aggregate by rank
    const rankTotals: { [rank: string]: number } = {};
    
    rankDistribution
      .filter(item => {
        const matchesVersion = item.gameVersion === selectedVersion;
        const matchesRegion = selectedRegion === 'global' || item.region.toLowerCase() === selectedRegion.toLowerCase();
        return matchesVersion && matchesRegion;
      })
      .forEach(item => {
        if (!rankTotals[item.danRank]) {
          rankTotals[item.danRank] = 0;
        }
        rankTotals[item.danRank] += item.playerCount;
      });

    // Calculate total players
    const totalPlayers = Object.values(rankTotals).reduce((sum, count) => sum + count, 0);

    if (totalPlayers === 0) {
      return [];
    }

    // Create a map of unique rank names to their lowest rank order (to maintain proper ordering)
    const uniqueRanks = new Map<string, number>();
    Object.entries(rankOrderMap).forEach(([rankOrder, rankName]) => {
      const order = parseInt(rankOrder);
      if (!uniqueRanks.has(rankName) || uniqueRanks.get(rankName)! > order) {
        uniqueRanks.set(rankName, order);
      }
    });

    // Create ordered data based on unique rank names
    const orderedData = Array.from(uniqueRanks.entries())
      .map(([rankName, rankOrder]) => {
        // Look for the rank in rankTotals - the API data uses the exact rank name
        const playerCount = rankTotals[rankName] || 0;
        const percentage = (playerCount / totalPlayers) * 100;
        
        return {
          rankOrder,
          rank: rankName,
          playerCount,
          percentage
        };
      })
      .filter(item => item.playerCount > 0)
      .sort((a, b) => a.rankOrder - b.rankOrder);

    // Calculate cumulative percentages
    let cumulative = 0;
    const result: ChartDataPoint[] = orderedData.map((item) => {
      cumulative += item.percentage;
      const colorEntry = rankColorsAtom.find((rc) => rc.id === item.rank);
      
      return {
        rank: item.rank,
        percentage: item.percentage,
        cumulativePercentage: cumulative,
        fill: colorEntry?.color || '#3182ce',
        playerCount: item.playerCount,
      };
    });

    return result;
  }, [rankDistribution, selectedVersion, selectedRegion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <div>
            <CardTitle className="text-2xl font-bold">Rank Distribution</CardTitle>
            <CardDescription>
              Distribution of players across all ranks for {formatVersion(selectedVersion)} • {selectedRegion === 'global' ? 'All Regions' : selectedRegion} • Mains + Non-Mains
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!chartData.length ? (
            <div className="flex justify-center items-center h-[400px]">
              <p className="text-gray-500">No rank distribution data available for this version</p>
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
                      tick={<CustomXAxisTick isMobile={isMobile} />}
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
                      tick={<CustomXAxisTick isMobile={isMobile} />}
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

export default StatisticsRankDistributionChart;
