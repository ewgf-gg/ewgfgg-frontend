import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Battle, characterIdMap, characterIconMap } from '@/app/state/types/tekkenTypes';

interface FilteredBattlesTableProps {
  battles: Battle[];
  playerName: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  battlesPerPage?: number;
}

const FilteredBattlesTable: React.FC<FilteredBattlesTableProps> = ({
  battles,
  playerName,
  currentPage,
  setCurrentPage,
  battlesPerPage = 10
}) => {
  const totalPages = Math.ceil(battles.length / battlesPerPage);
  const indexOfLastBattle = currentPage * battlesPerPage;
  const indexOfFirstBattle = indexOfLastBattle - battlesPerPage;
  const currentBattles = battles.slice(indexOfFirstBattle, indexOfLastBattle);

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
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
          onClick={() => setCurrentPage(1)}
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
          onClick={() => setCurrentPage(i)}
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
          onClick={() => setCurrentPage(totalPages)}
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
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return buttons;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Battles</CardTitle>
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
              const isPlayer1 = battle.player1Name === playerName;
              const playerCharacter = getCharacterName(isPlayer1 ? battle.player1CharacterId : battle.player2CharacterId);
              const opponentCharacter = getCharacterName(isPlayer1 ? battle.player2CharacterId : battle.player1CharacterId);
              const opponentName = isPlayer1 ? battle.player2Name : battle.player1Name;
              const isWinner = (isPlayer1 && battle.winner === 1) || (!isPlayer1 && battle.winner === 2);

              return (
                <TableRow key={index}>
                  <TableCell>{formatDate(battle.date)}</TableCell>
                  <TableCell>{renderCharacterWithIcon(playerCharacter)}</TableCell>
                  <TableCell>{opponentName}</TableCell>
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

export default FilteredBattlesTable;