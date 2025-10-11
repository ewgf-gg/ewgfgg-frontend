'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CharacterMatchup } from '@/app/state/types/CharacterPageTypes';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Shield, Swords } from 'lucide-react';

interface MatchupsChartProps {
  matchups: CharacterMatchup[];
  characterName: string;
}

export function MatchupsChart({ matchups, characterName }: MatchupsChartProps) {
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'Very Hard': 'bg-red-500/10 text-red-500 border-red-500/20',
      'Hard': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'Medium': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'Easy': 'bg-green-500/10 text-green-500 border-green-500/20',
    };
    return colors[difficulty] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 55) return 'text-green-500';
    if (winRate >= 50) return 'text-yellow-500';
    if (winRate >= 45) return 'text-orange-500';
    return 'text-red-500';
  };

  const sortedMatchups = [...matchups].sort((a, b) => b.winRate - a.winRate);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Swords className="h-6 w-6 text-primary" />
            Matchup Chart
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {matchups.length} Characters
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {sortedMatchups.map((matchup) => (
            <div
              key={matchup.opponentCharacter}
              className="group relative flex items-center gap-4 p-4 rounded-lg border border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/60 transition-all duration-200"
            >
              {/* Character Icon & Name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600/50 flex-shrink-0">
                  <Image
                    src={matchup.opponentIcon}
                    alt={matchup.opponentCharacter}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">
                    {matchup.opponentCharacter}
                  </div>
                  <div className="text-sm text-gray-400">
                    {matchup.totalGames.toLocaleString()} games
                  </div>
                </div>
              </div>

              {/* Win Rate Bar */}
                <div className="flex-1 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Win Rate</span>
                  <span className={`text-sm font-bold ${getWinRateColor(matchup.winRate)}`}>
                    {matchup.winRate.toFixed(1)}%
                  </span>
                </div>
                <div className="relative h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                      matchup.winRate >= 50
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${matchup.winRate}%` }}
                  />
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-foreground/20" />
                </div>
              </div>

              {/* Difficulty Badge */}
              <Badge
                className={`${getDifficultyColor(matchup.difficulty)} text-xs font-medium flex-shrink-0`}
              >
                {matchup.difficulty}
              </Badge>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Favorable (≥55%)</span>
            </div>
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-red-500" />
              <span>Challenging (&lt;45%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
