import React from 'react';
import { Card, CardContent } from "../ui/card";
import { characterIconMap, rankIconMap } from '../../app/state/types/tekkenTypes';
import { motion } from 'framer-motion';

interface CharacterData {
  characterName: string;
  danName: string;
  wins: number;
  losses: number;
  gameVersion: string;
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

  // Sort by total matches in descending order
  characterSummaries.sort((a, b) => b.totalMatches - a.totalMatches);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {characterSummaries.map((character) => {
        const isSelected = character.versions.some(v => v.id === selectedCharacterId);
        const latestVersion = character.versions.reduce((latest, current) => 
          parseInt(current.gameVersion) > parseInt(latest.gameVersion) ? current : latest
        );

        return (
          <motion.div
            key={character.characterName}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-colors ${
                isSelected ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
              onClick={() => onSelectCharacter(latestVersion.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={characterIconMap[character.characterName]}
                    alt={character.characterName}
                    className="w-12 h-12 object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base truncate">{character.characterName}</h3>
                    <div className="flex items-center gap-2">
                      <img 
                        src={rankIconMap[character.latestRank]} 
                        alt={character.latestRank}
                        className="w-15 h-12 object-contain"
                      />
                      <p className="text-xs text-muted-foreground">
                        Matches: {character.totalMatches}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
