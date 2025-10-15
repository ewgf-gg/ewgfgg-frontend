'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ActivePlayer } from '@/app/state/types/ActivityPageTypes';
import { characterIconMap, rankIconMap, Regions } from '@/app/state/types/tekkenTypes';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivePlayersListProps {
  players: ActivePlayer[];
  isLoading?: boolean;
}

const PLAYERS_PER_PAGE = 50; // Only render 50 players at a time

export const ActivePlayersList: React.FC<ActivePlayersListProps> = ({ players, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(players.length / PLAYERS_PER_PAGE);
  const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
  const endIndex = startIndex + PLAYERS_PER_PAGE;
  const currentPlayers = players.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to show (with ellipsis)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

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
            Showing {startIndex + 1}-{Math.min(endIndex, players.length)} of {players.length} player{players.length !== 1 ? 's' : ''}
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
                {currentPlayers.map((player, index) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) => (
                  <React.Fragment key={idx}>
                    {page === '...' ? (
                      <span className="px-2 text-gray-500">...</span>
                    ) : (
                      <Button
                        onClick={() => goToPage(page as number)}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={
                          currentPage === page
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                        }
                      >
                        {page}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
