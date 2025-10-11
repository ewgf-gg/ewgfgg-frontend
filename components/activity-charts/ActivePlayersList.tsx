'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActivePlayer } from '@/app/state/types/ActivityPageTypes';
import { characterIconMap, rankIconMap, Regions } from '@/app/state/types/tekkenTypes';
import { formatDistanceToNow } from 'date-fns';

interface ActivePlayersListProps {
  players: ActivePlayer[];
  isLoading?: boolean;
}

export const ActivePlayersList: React.FC<ActivePlayersListProps> = ({ players, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Active Players</CardTitle>
            <CardDescription className="text-gray-400">Loading active players...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (players.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Active Players</CardTitle>
            <CardDescription className="text-gray-400">No active players found with the selected filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400">No players found</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Active Players</CardTitle>
          <CardDescription className="text-gray-400">
            Showing {players.length} player{players.length !== 1 ? 's' : ''} currently active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50">
                  <TableHead className="text-gray-300">Player</TableHead>
                  <TableHead className="text-gray-300">Main Character</TableHead>
                  <TableHead className="text-gray-300 text-center">Rank</TableHead>
                  <TableHead className="text-gray-300">Region</TableHead>
                  <TableHead className="text-gray-300">Tekken Power</TableHead>
                  <TableHead className="text-gray-300">Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player, index) => (
                  <TableRow key={`${player.polarisId}-${index}`} className="border-gray-700 hover:bg-gray-700/30">
                    <TableCell>
                      <Link 
                        href={`/player/${player.polarisId}`}
                        className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {player.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {characterIconMap[player.mainCharacter] && (
                          <Image
                            src={characterIconMap[player.mainCharacter]}
                            alt={player.mainCharacter}
                            width={32}
                            height={32}
                            className="w-8 h-8"
                            unoptimized
                          />
                        )}
                        <span className="text-gray-200">{player.mainCharacter}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center">
                        {rankIconMap[player.rank] && (
                          <Image
                            src={rankIconMap[player.rank]}
                            alt={player.rank}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain"
                            title={player.rank}
                            unoptimized
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {Regions[player.regionId] || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {player.tekkenPower.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {formatDistanceToNow(player.lastSeen * 1000, { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
