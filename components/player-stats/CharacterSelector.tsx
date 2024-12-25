import React, { useState } from 'react';
import { Card, CardContent } from "../ui/card";
import { characterIconMap, rankIconMap, rankOrderMap } from '../../app/state/types/tekkenTypes';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
  onVersionChange: (version: string) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  onSelectCharacter,
  selectedCharacterId,
  onVersionChange
}) => {
  // Get unique game versions
  const gameVersions = ['all', ...new Set(Object.values(characters).map(char => char.gameVersion))]
    .sort((a, b) => {
      if (a === 'all') return -1;
      if (b === 'all') return 1;
      return parseInt(b) - parseInt(a);
    });

  const [selectedVersion, setSelectedVersion] = useState(gameVersions[0]);

  // Function to get numeric rank value
  const getRankValue = (rankName: string): number => {
    const entry = Object.entries(rankOrderMap).find(([name]) => name === rankName);
    return entry ? parseInt(entry[0]) : -1;
  };

  // Handle version change
  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    onVersionChange(version);
  };

  // Filter characters by selected version
  const filteredCharacters = Object.entries(characters).reduce((acc, [id, data]) => {
    if (selectedVersion === 'all' || data.gameVersion === selectedVersion) {
      acc[id] = data;
    }
    return acc;
  }, {} as Record<string, CharacterData>);

  // Group characters by name to combine stats across versions
  const characterSummaries = Object.entries(filteredCharacters).reduce((acc, [id, data]) => {
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

  const formatVersion = (version: string) => {
    if (version === 'all') return 'All Versions';
    const major = Math.floor(parseInt(version) / 10000);
    const minor = Math.floor((parseInt(version) % 10000) / 100);
    const patch = parseInt(version) % 100;
    return `Version ${major}.${minor}.${patch}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          value={selectedVersion}
          onValueChange={handleVersionChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            {gameVersions.map((version) => (
              <SelectItem key={version} value={version}>
                {formatVersion(version)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {characterSummaries.map((character) => {
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
                  latestVersion.id === selectedCharacterId ? 'bg-accent' : 'hover:bg-accent/50'
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
    </div>
  );
};
