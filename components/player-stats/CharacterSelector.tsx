import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "../ui/card";
import { characterIconMap, rankIconMap } from '../../app/state/types/tekkenTypes';
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
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  onSelectCharacter,
  selectedCharacterId
}) => {
  // Extract unique game versions and sort them in descending order
  const gameVersions = [...new Set(Object.values(characters).map(char => char.gameVersion))]
    .sort((a, b) => parseInt(b) - parseInt(a));

  // State for selected version
  const [selectedVersion, setSelectedVersion] = useState(gameVersions[0] || '');

  // Update selected version when versions change
  useEffect(() => {
    if (gameVersions.length > 0 && !gameVersions.includes(selectedVersion)) {
      setSelectedVersion(gameVersions[0]);
    }
  }, [gameVersions]);

  // Filter characters by selected version
  const filteredCharacters = Object.entries(characters).reduce((acc, [id, data]) => {
    if (data.gameVersion === selectedVersion) {
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

  // Sort by total matches in descending order
  characterSummaries.sort((a, b) => b.totalMatches - a.totalMatches);

  const formatVersion = (version: string) => {
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
          onValueChange={setSelectedVersion}
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
          const isSelected = character.versions.some(v => v.id === selectedCharacterId);
          const currentVersion = character.versions[0];

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
                onClick={() => onSelectCharacter(currentVersion.id)}
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
