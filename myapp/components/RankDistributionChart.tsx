import { useState } from 'react';
import { useAtom } from 'jotai';
import { AnimatedCard } from '@/components/AnimatedCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';
import { rankColorsAtom, rankDistributionAtom, DistributionMode, GameVersion } from '@/atoms/tekkenStatsAtoms';

export const RankDistributionChart: React.FC = () => {
  const [rankDistribution] = useAtom(rankDistributionAtom);
  const [rankColors] = useAtom(rankColorsAtom);
  const [selectedVersion, setSelectedVersion] = useState<GameVersion>('10801');
  const [distributionMode, setDistributionMode] = useState<DistributionMode>('overall');

  const gameVersions: Record<GameVersion, string> = {
    '10801': 'Tekken 8',
    '10701': 'Tekken 7',
  };

  const chartData = rankDistribution[selectedVersion][distributionMode].map((rank) => {
    const colorEntry = rankColors.find((rc) => rc.rank === rank.rank);
    return {
      rank: rank.rank,
      percentage: rank.percentage,
      fill: colorEntry?.color || '#3182ce',
    };
  });

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
              <Select 
                value={selectedVersion} 
                onValueChange={(value: GameVersion) => setSelectedVersion(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select game version" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(gameVersions) as [GameVersion, string][]).map(([version, name]) => (
                    <SelectItem key={version} value={version}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={distributionMode} 
                onValueChange={(value: DistributionMode) => setDistributionMode(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select distribution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </AnimatedCard>
  );
};