import React from 'react';
import { Card, CardContent } from "../ui/card";
import { characterIconMap, rankIconMap, rankOrderMap } from '../../app/state/types/tekkenTypes';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { PlayedCharacter } from '../../app/state/types/tekkenTypes';
import Image from 'next/image';

interface CharacterSelectorProps {
  characters: Record<string, PlayedCharacter>;
  onSelectCharacter: (characterId: string) => void;
  selectedCharacterId: string | null;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  onSelectCharacter,
  selectedCharacterId
}) => {
  // Function to get numeric rank value
  const getRankValue = (rankValue: number | null): number => {
    return rankValue !== null ? rankValue : -1;
  };

  // Create character summaries from the new structure
  const characterSummaries = Object.entries(characters).map(([characterName, data]) => {
    return {
      characterName,
      totalMatches: data.wins + data.losses,
      currentSeasonDanRank: data.currentSeasonDanRank,
      previousSeasonDanRank: data.previousSeasonDanRank,
      wins: data.wins,
      losses: data.losses,
      winRate: data.characterWinrate
    };
  });

  // Sort by rank first, then by total matches
  characterSummaries.sort((a, b) => {
    const rankA = getRankValue(a.currentSeasonDanRank);
    const rankB = getRankValue(b.currentSeasonDanRank);
    
    // If ranks are different, sort by rank (higher rank first)
    if (rankA !== rankB) {
      return rankB - rankA;
    }
    
    // If ranks are the same, sort by total matches
    return b.totalMatches - a.totalMatches;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Select a Character</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {characterSummaries.map((character) => {
          // Get current season rank
          const currentSeasonRank = character.currentSeasonDanRank !== null 
            ? rankOrderMap[character.currentSeasonDanRank] 
            : 'Beginner';
          
          // Get previous season rank if available
          const previousSeasonRank = character.previousSeasonDanRank !== undefined 
            ? rankOrderMap[character.previousSeasonDanRank] 
            : null;

          return (
            <motion.div
              key={character.characterName}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="transform transition-all duration-200"
            >
              <Card 
                className={`cursor-pointer border-2 transition-all duration-200 overflow-hidden ${
                  character.characterName === selectedCharacterId 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-transparent hover:border-primary/50 hover:shadow-md'
                }`}
                onClick={() => onSelectCharacter(character.characterName)}
              >
                <CardContent className="p-4 relative">
                  {previousSeasonRank && (
                    <div className="absolute top-2 right-2 bg-accent/90 text-xs font-medium px-1.5 py-0.5 rounded-full z-10 shadow-sm">
                      S1: <Image 
                        src={rankIconMap[previousSeasonRank]} 
                        alt={previousSeasonRank}
                        width={40}
                        height={24}
                        className="w-12 h-7 inline-block ml-0.5"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={characterIconMap[character.characterName]}
                          alt={character.characterName}
                          width={56}
                          height={56}
                          className={`w-14 h-14 object-contain rounded-full p-1 ${
                            character.characterName === selectedCharacterId 
                              ? 'bg-primary/10 ring-2 ring-primary' 
                              : 'bg-accent/10'
                          }`}
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base truncate">{character.characterName}</h3>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Image 
                              src={rankIconMap[currentSeasonRank]} 
                              alt={currentSeasonRank}
                              width={48}
                              height={40}
                              className="w-24 h-12"
                              unoptimized
                            />
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            Matches: {character.totalMatches}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-opacity ${
                      character.characterName === selectedCharacterId ? 'opacity-100 text-primary' : 'opacity-50'
                    }`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
