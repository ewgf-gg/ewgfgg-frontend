import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { circularCharacterIconMap, rankIconMap, rankOrderMap } from '../../app/state/types/tekkenTypes';
import { motion } from 'framer-motion';
import { PlayerMatchupSummary } from '../../app/state/types/PlayerPageTypes';
import Image from 'next/image';

interface CharacterSelectorProps {
  characters: Record<string, Record<string, PlayerMatchupSummary>>;
  onSelectCharacter: (characterId: string) => void;
  selectedCharacterId: string | null;
}

interface AggregatedCharacterStats {
  characterName: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  currentSeasonRank: string | null;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  onSelectCharacter,
  selectedCharacterId
}) => {
  // Aggregate stats across all battle types for each character
  const characterSummaries = useMemo(() => {
    const aggregated = Object.entries(characters).map(([characterName, battleTypes]) => {
      // Sum wins and losses across all battle types
      const totals = Object.values(battleTypes).reduce(
        (sum, battleTypeStats) => ({
          wins: sum.wins + battleTypeStats.wins,
          losses: sum.losses + battleTypeStats.losses,
        }),
        { wins: 0, losses: 0 }
      );

      // Get rank from RANKED_BATTLE first, or fall back to any available battle type
      const rankedBattleStats = battleTypes['RANKED_BATTLE'] || Object.values(battleTypes)[0];
      const currentSeasonRank = rankedBattleStats?.currentSeasonRank || null;

      const totalMatches = totals.wins + totals.losses;
      const winRate = totalMatches > 0 ? (totals.wins / totalMatches) * 100 : 0;

      return {
        characterName,
        totalMatches,
        wins: totals.wins,
        losses: totals.losses,
        winRate,
        currentSeasonRank,
      };
    });

    // Sort by rank first, then by total matches
    aggregated.sort((a, b) => {
      const getRankValue = (rank: string | null): number => {
        if (!rank) return -1;
        // Find rank value from rankOrderMap
        const entry = Object.entries(rankOrderMap).find(([_, name]) => name === rank);
        return entry ? parseInt(entry[0]) : -1;
      };

      const rankA = getRankValue(a.currentSeasonRank);
      const rankB = getRankValue(b.currentSeasonRank);
      if (rankA !== rankB) return rankB - rankA;
      return b.totalMatches - a.totalMatches;
    });

    return aggregated;
  }, [characters]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Characters</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <table className="w-full">
            <thead className="sticky top-0 bg-background border-b">
              <tr>
                <th className="text-left p-2 text-sm font-medium text-muted-foreground">Character</th>
                <th className="text-center p-2 text-sm font-medium text-muted-foreground">Rank</th>
                <th className="text-center p-2 text-sm font-medium text-muted-foreground">W/L</th>
                <th className="text-center p-2 text-sm font-medium text-muted-foreground">WR%</th>
              </tr>
            </thead>
            <tbody>
              {characterSummaries.map((character, index) => {
                const currentSeasonRank = character.currentSeasonRank || 'Beginner';

                return (
                  <motion.tr
                    key={character.characterName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelectCharacter(character.characterName)}
                    className={`cursor-pointer transition-all duration-200 border-b last:border-b-0 ${
                      character.characterName === selectedCharacterId
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src={circularCharacterIconMap[character.characterName]}
                          alt={character.characterName}
                          width={40}
                          height={40}
                          className="object-contain rounded-full"
                          unoptimized
                        />
                        <span className="font-medium text-sm">{character.characterName}</span>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <Image
                        src={rankIconMap[currentSeasonRank]}
                        alt={currentSeasonRank}
                        width={48}
                        height={24}
                        className="inline-block"
                        unoptimized
                      />
                    </td>
                    <td className="p-2 text-center text-sm">
                      <span className="text-green-500">{character.wins}</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="text-red-500">{character.losses}</span>
                    </td>
                    <td className="p-2 text-center">
                      <span className={`font-medium text-sm ${
                        character.winRate >= 50 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {character.winRate.toFixed(1)}%
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
