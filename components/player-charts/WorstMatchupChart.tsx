import React from 'react';
import { Battle, characterIdMap, PlayedCharacter } from '../../app/state/types/tekkenTypes';
import MatchupCard from './MatchupCard';

interface WorstMatchupChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  playerName: string;
  polarisId: string;
  playedCharacters?: Record<string, PlayedCharacter>;
}

const WorstMatchupChart: React.FC<WorstMatchupChartProps> = ({ 
  selectedCharacterId, 
  playedCharacters
}) => {
  // Get the character name from the ID
  const getCharacterName = (characterId: number): string => {
    return characterIdMap[characterId] || `Character ${characterId}`;
  };

  const selectedCharacterName = getCharacterName(selectedCharacterId);
  
  // Use the worstMatchup data directly from the playedCharacters if available
  const worstMatchup = React.useMemo(() => {
    // Return null if selectedCharacterId is null or undefined (but not 0)
    if (selectedCharacterId === null || selectedCharacterId === undefined || !playedCharacters) {
      return null;
    }

    const character = Object.entries(playedCharacters).find(
      ([name]) => name === selectedCharacterName
    );

    if (!character) return null;

    const [, characterData] = character;
    
    // If there's no worst matchup data or it's empty, return null
    if (!characterData.worstMatchup || Object.keys(characterData.worstMatchup).length === 0) {
      return null;
    }

    // Get all matchups with their data
    const matchupsWithData = Object.entries(characterData.matchups).map(([opponentName, matchupData]) => ({
      opponentName,
      winRate: matchupData.winRate, 
      totalMatches: matchupData.totalMatches
    }));

    // First, try to find matchups with at least 20 matches
    const matchupsWithEnoughData = matchupsWithData.filter(m => m.totalMatches >= 20);
    
    let worstMatchupData;
    let hasLimitedData = false;

    if (matchupsWithEnoughData.length > 0) {
      // If we have matchups with enough data, find the one with lowest winrate
      worstMatchupData = matchupsWithEnoughData.reduce((worst, current) => 
        current.winRate < worst.winRate ? current : worst, matchupsWithEnoughData[0]);
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
      const worstGroup = matchGroups[0];
      
      // From that group, find the matchup with the lowest winrate
      worstMatchupData = worstGroup.sort((a, b) => a.winRate - b.winRate)[0];
      
      // Mark as limited data if we have a matchup but with fewer than 20 matches
      if (worstMatchupData && worstMatchupData.totalMatches < 20) {
        hasLimitedData = true;
      }
    }

    if (!worstMatchupData) return null;

    return {
      characterName: worstMatchupData.opponentName,
      winRate: worstMatchupData.winRate,
      totalMatches: worstMatchupData.totalMatches,
      hasLimitedData
    };
  }, [selectedCharacterId, selectedCharacterName, playedCharacters]);

  if (!worstMatchup) {
    return null;
  }

  return (
    <MatchupCard
      characterName={worstMatchup.characterName}
      winRate={worstMatchup.winRate}
      title="Worst Matchup"
      description="Your lowest win rate"
      hasLimitedData={worstMatchup.hasLimitedData}
    />
  );
};

export default WorstMatchupChart;
