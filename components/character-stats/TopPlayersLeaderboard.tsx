'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TopPlayer } from '@/app/state/types/CharacterPageTypes';
import Link from 'next/link';
import { Trophy, TrendingUp } from 'lucide-react';

interface TopPlayersLeaderboardProps {
  players: TopPlayer[];
  characterName: string;
}

export function TopPlayersLeaderboard({ players, characterName }: TopPlayersLeaderboardProps) {
  const getRegionColor = (region: string) => {
    const colors: Record<string, string> = {
      KOR: 'bg-red-500/10 text-red-500',
      JPN: 'bg-pink-500/10 text-pink-500',
      USA: 'bg-blue-500/10 text-blue-500',
      PAK: 'bg-green-500/10 text-green-500',
      FRA: 'bg-purple-500/10 text-purple-500',
      GBR: 'bg-orange-500/10 text-orange-500',
    };
    return colors[region] || 'bg-gray-500/10 text-gray-500';
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            Top 25 {characterName} Players
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            Global Ranking
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {players.map((player) => (
            <Link
              key={player.polarisId}
              href={`/player/${player.polarisId}`}
              className="block"
            >
              <div className="group relative flex items-center gap-4 p-4 rounded-lg border border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/60 hover:border-gray-600 transition-all duration-200 hover:scale-[1.01]">
                {/* Rank Badge */}
                <div className="flex-shrink-0 w-12 text-center">
                  {player.rank <= 3 ? (
                    <Trophy className={`h-6 w-6 mx-auto ${getMedalColor(player.rank)}`} />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">
                      #{player.rank}
                    </span>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                      {player.playerName}
                    </span>
                    <Badge className={`${getRegionColor(player.region)} text-xs`}>
                      {player.region}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="font-mono">{player.currentRank.replace(/_/g, ' ')}</span>
                    <span className="text-xs">•</span>
                    <span>{player.totalGames.toLocaleString()} games</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-shrink-0 text-right space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-lg font-bold text-green-500">
                      {player.winRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {player.tekkenPower.toLocaleString()} TP
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
