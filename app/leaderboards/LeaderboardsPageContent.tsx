"use client";

import React, { useState, useCallback } from 'react';
import { SimpleChartCard } from '@/components/shared/SimpleChartCard';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { characterIconMap, characterIdMap, rankIconMap, rankOrderMap, LeaderboardData } from '@/app/state/types/tekkenTypes';
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

interface LeaderboardsPageContentProps {
  leaderboardData: LeaderboardData;
}

export default function LeaderboardsPageContent({ leaderboardData }: LeaderboardsPageContentProps) {
  const [activeTab, setActiveTab] = useState("rank-points");
  const router = useRouter();

  const navigateToPlayer = useCallback((polarisId: string) => {
    router.push(`/player/${encodeURIComponent(polarisId)}`);
  }, [router]);

  return (
    <>
      <main className="flex-grow container mx-auto px-4 pt-12 sm:pt-8">
        <h1 className="text-4xl font-bold mb-8 text-center sm:text-left">Leaderboards</h1>
        
        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-md p-4 mb-6 text-yellow-200 text-sm">
          <p>This leaderboard aims to filter cheaters. If you spot a suspected cheater, please join the discord and submit a report.</p>
        </div>
        
        <div className="w-full mb-8">
          <div className="grid w-full max-w-md mx-auto mb-8 grid-cols-2 h-10 items-center justify-center rounded-md bg-gray-800/50 p-1 text-gray-400">
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
          
          {activeTab === "rank-points" && (
            <SimpleChartCard 
              title="Top Players by Rank Points" 
              description="Players with the highest rank points in the game."
              height="700px"
            >
              <div className="overflow-x-auto h-full">
                <table className="w-full border-collapse table-auto">
                  <thead>
                    <tr className="bg-gray-800/80 border-b border-gray-700">
                      <th className="py-4 px-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-400">Rank</th>
                      <th className="py-4 px-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-400">Player</th>
                      <th className="py-4 px-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-400">Rank</th>
                      <th className="py-4 px-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-400">Platform</th>
                      <th className="py-4 px-4 text-right text-xs uppercase tracking-wider font-semibold text-gray-400">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.rankPointsLeaderboard.map((player) => {
                      const characterName = characterIdMap[parseInt(player.charaId)] || 'Unknown';
                      const rankName = rankOrderMap[player.rank] || 'Unknown';
                      const platform = platformMap[player.platform] || 'Unknown';
                      
                      return (
                        <motion.tr 
                          key={player.polarisId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: player.ranking * 0.05 }}
                          className={`border-b border-gray-700 transition-colors duration-150 ease-in-out ${player.ranking % 2 === 0 ? 'bg-gray-800/20' : ''} hover:bg-gray-700/40 cursor-pointer`}
                          onClick={() => navigateToPlayer(player.polarisId)}
                        >
                          <td className="py-4 px-4 font-mono">
                            <span className={`font-bold ${player.ranking <= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                              #{player.ranking}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 flex-shrink-0">
                                <Image 
                                  src={characterIconMap[characterName] || '/static/character-icons/AlisaT8.webp'} 
                                  alt={characterName}
                                  fill
                                  className="object-cover rounded-full shadow-md"
                                />
                              </div>
                              <span className="font-semibold">{player.playerName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 h-14 flex-shrink-0">
                                <Image 
                                  src={rankIconMap[rankName] || '/static/rank-icons/BeginnerT8.webp'} 
                                  alt={rankName}
                                  fill
                                  className="object-contain shadow-md"
                                />
                              </div>
                              <span className="font-medium">{rankName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center text-xl">
                              {platformIcons[platform as Platform] || <FaSteam className="text-gray-300" />}
                              <span className="ml-2 text-sm font-medium">{platform}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-blue-400">
                            {player.score.toLocaleString()}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SimpleChartCard>
          )}
          
          {activeTab === "tekken-prowess" && (
            <SimpleChartCard 
              title="Top Players by Tekken Prowess" 
              description="Players with the highest Tekken Prowess scores."
              height="700px"
            >
              <div className="overflow-x-auto h-full">
                <table className="w-full border-collapse table-auto">
                  <thead>
                    <tr className="bg-gray-800/80 border-b border-gray-700">
                      <th className="py-4 px-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-400">Rank</th>
                      <th className="py-4 px-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-400">Player</th>
                      <th className="py-4 px-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-400">Rank</th>
                      <th className="py-4 px-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-400">Platform</th>
                      <th className="py-4 px-4 text-right text-xs uppercase tracking-wider font-semibold text-gray-400">Prowess</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.tekkenProwessLeaderboard.map((player) => {
                      const characterName = characterIdMap[parseInt(player.charaId)] || 'Unknown';
                      const rankName = rankOrderMap[player.rank] || 'Unknown';
                      const platform = platformMap[player.platform] || 'Unknown';
                      
                      return (
                        <motion.tr 
                          key={player.polarisId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: player.ranking * 0.05 }}
                          className={`border-b border-gray-700 transition-colors duration-150 ease-in-out ${player.ranking % 2 === 0 ? 'bg-gray-800/20' : ''} hover:bg-gray-700/40 cursor-pointer`}
                          onClick={() => navigateToPlayer(player.polarisId)}
                        >
                          <td className="py-4 px-4 font-mono">
                            <span className={`font-bold ${player.ranking <= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                              #{player.ranking}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 flex-shrink-0">
                                <Image 
                                  src={characterIconMap[characterName] || '/static/character-icons/AlisaT8.webp'} 
                                  alt={characterName}
                                  fill
                                  className="object-cover rounded-full shadow-md"
                                />
                              </div>
                              <span className="font-semibold">{player.playerName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 h-14 flex-shrink-0">
                                <Image 
                                  src={rankIconMap[rankName] || '/static/rank-icons/BeginnerT8.webp'} 
                                  alt={rankName}
                                  fill
                                  className="object-contain shadow-md"
                                />
                              </div>
                              <span className="font-medium">{rankName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center text-xl">
                              {platformIcons[platform as Platform] || <FaSteam className="text-gray-300" />}
                              <span className="ml-2 text-sm font-medium">{platform}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-purple-400">
                            {player.score.toLocaleString()}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SimpleChartCard>
          )}
        </div>
      </main>
    </>
  );
}
