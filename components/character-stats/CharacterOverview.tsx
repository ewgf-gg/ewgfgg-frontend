'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CharacterOverallStats } from '@/app/state/types/CharacterPageTypes';
import { Users, Award, Activity } from 'lucide-react';
import Image from 'next/image';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { rankIconMap, rankEnumToLabel } from '@/app/state/types/tekkenTypes';

interface CharacterOverviewProps {
  characterName: string;
  characterIcon: string;
  stats: CharacterOverallStats;
}

export function CharacterOverview({ characterName, characterIcon, stats }: CharacterOverviewProps) {
  // Use the percentage from the API if available, otherwise calculate it
  const mainedByPercentage = stats.mainedByPercent 
    ? stats.mainedByPercent.toFixed(1) 
    : ((stats.mainedBy / stats.totalPlayers) * 100).toFixed(1);

  // Convert character name to circular icon path format
  const circularIconPath = `/static/circular_character_icons/${characterName.toLowerCase().replace(/\s+/g, '_')}.webp`;

  // Radial chart configs
  const winRateConfig = {
    winRate: {
      label: 'Win Rate',
      color: 'hsl(270, 70%, 65%)',
    },
  } satisfies ChartConfig;

  const pickRateConfig = {
    pickRate: {
      label: 'Pick Rate',
      color: 'hsl(217, 91%, 60%)',
    },
  } satisfies ChartConfig;

  const mainedByConfig = {
    mainedBy: {
      label: 'Mained By',
      color: 'hsl(25, 95%, 53%)',
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="flex justify-center">
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 w-full max-w-3xl">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          <CardContent className="relative p-6">
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <Image
                    src={circularIconPath}
                    alt={characterName}
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-4xl font-bold text-white">
                    {characterName}
                  </h1>
                  <p className="text-xs text-gray-400 text-right">Based on players active<br />within the last 30 days</p>
                </div>
                
                {/* Stats Row */}
                <div className="flex items-end gap-6">
                <div>
                  <p className="text-sm text-gray-400">Ranked Matches</p>
                  <p className="text-xl font-bold text-white">{stats.totalMatches.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Total Players</p>
                  <p className="text-xl font-bold text-white">{stats.totalPlayers.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Win Rate */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Win Rate</h3>
              <p className="text-sm text-gray-400">Overall performance</p>
            </div>
            <ChartContainer config={winRateConfig} className="mx-auto aspect-square w-full max-w-[250px]">
              <RadialBarChart
                data={[
                  { stat: 'background', value: 100, fill: '#374151' },
                  { stat: 'winRate', value: stats.winRate, fill: 'var(--color-winRate)' }
                ]}
                startAngle={90}
                endAngle={450}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} className="fill-white text-3xl font-bold">
                              {stats.winRate.toFixed(1)}%
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-gray-400 text-sm">
                              Win Rate
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar dataKey="value" cornerRadius={10} background />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pick Rate */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Pick Rate</h3>
              <p className="text-sm text-gray-400">Character popularity</p>
            </div>
            <ChartContainer config={pickRateConfig} className="mx-auto aspect-square w-full max-w-[250px]">
              <RadialBarChart
                data={[
                  { stat: 'background', value: 100, fill: '#374151' },
                  { stat: 'pickRate', value: stats.pickRate, fill: 'var(--color-pickRate)' }
                ]}
                startAngle={90}
                endAngle={450}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} className="fill-white text-3xl font-bold">
                              {stats.pickRate.toFixed(1)}%
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-gray-400 text-sm">
                              Pick Rate
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar dataKey="value" cornerRadius={10} background />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Mained By */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Mained By</h3>
              <p className="text-sm text-gray-400">% of players who main {characterName}</p>
            </div>
            <ChartContainer config={mainedByConfig} className="mx-auto aspect-square w-full max-w-[250px]">
              <RadialBarChart
                data={[
                  { stat: 'background', value: 100, fill: '#374151' },
                  { stat: 'mainedBy', value: parseFloat(mainedByPercentage), fill: 'var(--color-mainedBy)' }
                ]}
                startAngle={90}
                endAngle={450}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} className="fill-white text-3xl font-bold">
                              {mainedByPercentage}%
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-gray-400 text-sm">
                              Mained By
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar dataKey="value" cornerRadius={10} background />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Median Rank */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Median Rank</h3>
              <p className="text-sm text-gray-400">Midpoint rank of all {characterName} mains</p>
            </div>
            <div className="flex flex-col items-center justify-center h-[250px]">
              <div className="relative w-40 h-32 mb-4">
                <Image
                  src={rankIconMap[rankEnumToLabel[stats.averageRank]] || '/static/rank-icons/BeginnerT8.webp'}
                  alt={stats.averageRank}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-2xl font-bold text-white text-center">
                {rankEnumToLabel[stats.averageRank]}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
