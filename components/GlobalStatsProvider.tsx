'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { totalPlayersAtom, totalRankedReplaysAtom, totalUnrankedReplaysAtom, totalActivePlayers30dAtom, totalRankedReplays30dAtom, totalUnrankedReplays30dAtom } from '@/app/state/atoms/tekkenStatsAtoms';

export default function GlobalStatsProvider() {
  const [, setTotalPlayers] = useAtom(totalPlayersAtom);
  const [, setTotalRankedReplays] = useAtom(totalRankedReplaysAtom);
  const [, setTotalUnrankedReplays] = useAtom(totalUnrankedReplaysAtom);
  const [, setTotalActivePlayers30d] = useAtom(totalActivePlayers30dAtom);
  const [, setTotalRankedReplays30d] = useAtom(totalRankedReplays30dAtom);
  const [, setTotalUnrankedReplays30d] = useAtom(totalUnrankedReplays30dAtom);

  useEffect(() => {
    let mounted = true;

    const initializeStats = async () => {
      try {
        const response = await fetch('/api/statistics/');
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const stats = await response.json();
        
        if (mounted && stats) {
          setTotalPlayers(stats.totalPlayers);
          setTotalRankedReplays(stats.totalRankedReplays);
          setTotalUnrankedReplays(stats.totalUnrankedReplays);
          setTotalActivePlayers30d(stats.totalActivePlayers30d);
          setTotalRankedReplays30d(stats.totalRankedReplays30d);
          setTotalUnrankedReplays30d(stats.totalUnrankedReplays30d);
        }
      } catch (error) {
        console.error('Failed to fetch global stats:', error);
      }
    };

    if (typeof window !== 'undefined') {
      initializeStats();
    }

    return () => {
      mounted = false;
    };
  }, [setTotalPlayers, setTotalRankedReplays, setTotalUnrankedReplays, setTotalActivePlayers30d, setTotalRankedReplays30d, setTotalUnrankedReplays30d]);

  return null;
}
