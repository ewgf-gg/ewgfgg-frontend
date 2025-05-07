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
  const getCharacterName = (characterId: number): string => {
    return characterIdMap[characterId] || `Character ${characterId}`;
  };

  const selectedCharacterName = getCharacterName(selectedCharacterId);
  
  const bestMatchup = React.useMemo(() => {
    if (selectedCharacterId === null || selectedCharacterId === undefined || !playedCharacters) {
      return null;
    }

    const character = Object.entries(playedCharacters).find(
      ([name]) => name === selectedCharacterName
    );

    if (!character) return null;

    const [, characterData] = character;
    
    if (!characterData.bestMatchup || Object.keys(characterData.bestMatchup).length === 0) {
      return null;
    }

    const matchupsWithData = Object.entries(characterData.matchups).map(([opponentName, matchupData]) => ({
      opponentName,
      winRate: matchupData.winRate, 
      totalMatches: matchupData.totalMatches
    }));

    const matchupsWithEnoughData = matchupsWithData.filter(m => m.totalMatches >= 20);
    
    let bestMatchupData;
    let hasLimitedData = false;

    if (matchupsWithEnoughData.length > 0) {
      // If we have matchups with enough data, find the one with highest winrate
      bestMatchupData = matchupsWithEnoughData.reduce((best, current) => 
        current.winRate > best.winRate ? current : best, matchupsWithEnoughData[0]);
    } else {
      // For limited data, prioritize match count more
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
      
      matchGroups.sort((a, b) => {
        const aMaxMatches = Math.max(...a.map(m => m.totalMatches));
        const bMaxMatches = Math.max(...b.map(m => m.totalMatches));
        return bMaxMatches - aMaxMatches;
      });
      
      // Take the group with the most matches
      const bestGroup = matchGroups[0];
      
      // From that group, find the matchup with the highest winrate
      bestMatchupData = bestGroup.sort((a, b) => b.winRate - a.winRate)[0];
      
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
