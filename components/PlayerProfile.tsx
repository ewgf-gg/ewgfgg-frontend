import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { WinLossGraph } from './WinLossGraph';
import { rankIconMap } from '@/app/state/types/tekkenTypes';

interface PlayerStats {
  username: string;
  rank: string;
  winRate: number;
  totalMatches: number;
  favoriteCharacters: { name: string; matches: number; winRate: number }[];
  recentMatches: { opponent: string; character: string; result: 'win' | 'loss'; date: string }[];
}

export const PlayerProfile: React.FC<{ stats: PlayerStats }> = ({ stats }) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{stats.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Rank</p>
              <img 
    src={rankIconMap[stats.rank]} 
    alt={`${stats.rank} rank icon`}
    className="w-15 h-10 object-contain"
  />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-lg font-semibold">{stats.winRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Matches</p>
              <p className="text-lg font-semibold">{stats.totalMatches}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <WinLossGraph />

      <Card>
        <CardHeader>
          <CardTitle>Favorite Characters</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Character</TableHead>
                <TableHead>Matches</TableHead>
                <TableHead>Win Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.favoriteCharacters.map((char) => (
                <TableRow key={char.name}>
                  <TableCell>{char.name}</TableCell>
                  <TableCell>{char.matches}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Progress value={char.winRate} className="mr-2 w-1/2" />
                      <span>{char.winRate}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opponent</TableHead>
                <TableHead>Character</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentMatches.map((match, index) => (
                <TableRow key={index}>
                  <TableCell>{match.opponent}</TableCell>
                  <TableCell>{match.character}</TableCell>
                  <TableCell className={match.result === 'win' ? 'text-green-500' : 'text-red-500'}>
                    {match.result.toUpperCase()}
                  </TableCell>
                  <TableCell>{match.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};