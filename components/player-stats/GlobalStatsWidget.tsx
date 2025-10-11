import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trophy, Swords, Users, Gamepad2, TrendingUp } from 'lucide-react';
import { MatchupStat } from '../../app/state/types/PlayerPageTypes';

interface GlobalStatsWidgetProps {
  totalStatsByBattleType?: Record<string, MatchupStat>;
}

export const GlobalStatsWidget: React.FC<GlobalStatsWidgetProps> = ({
  totalStatsByBattleType = {}
}) => {

  // Get battle type stats
  const rankedStats = totalStatsByBattleType['RANKED_BATTLE'] || { wins: 0, losses: 0, totalGames: 0, winRate: null };
  const quickStats = totalStatsByBattleType['QUICK_BATTLE'] || { wins: 0, losses: 0, totalGames: 0, winRate: null };
  const playerStats = totalStatsByBattleType['PLAYER_BATTLE'] || { wins: 0, losses: 0, totalGames: 0, winRate: null };
  const groupStats = totalStatsByBattleType['GROUP_BATTLE'] || { wins: 0, losses: 0, totalGames: 0, winRate: null };

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
    { key: 'RANKED_BATTLE', stats: rankedStats, color: 'bg-amber-500' },
    { key: 'QUICK_BATTLE', stats: quickStats, color: 'bg-blue-500' },
    { key: 'PLAYER_BATTLE', stats: playerStats, color: 'bg-purple-500' },
    { key: 'GROUP_BATTLE', stats: groupStats, color: 'bg-green-500' }
  ].filter(bt => bt.stats.totalGames > 0);

  // Calculate all matches combined
  const allMatchesStats = battleTypes.reduce(
    (acc, bt) => ({
      wins: acc.wins + bt.stats.wins,
      losses: acc.losses + bt.stats.losses,
      totalGames: acc.totalGames + bt.stats.totalGames
    }),
    { wins: 0, losses: 0, totalGames: 0 }
  );
  const allMatchesWinRate = allMatchesStats.totalGames > 0 
    ? (allMatchesStats.wins / allMatchesStats.totalGames) * 100 
    : 0;

  return (
    <Card className="h-full bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Global Statistics</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Overall performance across all modes
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Individual Battle Types */}
          {battleTypes.map(({ key, stats }) => (
            <div
              key={key}
              className="w-full flex items-center justify-between p-3 rounded-lg border bg-muted/50 border-border"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
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
                <p className="text-xs text-muted-foreground">
                  {stats.wins}W-{stats.losses}L
                </p>
              </div>
            </div>
          ))}

          {/* All Matches Summary */}
          {battleTypes.length > 0 && (
            <div className="w-full p-3 rounded-lg border bg-primary/10 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">All Matches</p>
                    <p className="text-xs text-muted-foreground">
                      {allMatchesStats.totalGames.toLocaleString()} total matches
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {allMatchesWinRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {allMatchesStats.wins}W-{allMatchesStats.losses}L
                  </p>
                </div>
              </div>
            </div>
          )}

          {battleTypes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No match data available
              </p>
            </div>
          )}
        </div>

        {/* Matchup Distribution Footer */}
        {battleTypes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Matchup Distribution</p>
            <div className="w-full h-2 rounded-full overflow-hidden flex">
              {battleTypes.map(({ key, stats, color }) => (
                <div
                  key={key}
                  className={`${color} transition-all`}
                  style={{
                    width: `${(stats.totalGames / allMatchesStats.totalGames) * 100}%`
                  }}
                  title={`${getBattleTypeName(key)}: ${stats.totalGames} matches (${((stats.totalGames / allMatchesStats.totalGames) * 100).toFixed(1)}%)`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
