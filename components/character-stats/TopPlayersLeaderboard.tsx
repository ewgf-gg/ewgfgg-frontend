'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TopPlayer } from '@/app/state/types/CharacterPageTypes';
import { LeaderboardData, characterIdMap, rankOrderMap } from '@/app/state/types/tekkenTypes';
import Link from 'next/link';
import { Trophy, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { characterIconMap, rankIconMap } from '@/app/state/types/tekkenTypes';
import { FaSteam, FaXbox, FaPlaystation } from 'react-icons/fa';

type Platform = 'Steam' | 'XBOX' | 'PlayStation';

const platformIcons: Record<Platform, JSX.Element> = {
  'Steam': <FaSteam className="text-gray-300" />,
  'XBOX': <FaXbox className="text-green-500" />,
  'PlayStation': <FaPlaystation className="text-blue-500" />
};

const platformMap: Record<number, Platform> = {
  3: 'Steam',
  8: 'PlayStation',
  9: 'XBOX'
};

interface TopPlayersLeaderboardProps {
  players: TopPlayer[];
  characterName: string;
  leaderboardData: LeaderboardData | null;
}

export function TopPlayersLeaderboard({ players, characterName, leaderboardData }: TopPlayersLeaderboardProps) {
  const [activeTab, setActiveTab] = useState("rank-points");
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

  // If no leaderboard data, show fallback message
  if (!leaderboardData) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              Top {characterName} Players
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              Global Ranking
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <p>Leaderboard data is currently unavailable. This could be because Tekken's servers are down for maintenence / updates. </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              Top {characterName} Players
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              Global Ranking
            </Badge>
          </div>
          
          {/* Toggle Buttons */}
          <div className="grid w-full grid-cols-2 h-10 items-center justify-center rounded-md bg-gray-800/50 p-1 text-gray-400">
            <button 
              onClick={() => setActiveTab("rank-points")} 
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${activeTab === "rank-points" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-300"}`}
            >
              Rank Points
            </button>
            <button 
              onClick={() => setActiveTab("tekken-prowess")} 
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${activeTab === "tekken-prowess" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-300"}`}
            >
              Tekken Prowess
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto max-h-[600px] pr-2">
          {activeTab === "rank-points" && (
            <div className="space-y-2">
              {leaderboardData.rankPointsLeaderboard.slice(0, 25).map((player) => {
                const characterName = characterIdMap[parseInt(player.charaId)] || 'Unknown';
                const rankName = rankOrderMap[player.rank] || 'Unknown';
                const platform = platformMap[player.platform] || 'Unknown';
                
                return (
                  <Link
                    key={player.polarisId}
                    href={`/player/${player.polarisId}`}
                    className="block"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: player.ranking * 0.02 }}
                      className="group relative flex items-center gap-3 p-3 rounded-lg border border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/60 hover:border-gray-600 transition-all duration-200"
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-8 text-center">
                        <span className={`font-bold text-sm ${player.ranking <= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                          #{player.ranking}
                        </span>
                      </div>

                      {/* Character Icon */}
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image 
                          src={characterIconMap[characterName] || '/static/character-icons/AlisaT8.webp'} 
                          alt={characterName}
                          fill
                          className="object-cover rounded-full shadow-md"
                        />
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-white truncate group-hover:text-blue-400 transition-colors">
                          {player.playerName}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {platformIcons[platform as Platform]}
                          <span>{rankName}</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-sm font-bold text-blue-400">
                          {player.score.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}

          {activeTab === "tekken-prowess" && (
            <div className="space-y-2">
              {leaderboardData.tekkenProwessLeaderboard.slice(0, 25).map((player) => {
                const characterName = characterIdMap[parseInt(player.charaId)] || 'Unknown';
                const rankName = rankOrderMap[player.rank] || 'Unknown';
                const platform = platformMap[player.platform] || 'Unknown';
                
                return (
                  <Link
                    key={player.polarisId}
                    href={`/player/${player.polarisId}`}
                    className="block"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: player.ranking * 0.02 }}
                      className="group relative flex items-center gap-3 p-3 rounded-lg border border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/60 hover:border-gray-600 transition-all duration-200"
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-8 text-center">
                        <span className={`font-bold text-sm ${player.ranking <= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                          #{player.ranking}
                        </span>
                      </div>

                      {/* Character Icon */}
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image 
                          src={characterIconMap[characterName] || '/static/character-icons/AlisaT8.webp'} 
                          alt={characterName}
                          fill
                          className="object-cover rounded-full shadow-md"
                        />
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-white truncate group-hover:text-blue-400 transition-colors">
                          {player.playerName}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {platformIcons[platform as Platform]}
                          <span>{rankName}</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-sm font-bold text-purple-400">
                          {player.score.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">prowess</div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
