import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Battle, characterIdMap, characterIconMap } from '../../app/state/types/tekkenTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface RecentBattlesCardProps {
  battles: Battle[];
  playerName: string;
  polarisId: string;
  selectedVersion: string;
}

export const RecentBattlesCard: React.FC<RecentBattlesCardProps> = ({
  battles,
  // eslint-disable-next-line
  playerName,
  polarisId,
  selectedVersion,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [battlesPerPage, setBattlesPerPage] = useState(25);

  // Filter battles based on version
  const filteredBattles = selectedVersion === 'all' 
    ? battles 
    : battles.filter(battle => battle.gameVersion.toString() === selectedVersion);

  const totalPages = Math.ceil(filteredBattles.length / battlesPerPage);
  const indexOfLastBattle = currentPage * battlesPerPage;
  const indexOfFirstBattle = indexOfLastBattle - battlesPerPage;
  const currentBattles = filteredBattles.slice(indexOfFirstBattle, indexOfLastBattle);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value);
    setBattlesPerPage(newSize);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCharacterName = (characterId: number) => {
    return characterIdMap[characterId] || `Character ${characterId}`;
  };

  const renderCharacterWithIcon = (characterName: string) => (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <Image
          src={characterIconMap[characterName]}
          alt={characterName}
          fill
          sizes="32px"
          className="object-contain"
        />
      </div>
      <span>{characterName}</span>
    </div>
  );

  const renderPaginationControls = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          onClick={() => handlePageChange(1)}
          className="h-8 w-8"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="dots1" className="px-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          onClick={() => handlePageChange(i)}
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="dots2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          onClick={() => handlePageChange(totalPages)}
          className="h-8 w-8"
        >
          {totalPages}
        </Button>
      );
    }

    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return buttons;
  };

  if (filteredBattles.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Battles</CardTitle>
        <Select
          value={battlesPerPage.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Player Character</TableHead>
              <TableHead>Opponent</TableHead>
              <TableHead>Opponent Character</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBattles.map((battle, index) => {
              const isPlayer1 = battle.player1PolarisId === polarisId;
              const playerCharacter = getCharacterName(isPlayer1 ? battle.player1CharacterId : battle.player2CharacterId);
              const opponentCharacter = getCharacterName(isPlayer1 ? battle.player2CharacterId : battle.player1CharacterId);
              const opponentName = isPlayer1 ? battle.player2Name : battle.player1Name;
              const opponentPolarisId = isPlayer1 ? battle.player2PolarisId : battle.player1PolarisId;
              const isWinner = (isPlayer1 && battle.winner === 1) || (!isPlayer1 && battle.winner === 2);

              return (
                <TableRow key={index}>
                  <TableCell>{formatDate(battle.date)}</TableCell>
                  <TableCell>{renderCharacterWithIcon(playerCharacter)}</TableCell>
                  <TableCell>
                    <Link 
                      href={`/player/${opponentPolarisId}`}
                      className="text-blue-500 hover:text-blue-700 hover:underline"
                    >
                      {opponentName}
                    </Link>
                  </TableCell>
                  <TableCell>{renderCharacterWithIcon(opponentCharacter)}</TableCell>
                  <TableCell className={isWinner ? 'text-green-500' : 'text-red-500'}>
                    {isWinner ? 'WIN' : 'LOSS'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {renderPaginationControls()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
