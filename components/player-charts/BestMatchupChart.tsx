import React from 'react';
import { Battle, characterIdMap, PlayedCharacter } from '../../app/state/types/tekkenTypes';
import MatchupCard from './MatchupCard';

interface BestMatchupChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  playerName: string;
  polarisId: string;
  playedCharacters?: Record<string, PlayedCharacter>;
}

const BestMatchupChart: React.FC<BestMatchupChartProps> = ({ 
  selectedCharacterId, 
  playedCharacters
}) => {
  // Get the character name from the ID
  const getCharacterName = (characterId: number): string => {
    return characterIdMap[characterId] || `Character ${characterId}`;
  };

  const selectedCharacterName = getCharacterName(selectedCharacterId);
  
  // Use the bestMatchup data directly from the playedCharacters if available
  const bestMatchup = React.useMemo(() => {
    // Return null if selectedCharacterId is null or undefined (but not 0)
    if (selectedCharacterId === null || selectedCharacterId === undefined || !playedCharacters) {
      return null;
    }

    const character = Object.entries(playedCharacters).find(
      ([name]) => name === selectedCharacterName
    );

    if (!character) return null;

    const [, characterData] = character;
    
    // If there's no best matchup data or it's empty, return null
    if (!characterData.bestMatchup || Object.keys(characterData.bestMatchup).length === 0) {
      return null;
    }

    // Get all matchups with their data
    const matchupsWithData = Object.entries(characterData.matchups).map(([opponentName, matchupData]) => ({
      opponentName,
      winRate: matchupData.winRate, // Already in percentage form
      totalMatches: matchupData.totalMatches
    }));

    // First, try to find matchups with at least 20 matches
    const matchupsWithEnoughData = matchupsWithData.filter(m => m.totalMatches >= 20);
    
    let bestMatchupData;
    let hasLimitedData = false;

    if (matchupsWithEnoughData.length > 0) {
      // If we have matchups with enough data, find the one with highest winrate
      bestMatchupData = matchupsWithEnoughData.reduce((best, current) => 
        current.winRate > best.winRate ? current : best, matchupsWithEnoughData[0]);
    } else {
      // For limited data, prioritize match count more while still considering winrate
      // Group matchups by match count ranges to find ones with similar counts
      const matchGroups = matchupsWithData.reduce((groups, matchup) => {
        // Create groups of matchups with similar match counts (within 5 matches of each other)
        const existingGroup = groups.find(group => 
          group.some(m => Math.abs(m.totalMatches - matchup.totalMatches) <= 5)
        );
        
        if (existingGroup) {
          existingGroup.push(matchup);
        } else {
          groups.push([matchup]);
        }
        return groups;
      }, [] as Array<typeof matchupsWithData>);
      
      // Sort groups by highest match count
      matchGroups.sort((a, b) => {
        const aMaxMatches = Math.max(...a.map(m => m.totalMatches));
        const bMaxMatches = Math.max(...b.map(m => m.totalMatches));
        return bMaxMatches - aMaxMatches;
      });
      
      // Take the group with the most matches
      const bestGroup = matchGroups[0];
      
      // From that group, find the matchup with the highest winrate
      bestMatchupData = bestGroup.sort((a, b) => b.winRate - a.winRate)[0];
      
      // Mark as limited data if we have a matchup but with fewer than 20 matches
      if (bestMatchupData && bestMatchupData.totalMatches < 20) {
        hasLimitedData = true;
      }
    }

    if (!bestMatchupData) return null;

    return {
      characterName: bestMatchupData.opponentName,
      winRate: bestMatchupData.winRate,
      totalMatches: bestMatchupData.totalMatches,
      hasLimitedData
    };
  }, [selectedCharacterId, selectedCharacterName, playedCharacters]);

  if (!bestMatchup) {
    return null;
  }

  return (
    <MatchupCard
      characterName={bestMatchup.characterName}
      winRate={bestMatchup.winRate}
      title="Best Matchup"
      description="Your highest win rate"
      hasLimitedData={bestMatchup.hasLimitedData}
    />
  );
};

export default BestMatchupChart;
