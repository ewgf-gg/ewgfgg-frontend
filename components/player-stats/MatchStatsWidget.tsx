import React from 'react';
import { useAtom } from 'jotai';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trophy, Swords } from 'lucide-react';
import { selectedBattleTypeAtom } from '../../app/state/atoms/tekkenStatsAtoms';
import { MatchupStat } from '../../app/state/types/PlayerPageTypes';

interface MatchStatsWidgetProps {
  totalStatsByBattleType?: Record<string, MatchupStat>;
}

export const MatchStatsWidget: React.FC<MatchStatsWidgetProps> = ({
  totalStatsByBattleType = {}
}) => {
  const [selectedBattleType, setSelectedBattleType] = useAtom(selectedBattleTypeAtom);

  // Get stats for the selected battle type
  const stats = totalStatsByBattleType[selectedBattleType] || {
    wins: 0,
    losses: 0,
    totalMatches: 0,
    winRate: 0
  };

  // Get stats for all battle types
  const rankedStats = totalStatsByBattleType['RANKED_BATTLE'] || { wins: 0, losses: 0, totalMatches: 0, winRate: 0 };
  const quickStats = totalStatsByBattleType['PLAYER_BATTLE'] || { wins: 0, losses: 0, totalMatches: 0, winRate: 0 };

  // Calculate if current selection is ranked
  const isRanked = selectedBattleType === 'RANKED_BATTLE';

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Match Statistics</CardTitle>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setSelectedBattleType('RANKED_BATTLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                isRanked 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Ranked
            </button>
            <button
              onClick={() => setSelectedBattleType('PLAYER_BATTLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                !isRanked 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              Quick
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Wins */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Trophy className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Wins</p>
                <p className="text-xs text-muted-foreground">Victories</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-500">{stats.wins.toLocaleString()}</p>
            </div>
          </div>

          {/* Losses */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Swords className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Losses</p>
                <p className="text-xs text-muted-foreground">Defeats</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-500">{stats.losses.toLocaleString()}</p>
            </div>
          </div>

          {/* Win Rate */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Win Rate</p>
                <p className="text-xs text-muted-foreground">{stats.totalMatches.toLocaleString()} total matches</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {stats.winRate !== null ? `${stats.winRate.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar showing win/loss distribution */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Win/Loss Distribution</span>
            <span>{stats.wins} W - {stats.losses} L</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full flex">
              <div 
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${stats.totalMatches > 0 ? (stats.wins / stats.totalMatches) * 100 : 0}%` }}
              />
              <div 
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${stats.totalMatches > 0 ? (stats.losses / stats.totalMatches) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Battle type comparison */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Quick Comparison</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Ranked</p>
              <p className="text-sm font-bold">{rankedStats.totalMatches.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {rankedStats.winRate !== null ? `${rankedStats.winRate.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            <div className="text-center p-2 rounded bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Quick</p>
              <p className="text-sm font-bold">{quickStats.totalMatches.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {quickStats.winRate !== null ? `${quickStats.winRate.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
