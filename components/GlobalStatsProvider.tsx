'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { totalPlayersAtom, totalRankedReplaysAtom, totalUnrankedReplaysAtom } from '@/app/state/atoms/tekkenStatsAtoms';

export default function GlobalStatsProvider() {
  const [, setTotalPlayers] = useAtom(totalPlayersAtom);
  const [, setTotalRankedReplays] = useAtom(totalRankedReplaysAtom);
  const [, setTotalUnrankedReplays] = useAtom(totalUnrankedReplaysAtom);

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
  }, [setTotalPlayers, setTotalRankedReplays, setTotalUnrankedReplays]);

  return null;
}
