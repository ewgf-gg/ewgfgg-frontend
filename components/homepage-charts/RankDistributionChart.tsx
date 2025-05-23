'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';
import { 
  rankColorsAtom, 
  rankDistributionAtom,
  gameVersionsAtom
} from '../../app/state/atoms/tekkenStatsAtoms';
import React from 'react';
import useWindowSize, { isMobileView } from '../../lib/hooks/useWindowSize';
import { DistributionMode, GameVersion, rankIconMap, rankOrderMap, RankDistribution } from '../../app/state/types/tekkenTypes';
import Image from 'next/image';

interface ChartDataPoint {
  rank: string;
  percentage: number;
  topPercentage: number;
  fill: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      rank: string;
      percentage: number;
      topPercentage: number;
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
  const [rankDistribution] = useAtom(rankDistributionAtom);
  const [rankColors] = useAtom(rankColorsAtom);
  const [gameVersions] = useAtom(gameVersionsAtom);
  const { width } = useWindowSize();
  const isMobile = isMobileView(width);
  
  // Get the latest version immediately
  const latestVersion = [...gameVersions].sort((a, b) => parseInt(b) - parseInt(a))[0];
  const [selectedVersion, setSelectedVersion] = useState<GameVersion>(latestVersion);
  const [selectedMode, setSelectedMode] = useState<DistributionMode>('standard');

  // Update selected version when latest version changes
  useEffect(() => {
    if (latestVersion) {
      setSelectedVersion(latestVersion);
    }
  }, [latestVersion]);

  const distributionData = rankDistribution[selectedVersion]?.[selectedMode] || [];

  const calculateTopPercentage = (currentRank: string) => {
    // eslint-disable-next-line
    const rankOrder = Object.entries(rankOrderMap).find(([_, rank]) => rank === currentRank)?.[0];
    if (!rankOrder) return 0;

    const currentRankIndex = parseInt(rankOrder);
    return distributionData
      .filter((data: RankDistribution) => {
        // eslint-disable-next-line
        const dataRankOrder = Object.entries(rankOrderMap).find(([_, rank]) => rank === data.rank)?.[0];
        return dataRankOrder && parseInt(dataRankOrder) >= currentRankIndex;
      })
      .reduce((sum: number, data: RankDistribution) => sum + data.percentage, 0);
  };

  const chartData = distributionData.map((rank: RankDistribution): ChartDataPoint => {
    const colorEntry = rankColors.find((rc) => rc.id === rank.rank);
    const topPercentage = calculateTopPercentage(rank.rank);
    return {
      rank: rank.rank,
      percentage: rank.percentage,
      topPercentage: topPercentage,
      fill: colorEntry?.color || '#3182ce',
    };
  });

  const formatVersion = (version: string) => {
    const major = Math.floor(parseInt(version) / 10000);
    const minor = Math.floor((parseInt(version) % 10000) / 100);
    const patch = parseInt(version) % 100;
    return `Version ${major}.${minor}.${patch}`;
  };

  const getVersionLabel = (version: string) => {
    const formattedVersion = formatVersion(version);
    return version === latestVersion ? `${formattedVersion} (Latest)` : formattedVersion;
  };

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
      const { percentage, topPercentage } = payload[0].payload;
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
          <div className="text-sm">{`Top ${formatPercentage(topPercentage)} of players`}</div>
          <div className="text-sm">{`${formatPercentage(percentage)} of the playerbase is here`}</div>
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
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Rank Distribution</CardTitle>
              <CardDescription>Showing rank distribution among players</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Select value={selectedVersion} onValueChange={(v) => setSelectedVersion(v)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select game version" />
                </SelectTrigger>
                <SelectContent>
                  {[...gameVersions]
                    .sort((b, a) => parseInt(a) - parseInt(b))
                    .map((version) => (
                      <SelectItem key={version} value={version}>
                        {getVersionLabel(version)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select value={selectedMode} onValueChange={(v) => setSelectedMode(v as DistributionMode)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall</SelectItem>
                  <SelectItem value="standard">Mains Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger className="text-xs text-muted-foreground underline cursor-help">
                  What is the difference between &apos;Overall&apos; and &apos;Mains Only&apos;?
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-background border text-foreground p-2">
                  <p>
                    <strong>Mains Only:</strong> Uses each player&apos;s highest-ranked character; side picks are ignored.
                  </p>
                  <p className="mt-1">
                    <strong>Overall:</strong> Includes every character played by a player.
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          {!distributionData.length ? (
            <div className="flex justify-center items-center h-[400px]">
              <p className="text-gray-500">No data available for this version</p>
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
                      tickLine={isMobile ? false : true}
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
