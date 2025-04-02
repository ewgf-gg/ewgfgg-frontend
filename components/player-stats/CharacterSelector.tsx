import React from 'react';
import { Card, CardContent } from "../ui/card";
import { characterIconMap, rankIconMap, rankOrderMap } from '../../app/state/types/tekkenTypes';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface CharacterData {
  characterName: string;
  danName: string;
  wins: number;
  losses: number;
  gameVersion: string;
  previousSeasonDanRank?: number;
}

interface CharacterSelectorProps {
  characters: Record<string, CharacterData>;
  onSelectCharacter: (characterId: string) => void;
  selectedCharacterId: string | null;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  onSelectCharacter,
  selectedCharacterId
}) => {
  // Function to get numeric rank value
  const getRankValue = (rankName: string): number => {
    // eslint-disable-next-line
    const entry = Object.entries(rankOrderMap).find(([_, name]) => name === rankName);
    return entry ? parseInt(entry[0]) : -1;
  };

  // Group characters by name to combine stats across versions
  const characterSummaries = Object.entries(characters).reduce((acc, [id, data]) => {
    const existing = acc.find(c => c.characterName === data.characterName);
    if (existing) {
      existing.totalMatches += data.wins + data.losses;
      existing.versions.push({ id, ...data });
      
      // Update latest version and rank if this version is newer
      if (parseInt(data.gameVersion) > parseInt(existing.latestVersion)) {
        existing.latestVersion = data.gameVersion;
        existing.latestRank = data.danName;
      }
    } else {
      acc.push({
        characterName: data.characterName,
        totalMatches: data.wins + data.losses,
        latestRank: data.danName,
        latestVersion: data.gameVersion,
        versions: [{ id, ...data }],
      });
    }
    return acc;
  }, [] as Array<{
    characterName: string;
    totalMatches: number;
    latestRank: string;
    latestVersion: string;
    versions: Array<{ id: string } & CharacterData>;
  }>);

  // Sort by rank first, then by total matches
  characterSummaries.sort((a, b) => {
    const rankA = getRankValue(a.latestRank);
    const rankB = getRankValue(b.latestRank);
    
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
          const latestVersion = character.versions.reduce((latest, current) => 
            parseInt(current.gameVersion) > parseInt(latest.gameVersion) ? current : latest
          );
          
          // Get previous season rank if available
          const previousSeasonRank = latestVersion.previousSeasonDanRank !== undefined 
            ? rankOrderMap[latestVersion.previousSeasonDanRank] 
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
                  latestVersion.id === selectedCharacterId 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-transparent hover:border-primary/50 hover:shadow-md'
                }`}
                onClick={() => onSelectCharacter(latestVersion.id)}
              >
                <CardContent className="p-4 relative">
                  {previousSeasonRank && (
                    <div className="absolute top-2 right-2 bg-accent/90 text-xs font-medium px-1.5 py-0.5 rounded-full z-10 shadow-sm">
                      S1: <img 
                        src={rankIconMap[previousSeasonRank]} 
                        alt={previousSeasonRank}
                        className="w-10 h-6 inline-block ml-0.5"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={characterIconMap[character.characterName]}
                          alt={character.characterName}
                          className={`w-14 h-14 object-contain rounded-full p-1 ${
                            latestVersion.id === selectedCharacterId 
                              ? 'bg-primary/10 ring-2 ring-primary' 
                              : 'bg-accent/10'
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base truncate">{character.characterName}</h3>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <img 
                              src={rankIconMap[character.latestRank]} 
                              alt={character.latestRank}
                              className="w-12 h-10 object-contain"
                            />
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            Matches: {character.totalMatches}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-opacity ${
                      latestVersion.id === selectedCharacterId ? 'opacity-100 text-primary' : 'opacity-50'
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
