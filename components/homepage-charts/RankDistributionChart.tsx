// app/components/RankDistributionChart.tsx
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { AnimatedCard } from '../AnimatedCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';
import { 
  rankColorsAtom, 
  rankDistributionAtom,
  gameVersionsAtom,
  totalPlayersAtom,
  totalReplaysAtom
} from '../../app/state/atoms/tekkenStatsAtoms';

import { DistributionMode, GameVersion, rankIconMap, rankOrderMap } from '../../app/state/types/tekkenTypes';

export const RankDistributionChart: React.FC = () => {
  const [rankDistribution] = useAtom(rankDistributionAtom);
  const [rankColors] = useAtom(rankColorsAtom);
  const [gameVersions] = useAtom(gameVersionsAtom);
  const [totalPlayers] = useAtom(totalPlayersAtom);
  const [totalReplays] = useAtom(totalReplaysAtom);
  const [selectedVersion, setSelectedVersion] = useState<GameVersion>('10901');
  const [selectedMode, setSelectedMode] = useState<DistributionMode>('standard');
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Get the latest version
  const latestVersion = [...gameVersions].sort((a, b) => parseInt(b) - parseInt(a))[0];

  // Set the initial version to latest on component mount
  useEffect(() => {
    if (latestVersion) {
      setSelectedVersion(latestVersion as GameVersion);
    }
  }, [latestVersion]);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
    }
  }, []);

  // Only proceed if we have data for the selected version
  const distributionData = rankDistribution[selectedVersion]?.[selectedMode] || [];

  // Calculate top percentage for each rank
  const calculateTopPercentage = (currentRank: string) => {
    const rankOrder = Object.entries(rankOrderMap).find(([_, rank]) => rank === currentRank)?.[0];
    if (!rankOrder) return 0;

    const currentRankIndex = parseInt(rankOrder);
    return distributionData
      .filter(data => {
        const dataRankOrder = Object.entries(rankOrderMap).find(([_, rank]) => rank === data.rank)?.[0];
        return dataRankOrder && parseInt(dataRankOrder) >= currentRankIndex;
      })
      .reduce((sum, data) => sum + data.percentage, 0);
  };

  const chartData = distributionData.map((rank) => {
    const colorEntry = rankColors.find((rc) => rc.rank === rank.rank);
    const topPercentage = calculateTopPercentage(rank.rank);
    return {
      rank: rank.rank,
      percentage: Number(rank.percentage.toFixed(2)),
      topPercentage: Number(topPercentage.toFixed(2)),
      fill: colorEntry?.color || '#3182ce',
    };
  });

  const getVersionLabel = (version: string) => {
    // If this is the latest version, append "(Latest)"
    if (version === latestVersion) {
      return `Ver. ${version} (Latest)`;
    }
    return `Ver. ${version}`;
  };

  const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject 
          x="-20" 
          y="0" 
          width="40" 
          height="40" 
          transform="rotate(-45 0 20)"
          style={{ overflow: 'visible' }}
        >
          <div className="flex items-center justify-center">
            <img
              src={rankIconMap[payload.value]}
              alt={payload.value}
              className="w-30 h-8"
              style={{ 
                transformOrigin: 'center'
              }}
            />
          </div>
        </foreignObject>
      </g>
    );
  };
  
  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { percentage, topPercentage } = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <div className="flex items-center gap-2">
            <img
              src={rankIconMap[label]}
              alt={label}
              className="w-20 h-10"
            />
            <span className="font-medium">{label}</span>
          </div>
          <div className="text-sm">{`${percentage.toFixed(2)}% of the playerbase is here`}</div>
          <div className="text-sm">{`Top ${topPercentage.toFixed(2)}% of playerbase`}</div>
        </div>
      );
    }
    return null;
  };

  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <AnimatedCard delay={1}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Rank Distribution</CardTitle>
              <CardDescription>Showing rank distribution among players</CardDescription>
            </div>
            <div className="flex gap-4">
              <Select value={selectedVersion} onValueChange={(v) => setSelectedVersion(v as GameVersion)}>
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall</SelectItem>
                  <SelectItem value="standard">Mains Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!distributionData.length ? (
            <div className="flex justify-center items-center h-[400px]">
              <p className="text-gray-500">No data available for this version</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                onMouseLeave={handleMouseLeave}
              >
                <XAxis
                  dataKey="rank"
                  tickLine={true}
                  axisLine={false}
                  interval={0}
                  height={40}
                  tick={<CustomXAxisTick />}
                />
                <YAxis hide />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={false}
                />
                <Bar
                  dataKey="percentage"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={false}
                  animationBegin={isInitialRender ? 2000 : 100}
                  animationDuration={1000}
                  animationEasing="ease"
                  onMouseEnter={handleMouseEnter}
                >
                  <LabelList 
                    dataKey="percentage" 
                    position="top" 
                    formatter={(value: number) => `${value.toFixed(2)}%`} 
                  />
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      style={{
                        filter: activeIndex === index ? `drop-shadow(0 0 6px ${entry.fill})` : 'none',
                        transition: 'filter 0.2s ease-in-out'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
          <div className="flex gap-8">
            <div>
              <span className="font-medium">Total Players:</span>{' '}
              {totalPlayers.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Total Replays Analyzed:</span>{' '}
              {totalReplays.toLocaleString()}
            </div>
          </div>
        </CardFooter>
      </Card>
    </AnimatedCard>
  );
};
