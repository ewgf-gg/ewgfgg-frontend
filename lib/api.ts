import {
  rankOrderMap,
  PlayerSearchResult,
  RankDistribution,
  HomepageData
} from '@/app/state/types/tekkenTypes'
import { DonorPageResponse } from '@/app/state/types/SupportPageTypes'
import { fetchWithConfig, fetchStatistics, fetchPlayerData } from '@/lib/api-config';


// New function to fetch homepage data from single endpoint
export const getInitialData = async (): Promise<HomepageData> => {
  try {
      const data = await fetchStatistics('front-page');
      return data as HomepageData;
  } catch (error) {
      console.error('Failed to fetch initial data:', error);
      throw new Error(`Failed to fetch initial data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export async function searchPlayersServer(query: string): Promise<PlayerSearchResult[]> {
  if (!query || query.length < 2) return [];
  try {
      return await fetchWithConfig(`/player-stats/search?query=${encodeURIComponent(query)}`);
  } catch (error) {
      console.error('Failed to search players:', error);
      return [];
  }
}


export async function fetchCharacterStats(characterName: string) {
  try {
      return await fetchWithConfig(`/statistics/${encodeURIComponent(characterName)}`, {
          next: {
              revalidate: 300 // Revalidate every 5 minutes
          }
      });
  } catch (error) {
      console.error(`Failed to fetch character stats for ${characterName}:`, error);
      throw new Error(`Failed to fetch character stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchGameActivity() {
  try {
      return await fetchWithConfig('/statistics/gameActivity', {
          next: {
              revalidate: 30 // Revalidate every 30 seconds
          }
      });
  } catch (error) {
      console.error('Failed to fetch game activity:', error);
      throw new Error(`Failed to fetch game activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchDonorPageData(): Promise<DonorPageResponse> {
  try {
      return await fetchWithConfig('/donations/donor-page', {
          next: {
              revalidate: 30 // Revalidate every 60 seconds
          }
      });
  } catch (error) {
      console.error('Failed to fetch donor page data:', error);
      throw new Error(`Failed to fetch donor page data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
