'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { totalPlayersAtom, totalReplaysAtom } from '@/app/state/atoms/tekkenStatsAtoms';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY;

async function fetchStatsSummary() {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics/stats-summary`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Cache-Control': 'no-store'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch global stats:', error);
    return null;
  }
}

export default function GlobalStatsProvider() {
  const [, setTotalPlayers] = useAtom(totalPlayersAtom);
  const [, setTotalReplays] = useAtom(totalReplaysAtom);

  useEffect(() => {
    let mounted = true;

    const initializeStats = async () => {
      const stats = await fetchStatsSummary();
      
      if (mounted && stats) {
        setTotalPlayers(stats.totalPlayers);
        setTotalReplays(stats.totalReplays);
      }
    };

    // Only run on client-side
    if (typeof window !== 'undefined') {
      initializeStats();
    }

    return () => {
      mounted = false;
    };
  }, [setTotalPlayers, setTotalReplays]);

  return null;
}
