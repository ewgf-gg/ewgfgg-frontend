import { 
  CharacterStatsApiResponse, 
  CharacterStatsResponse,
  CharacterMatchup 
} from '@/app/state/types/CharacterPageTypes';
import { rankOrderMap } from '@/app/state/types/tekkenTypes';

// Helper function to determine matchup difficulty based on winrate
function getMatchupDifficulty(winrate: number): 'Easy' | 'Medium' | 'Hard' | 'Very Hard' {
  if (winrate >= 54) return 'Easy';
  if (winrate >= 51) return 'Medium';
  if (winrate >= 48) return 'Hard';
  return 'Very Hard';
}

// Helper function to get character icon path
function getCharacterIcon(characterName: string): string {
  return `/static/character-icons/${characterName}T8.webp`;
}

// Helper function to convert display rank name to enum format
// e.g., "Fujin" -> "FUJIN", "Tekken God Supreme" -> "TEKKEN_GOD_SUPREME"
function convertRankToEnum(rankName: string | null): string {
  if (!rankName) return 'BEGINNER';
  
  return rankName
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
}

// Create reverse mapping from rank name to rank code for sorting
const rankNameToCode: { [key: string]: number } = {};
Object.entries(rankOrderMap).forEach(([code, name]) => {
  const normalizedName = name.toUpperCase().replace(/\s+/g, '_').replace(/-/g, '_');
  rankNameToCode[normalizedName] = parseInt(code);
});

// Helper function to get rank code for sorting
function getRankCode(rankName: string): number {
  const normalizedName = rankName.toUpperCase().replace(/\s+/g, '_').replace(/-/g, '_');
  return rankNameToCode[normalizedName] ?? 999; // Unknown ranks go to the end
}

// Transform API response to frontend format
export function transformCharacterStatsResponse(
  apiResponse: CharacterStatsApiResponse
): CharacterStatsResponse {
  // Transform matchups
  const matchups: CharacterMatchup[] = apiResponse.matchups.map(matchup => ({
    opponentCharacter: matchup.opp_character,
    opponentIcon: getCharacterIcon(matchup.opp_character),
    winRate: matchup.winrate,
    totalGames: matchup.total_games,
    difficulty: getMatchupDifficulty(matchup.winrate)
  }));

  // Transform rank distribution and sort by rank code
  const rankDistribution = Object.entries(apiResponse.rank_distribution)
    .map(([rank, count]) => {
      const totalPlayers = apiResponse.total_unique_players;
      return {
        rank,
        count,
        percentage: totalPlayers > 0 ? (count / totalPlayers) * 100 : 0
      };
    })
    .sort((a, b) => getRankCode(a.rank) - getRankCode(b.rank));

  // Transform trend data
  const trendData = apiResponse.daily_trends.map(trend => ({
    date: trend.date,
    winRate: trend.winrate,
    pickRate: trend.pickrate,
    popularity: trend.matches
  }));

  return {
    characterName: apiResponse.character_id,
    characterIcon: getCharacterIcon(apiResponse.character_id),
    overallStats: {
      winRate: apiResponse.winrate,
      pickRate: apiResponse.pickrate,
      totalMatches: apiResponse.total_matches,
      averageRank: convertRankToEnum(apiResponse.median_rank),
      totalPlayers: apiResponse.total_unique_players,
      mainedBy: apiResponse.total_mains || 0,
      mainedByPercent: apiResponse.mained_by_percent || 0
    },
    matchups,
    rankDistribution,
    topPlayers: [], // Top players data not included in this endpoint
    trendData
  };
}
