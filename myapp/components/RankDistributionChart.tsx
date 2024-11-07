import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { AnimatedCard } from '@/components/AnimatedCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';
import { 
  rankColorsAtom, 
  rankDistributionAtom,
  currentModeAtom,
  gameVersionsAtom,
  totalPlayersAtom,
  totalReplaysAtom
} from '@/atoms/tekkenStatsAtoms';
import type { DistributionMode, GameVersion } from '@/atoms/tekkenStatsAtoms';

export const RankDistributionChart: React.FC = () => {
  const [rankDistribution] = useAtom(rankDistributionAtom);
  const [rankColors] = useAtom(rankColorsAtom);
  const [gameVersions] = useAtom(gameVersionsAtom);
  const [totalPlayers] = useAtom(totalPlayersAtom);
  const [totalReplays] = useAtom(totalReplaysAtom);
  const [selectedVersion, setSelectedVersion] = useState<GameVersion>('10901');
  const [selectedMode, setSelectedMode] = useState<DistributionMode>('standard');

  // Get the latest version
  const latestVersion = [...gameVersions].sort((a, b) => parseInt(b) - parseInt(a))[0];

  // Set the initial version to latest on component mount
  useEffect(() => {
    if (latestVersion) {
      setSelectedVersion(latestVersion as GameVersion);
    }
  }, [latestVersion]);

  // Only proceed if we have data for the selected version
  const distributionData = rankDistribution[selectedVersion]?.[selectedMode] || [];

  const chartData = distributionData.map((rank) => {
    const colorEntry = rankColors.find((rc) => rc.rank === rank.rank);
    return {
      rank: rank.rank,
      percentage: Number(rank.percentage.toFixed(2)),
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
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="rank"
                  tickLine={true}
                  axisLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={117}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                />
                <Bar
                  dataKey="percentage"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationBegin={100}
                  animationDuration={1000}
                  animationEasing="ease"
                >
                  <LabelList 
                    dataKey="percentage" 
                    position="top" 
                    formatter={(value: number) => `${value.toFixed(2)}%`} 
                  />
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
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

export default RankDistributionChart;