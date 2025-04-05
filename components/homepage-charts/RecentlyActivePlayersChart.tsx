import React from 'react';
import { useAtom } from 'jotai';
import { recentlyActivePlayersAtom } from '@/app/state/atoms/tekkenStatsAtoms';
import { Regions, rankIconMap, characterIconMap } from '@/app/state/types/tekkenTypes';
import { CustomChartCard } from '@/components/shared/CustomChartCard';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { ResponsiveContainer } from 'recharts';

interface RecentlyActivePlayersChartProps {
  title: string;
  description?: string;
  delay?: number;
}

export const RecentlyActivePlayersChart: React.FC<RecentlyActivePlayersChartProps> = ({
  title,
  description,
  delay = 0
}) => {
  const [recentlyActivePlayers] = useAtom(recentlyActivePlayersAtom);

  // Take only the last 50 players
  const displayPlayers = recentlyActivePlayers.slice(0, 50);

  const content = (
    <div className="w-full" style={{ minHeight: "200px" }}>
      <ResponsiveContainer width="100%" height={230}>
        <div className="w-full h-full">
          {displayPlayers.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No recently active players found. (Servers could be down for maintenence.)</p>
            </div>
          ) : (
            <div className="space-y-1 overflow-y-auto h-full pr-2">
              {displayPlayers.map((player, index) => (
                <Link 
                  key={index} 
                  href={`/player/${player.polarisId}`} 
                  className="block hover:bg-muted transition-colors duration-200"
                >
                  <div className="flex items-center p-2 bg-muted/50 rounded-lg text-sm cursor-pointer">
                    <div className="flex-shrink-0 mr-2 relative">
                      {/* Character Image */}
                      {player.characterAndRank.characterName && characterIconMap[player.characterAndRank.characterName] && (
                        <div className="w-8 h-8 relative">
                          <Image
                            src={characterIconMap[player.characterAndRank.characterName]}
                            alt={player.characterAndRank.characterName}
                            width={32}
                            height={32}
                            className="rounded-full"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">{player.name}</h4>
                        <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(fromUnixTime(player.lastSeen), {includeSeconds: true})} ago
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="truncate max-w-[100px]">
                          <Image
                            src={rankIconMap[player.characterAndRank.danRank]}
                            alt={player.characterAndRank.danRank}
                            width={56}
                            height={56}
                          />
                        </span>
                        <span>
                          {Regions[player.region] || ''} • TP: {player.tekkenPower.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </ResponsiveContainer>
    </div>
  );

  return (
    <CustomChartCard
      title={title}
      description={description}
      delay={delay}
      height={233}
    >
      {content}
    </CustomChartCard>
  );
};
