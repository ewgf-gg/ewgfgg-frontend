import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trophy, Swords, Users, Gamepad2 } from 'lucide-react';
import { MatchupStat, PlayerMatchupSummary } from '../../app/state/types/PlayerPageTypes';
import { selectedBattleTypeAtom } from '../../app/state/atoms/tekkenStatsAtoms';

interface MatchStatsWidgetProps {
  totalStatsByBattleType?: Record<string, MatchupStat>;
  playedCharacters?: Record<string, Record<string, PlayerMatchupSummary>>;
  selectedCharacter?: string | null;
}

export const MatchStatsWidget: React.FC<MatchStatsWidgetProps> = ({
  totalStatsByBattleType = {},
  playedCharacters = {},
  selectedCharacter = null
}) => {
  const [showCurrentSeason, setShowCurrentSeason] = useState(true);
  const [selectedBattleType, setSelectedBattleType] = useAtom(selectedBattleTypeAtom);

  // Get battle type stats
  const rankedStats = totalStatsByBattleType['RANKED_BATTLE'] || { wins: 0, losses: 0, totalGames: 0, winRate: null };
  const quickStats = totalStatsByBattleType['QUICK_BATTLE'] || { wins: 0, losses: 0, totalGames: 0, winRate: null };
  const playerStats = totalStatsByBattleType['PLAYER_BATTLE'] || { wins: 0, losses: 0, totalGames: 0, winRate: null };
  const groupStats = totalStatsByBattleType['GROUP_BATTLE'] || { wins: 0, losses: 0, totalGames: 0, winRate: null };

  // Get matchups data
  const getMatchupsData = () => {
    const allMatchups: Record<string, { wins: number; losses: number; winRate: number; totalGames: number }> = {};

    // If a character is selected, get their matchups
    if (selectedCharacter && playedCharacters[selectedCharacter]) {
      Object.values(playedCharacters[selectedCharacter]).forEach((battleTypeData) => {
        const matchups = showCurrentSeason 
          ? battleTypeData.currentSeasonMatchups 
          : battleTypeData.allTimeMatchups;

        if (matchups) {
          Object.entries(matchups).forEach(([opponent, stats]) => {
            if (!allMatchups[opponent]) {
              allMatchups[opponent] = { wins: 0, losses: 0, winRate: 0, totalGames: 0 };
            }
            allMatchups[opponent].wins += stats.wins;
            allMatchups[opponent].losses += stats.losses;
            allMatchups[opponent].totalGames += stats.totalGames;
          });
        }
      });
    } else {
      // Aggregate matchups across all characters
      Object.values(playedCharacters).forEach((characterData) => {
        Object.values(characterData).forEach((battleTypeData) => {
          const matchups = showCurrentSeason 
            ? battleTypeData.currentSeasonMatchups 
            : battleTypeData.allTimeMatchups;

          if (matchups) {
            Object.entries(matchups).forEach(([opponent, stats]) => {
              if (!allMatchups[opponent]) {
                allMatchups[opponent] = { wins: 0, losses: 0, winRate: 0, totalGames: 0 };
              }
              allMatchups[opponent].wins += stats.wins;
              allMatchups[opponent].losses += stats.losses;
              allMatchups[opponent].totalGames += stats.totalGames;
            });
          }
        });
      });
    }

    // Calculate win rates and total games
    Object.keys(allMatchups).forEach((opponent) => {
      const data = allMatchups[opponent];
      // Recalculate total games from wins and losses to ensure accuracy
      data.totalGames = data.wins + data.losses;
      data.winRate = data.totalGames > 0 ? (data.wins / data.totalGames) * 100 : 0;
    });

    // Sort by total games and take top 3
    return Object.entries(allMatchups)
      .sort(([, a], [, b]) => b.totalGames - a.totalGames)
      .slice(0, 3);
  };

  const topMatchups = getMatchupsData();

  const getBattleTypeIcon = (type: string) => {
    switch (type) {
      case 'RANKED_BATTLE': return <Trophy className="w-4 h-4" />;
      case 'QUICK_BATTLE': return <Swords className="w-4 h-4" />;
      case 'PLAYER_BATTLE': return <Users className="w-4 h-4" />;
      case 'GROUP_BATTLE': return <Gamepad2 className="w-4 h-4" />;
      default: return <Swords className="w-4 h-4" />;
    }
  };

  const getBattleTypeName = (type: string) => {
    switch (type) {
      case 'RANKED_BATTLE': return 'Ranked';
      case 'QUICK_BATTLE': return 'Quick';
      case 'PLAYER_BATTLE': return 'Player';
      case 'GROUP_BATTLE': return 'Group';
      default: return type;
    }
  };

  const battleTypes = [
    { key: 'RANKED_BATTLE', stats: rankedStats, color: 'amber' },
    { key: 'QUICK_BATTLE', stats: quickStats, color: 'blue' },
    { key: 'PLAYER_BATTLE', stats: playerStats, color: 'purple' },
    { key: 'GROUP_BATTLE', stats: groupStats, color: 'green' }
  ].filter(bt => bt.stats.totalGames > 0);

  return (
    <Card className="h-full bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Match Statistics</CardTitle>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setShowCurrentSeason(true)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                showCurrentSeason
                  ? 'bg-purple-500/15 text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Current Season
            </button>
            <button
              onClick={() => setShowCurrentSeason(false)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                !showCurrentSeason
                  ? 'bg-purple-500/15 text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Battle Types */}
          <div className="space-y-2">
            {battleTypes.map(({ key, stats }) => (
              <button
                key={key}
                onClick={() => setSelectedBattleType(key)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  selectedBattleType === key
                    ? 'bg-purple-500/10 border-purple-500/50 shadow-sm'
                    : 'bg-muted/50 border-border hover:bg-muted/70 hover:border-border/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedBattleType === key ? 'bg-purple-500/20' : 'bg-purple-500/10'
                  }`}>
                    {getBattleTypeIcon(key)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{getBattleTypeName(key)}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalGames.toLocaleString()} matches
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    {stats.winRate !== null ? `${stats.winRate.toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Top Matchups */}
          {topMatchups.length > 0 && (
            <>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  Top {showCurrentSeason ? 'Current Season' : 'All Time'} Matchups
                </p>
                <div className="space-y-2">
                  {topMatchups.map(([opponent, data]) => (
                    <div 
                      key={opponent}
                      className="flex items-center justify-between p-2 rounded bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{opponent}</span>
                        <span className="text-xs text-muted-foreground">
                          ({data.totalGames} matches)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          data.winRate >= 50 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {data.winRate.toFixed(1)}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {data.wins}W-{data.losses}L
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {topMatchups.length === 0 && (
            <div className="pt-4 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                No matchup data available for {showCurrentSeason ? 'current season' : 'all time'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(MatchStatsWidget);
