'use server'

import { fetchVersionedStatistics } from '@/lib/api-config';
import type { StatisticsPageResponse } from '@/app/state/types/StatisticsPageTypes';

export async function getVersionStatistics(
  gameVersion: number
): Promise<StatisticsPageResponse> {
  try {
    const data = await fetchVersionedStatistics(gameVersion);
    return data;
  } catch (error) {
    console.error('Error fetching version statistics:', error);
    throw new Error('Failed to fetch statistics data');
  }
}
