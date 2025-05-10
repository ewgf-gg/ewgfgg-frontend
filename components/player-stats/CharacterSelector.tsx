import React, { useRef } from 'react';
import { Card, CardContent } from "../ui/card";
import { circularCharacterIconMap, rankIconMap, rankOrderMap } from '../../app/state/types/tekkenTypes';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const getRankValue = (rankValue: number | null): number =>
    rankValue !== null ? rankValue : -1;

  const characterSummaries = Object.entries(characters).map(([characterName, data]) => ({
    characterName,
    totalMatches: data.wins + data.losses,
    currentSeasonDanRank: data.currentSeasonDanRank,
    previousSeasonDanRank: data.previousSeasonDanRank,
    wins: data.wins,
    losses: data.losses,
    winRate: data.characterWinrate
  }));

  characterSummaries.sort((a, b) => {
    const rankA = getRankValue(a.currentSeasonDanRank);
    const rankB = getRankValue(b.currentSeasonDanRank);
    if (rankA !== rankB) return rankB - rankA;
    return b.totalMatches - a.totalMatches;
  });

  return (
    <div className="space-y-2 h-full">
      <h2 className="text-lg font-semibold">Characters</h2>
      <div className="relative">
        <div
          ref={scrollRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 bg-accent/10 rounded-lg p-2"
        >
          {characterSummaries.map(character => {
            const currentSeasonRank = character.currentSeasonDanRank !== null
              ? rankOrderMap[character.currentSeasonDanRank]
              : 'Beginner';
            const previousSeasonRank = character.previousSeasonDanRank !== undefined
              ? rankOrderMap[character.previousSeasonDanRank]
              : null;

            return (
              <motion.div
                key={character.characterName}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`transform transition-all duration-200 ${
                  character.characterName === selectedCharacterId
                    ? 'border-blue-500 shadow-lg shadow-blue/20'
                    : 'border-transparent hover:shadow-md'
                }`}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 overflow-hidden ${
                    character.characterName === selectedCharacterId
                      ? 'border-[#c157f8] border-[3px] shadow-lg shadow-primary/20'
                      : 'border-transparent border-2 hover:border-primary/50 hover:shadow-md'
                  }`}
                  onClick={() => onSelectCharacter(character.characterName)}
                >
                  <CardContent className="p-2 relative">
                    {previousSeasonRank && (
                      <div className="absolute top-1.5 right-1.5 bg-accent/90 text-xs font-medium px-1.5 py-0.5 rounded-full z-10 shadow-sm">
                        S1:{' '}
                        <Image
                          src={rankIconMap[previousSeasonRank]}
                          alt={previousSeasonRank}
                          width={32}
                          height={20}
                          className="inline-block w-10 h-5 ml-0.5"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Image
                            src={circularCharacterIconMap[character.characterName]}
                            alt={character.characterName}
                            width={76}
                            height={76}
                            className="object-contain rounded-full w-[76px] h-[76px]"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm truncate">{character.characterName}</h3>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Image
                                src={rankIconMap[currentSeasonRank]}
                                alt={currentSeasonRank}
                                width={40}
                                height={32}
                                className="w-20 h-8"
                                unoptimized
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Matches: {character.totalMatches}
                            </p>
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 transition-opacity ${
                          character.characterName === selectedCharacterId
                            ? 'opacity-100 text-primary'
                            : 'opacity-50'
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
