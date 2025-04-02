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
  playerName,
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

    // Get the worst matchup character and winrate
    const [opponentName, winRate] = Object.entries(characterData.worstMatchup)[0];
    
    // Get the total matches for this matchup
    const matchupData = characterData.matchups[opponentName];
    const totalMatches = matchupData ? matchupData.totalMatches : 0;

    return {
      characterName: opponentName,
      winRate: winRate, // Already in percentage form
      totalMatches
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
    />
  );
};

export default WorstMatchupChart;
