import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { rankIconMap, CharacterStatsWithVersion, GameVersion, Battle, characterIdMap, characterIconMap } from '../app/state/types/tekkenTypes';
import CharacterWinLossChart from './player-charts/CharacterWinLossChart';
import CharacterWinrateChart from './player-charts/CharacterWinrateChart';
import CharacterDistributionChart from './player-charts/CharacterDistributionChart';
import BestMatchupChart from './player-charts/BestMatchupChart';
import WorstMatchupChart from './player-charts/WorstMatchupChart';
import WinrateOverTimeChart from './player-charts/WinrateOverTimeChart';
import { CharacterSelector } from './player-stats/CharacterSelector';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface FormattedMatch {
  opponent: string;
  character: string;
  result: 'win' | 'loss';
  date: string;
}

interface PlayerStats {
  username: string;
  rank: string;
  winRate: number;
  totalMatches: number;
  favoriteCharacters: { name: string; matches: number; winRate: number }[];
  recentMatches: FormattedMatch[];
  characterStatsWithVersion: CharacterStatsWithVersion[];
  characterBattleStats: any[];
  battles: Battle[];
}

export const PlayerProfile: React.FC<{ stats: PlayerStats }> = ({ stats }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const battlesPerPage = 10;

  // Extract character stats for the selector
  const characterStats = stats.characterStatsWithVersion.reduce((acc, stat) => {
    const key = `CharacterStatsId(playerId=0, characterId=${stat.characterId}, gameVersion=${stat.gameVersion})`;
    acc[key] = {
      characterName: stat.characterName,
      danName: stat.danName,
      wins: stat.wins,
      losses: stat.losses,
      gameVersion: stat.gameVersion
    };
    return acc;
  }, {} as Record<string, any>);

  // Get the selected character's stats and game version
  const selectedCharacterData = selectedCharacterId 
    ? stats.characterStatsWithVersion.find(stat => 
        `CharacterStatsId(playerId=0, characterId=${stat.characterId}, gameVersion=${stat.gameVersion})` === selectedCharacterId
      )
    : null;

  // Get the selected character's ID and game version for charts
  const selectedCharacterNumericId = selectedCharacterData?.characterId || 0;
  const selectedGameVersion = selectedCharacterData?.gameVersion || '10901';

  // Filter battles by selected character and game version
  const filteredBattles = selectedCharacterNumericId > 0
    ? stats.battles.filter(battle => {
        const isPlayer1 = battle.player1Name === stats.username;
        const matchesCharacter = isPlayer1 
          ? battle.player1CharacterId === selectedCharacterNumericId
          : battle.player2CharacterId === selectedCharacterNumericId;
        // Add game version filtering logic here when available in battle data
        return matchesCharacter;
      })
    : stats.battles;

  // Pagination logic
  const totalPages = Math.ceil(filteredBattles.length / battlesPerPage);
  const indexOfLastBattle = currentPage * battlesPerPage;
  const indexOfFirstBattle = indexOfLastBattle - battlesPerPage;
  const currentBattles = filteredBattles.slice(indexOfFirstBattle, indexOfLastBattle);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationControls = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Previous button
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

    // First page
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

    // Page numbers
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

    // Last page
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

    // Next button
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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{stats.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Rank</p>
              <img 
                src={rankIconMap[stats.rank]} 
                alt={`${stats.rank} rank icon`}
                className="w-15 h-10 object-contain"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-lg font-semibold">{stats.winRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Matches</p>
              <p className="text-lg font-semibold">{stats.totalMatches}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <CharacterSelector
        characters={characterStats}
        onSelectCharacter={setSelectedCharacterId}
        selectedCharacterId={selectedCharacterId}
      />

      {selectedCharacterNumericId > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CharacterWinLossChart characterStats={[selectedCharacterData!]} />
            <BestMatchupChart 
              battles={filteredBattles}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
            />
            <WorstMatchupChart 
              battles={filteredBattles}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
            />
          </div>
          <div className="w-full">
            <CharacterWinrateChart
              battles={filteredBattles}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
            />
          </div>
          <div className="w-full">
            <CharacterDistributionChart
              battles={filteredBattles}
              selectedCharacterId={selectedCharacterNumericId}
              playerName={stats.username}
            />
          </div>
          <div className="w-full">
            <WinrateOverTimeChart
              battles={filteredBattles}
              playerName={stats.username}
              selectedCharacterId={selectedCharacterNumericId}
            />
          </div>
        </div>
      )}

      {filteredBattles.length > 0 && (
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
                  const isPlayer1 = battle.player1Name === stats.username;
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
      )}
    </div>
  );
};
