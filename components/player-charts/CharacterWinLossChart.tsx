import React, { useMemo } from 'react';
import { PieChart, Pie, ResponsiveContainer, Label } from 'recharts';
import { CharacterStatsWithVersion } from '../../app/state/types/tekkenTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

interface CharacterWinLossChartProps {
  characterStats: CharacterStatsWithVersion[];
}

const CharacterWinLossChart: React.FC<CharacterWinLossChartProps> = ({ characterStats }) => {
  // Calculate total wins and losses
  const stats = useMemo(() => {
    const totalWins = characterStats.reduce((sum, stat) => sum + stat.wins, 0);
    const totalLosses = characterStats.reduce((sum, stat) => sum + stat.losses, 0);
    const winRate = totalWins + totalLosses > 0 
      ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
      : '0.0';

    return {
      data: [
        { name: 'Wins', value: totalWins, fill: '#4ade80' },  // Green color
        { name: 'Losses', value: totalLosses, fill: '#f87171' }  // Red color
      ],
      winRate
    };
  }, [characterStats]);

  const chartConfig = {
    wins: {
      label: 'Wins',
      color: '#4ade80'
    },
    losses: {
      label: 'Losses',
      color: '#f87171'
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Character Winrate</CardTitle>
        <CardDescription>Your overall winrate</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Pie
              data={stats.data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {stats.winRate}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Win Rate
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CharacterWinLossChart;
