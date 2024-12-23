import { 
    GameRankDistribution, 
    rankOrderMap,
    InitialData,
    PlayerSearchResult,
    GameVersion,
    RankDistribution,
    VersionPopularityStats,
    VersionWinrateStats
} from '@/app/state/types/tekkenTypes';
import { SetStateAction } from 'react';

// Add the transform function at the top of the file
const transformRankDistribution = (entries: Array<{ rank: number, percentage: number }>): RankDistribution[] => {
    return entries.map(entry => ({
        rank: rankOrderMap[entry.rank].toString(), // Convert to string to match schema
        percentage: entry.percentage
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
  
export const getInitialData = async (
    setGameVersions?: (value: SetStateAction<string[]>) => void
): Promise<InitialData> => {
    try {
        const [
            statsSummary,
            winrates,
            popularity,
            winrateChanges,
            rankDistributionData
        ] = await Promise.all([
            fetchWithAuth('/statistics/stats-summary'),
            fetchWithAuth('/statistics/top-winrates'),
            fetchWithAuth('/statistics/top-popularity'),
            fetchWithAuth('/statistics/winrate-changes'),
            fetchWithAuth('/statistics/rankDistribution')
        ]);

        // Transform the consolidated rank distribution data to match GameRankDistribution type
        const distributionData = {} as GameRankDistribution;
        
        Object.entries(rankDistributionData).forEach(([version, data]) => {
            // Ensure version is one of the allowed GameVersion types
            if (version as GameVersion) {
                distributionData[version as GameVersion] = {
                    overall: transformRankDistribution(data.overall),
                    standard: transformRankDistribution(data.standard)
                };
            }
        });

        return {
            totalReplays: statsSummary.totalReplays,
            totalPlayers: statsSummary.totalPlayers,
            characterWinrates: winrates,
            characterPopularity: popularity,
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

// New functions for version statistics
export async function fetchVersionPopularity(): Promise<VersionPopularityStats> {
    try {
        return await fetchWithAuth('/statistics/version-popularity');
    } catch (error) {
        console.error('Failed to fetch version popularity statistics:', error);
        throw new Error('Failed to fetch version popularity statistics');
    }
}

export async function fetchVersionWinrates(): Promise<VersionWinrateStats> {
    try {
        return await fetchWithAuth('/statistics/version-winrates');
    } catch (error) {
        console.error('Failed to fetch version winrate statistics:', error);
        throw new Error('Failed to fetch version winrate statistics');
    }
}
