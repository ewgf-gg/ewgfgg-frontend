'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { totalPlayersAtom, totalReplaysAtom, totalUnrankedReplaysAtom } from '@/app/state/atoms/tekkenStatsAtoms';

export default function GlobalStatsProvider() {
  const [, setTotalPlayers] = useAtom(totalPlayersAtom);
  const [, setTotalReplays] = useAtom(totalReplaysAtom);
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
          setTotalReplays(stats.totalReplays);
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
  }, [setTotalPlayers, setTotalReplays, setTotalUnrankedReplays]);

  return null;
}
