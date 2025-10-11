import React from 'react';
import { fetchCharacterStats } from '@/lib/api';
import { transformCharacterStatsResponse } from '@/lib/character-utils';
import { CharacterStatsApiResponse } from '@/app/state/types/CharacterPageTypes';
import CharacterPageContent from './CharacterPageContent';

interface CharacterPageProps {
  params: {
    characterName: string;
  };
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { characterName } = params;
  
  try {
    // Fetch character stats from API (server-side)
    const apiResponse: CharacterStatsApiResponse = await fetchCharacterStats(characterName);
    
    // Transform API response to frontend format
    const characterData = transformCharacterStatsResponse(apiResponse);
    
    return <CharacterPageContent characterData={characterData} />;
  } catch (error) {
    console.error(`Error fetching character stats for ${characterName}:`, error);
    
    // Return error state or fallback
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Character Data</h1>
          <p className="text-muted-foreground">
            Failed to load statistics for {characterName}. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

export async function generateMetadata({ params }: CharacterPageProps) {
  const { characterName } = params;
  return {
    title: `${characterName} - Global Character Stats | EWGF.GG`,
    description: `Comprehensive statistics, matchups, rank distribution, and top players for ${characterName} in Tekken 8. View win rates, pick rates, and global rankings.`,
  };
}
