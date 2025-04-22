'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { totalPlayersAtom, totalReplaysAtom } from '@/app/state/atoms/tekkenStatsAtoms';

export default function GlobalStatsProvider() {
  const [, setTotalPlayers] = useAtom(totalPlayersAtom);
  const [, setTotalReplays] = useAtom(totalReplaysAtom);

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
  }, [setTotalPlayers, setTotalReplays]);

  return null;
}