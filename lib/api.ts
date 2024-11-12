import { 
    GameRankDistribution, 
    rankOrderMap,
    InitialData,
    PlayerSearchResult

  } from '@/app/state/types/tekkenTypes';
  
  // Add the transform function at the top of the file
  const transformRankDistribution = (data: { [key: string]: number }) => {
    return Object.entries(data).map(([key, value]) => ({
      rank: rankOrderMap[parseInt(key)],
      percentage: value
    }));
  };
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const API_KEY = process.env.API_KEY;
  
  async function fetchWithAuth(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Cache-Control': 'no-store'
      }
    });
  
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  
    return response.json();
  }
  

export const getInitialData = async (): Promise<InitialData> => {
    try {
        const [
            statsSummary, 
            winrates, 
            popularity, 
            versions,
            winrateChanges
        ] = await Promise.all([
            fetchWithAuth('/statistics/stats-summary'),
            fetchWithAuth('/statistics/top-winrates'),
            fetchWithAuth('/statistics/top-popularity'),
            fetchWithAuth('/statistics/gameVersions'),
            fetchWithAuth('/statistics/winrate-changes')
        ]);

        // Fetch rank distribution for each version
        const distributionData = {} as GameRankDistribution;
        for (const version of versions) {
            distributionData[version as keyof GameRankDistribution] = {
                overall: [],
                standard: []
            };
           
            const [overallData, standardData] = await Promise.all([
                fetchWithAuth(`/statistics/rankDistribution/${version}/overall`),
                fetchWithAuth(`/statistics/rankDistribution/${version}/standard`)
            ]);

            distributionData[version as keyof GameRankDistribution].overall =
                transformRankDistribution(overallData.rankDistribution);
            distributionData[version as keyof GameRankDistribution].standard =
                transformRankDistribution(standardData.rankDistribution);
        }

        return {
            totalReplays: statsSummary.totalReplays,
            totalPlayers: statsSummary.totalPlayers,
            characterWinrates: winrates,
            characterPopularity: popularity,
            gameVersions: versions,
            rankDistribution: distributionData,
            winrateChanges
        };
    } catch (error) {
        throw new Error('Failed to fetch initial data');
    }
};

export async function searchPlayersServer(query: string): Promise<PlayerSearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    return await fetchWithAuth(`/player-stats/search?query=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error('Failed to search players:', error);
    return [];
  }
}
