import { NextRequest, NextResponse } from 'next/server';
import { fetchStatistics } from '@/lib/api-config';

// eslint-disable-next-line
export async function GET(request: NextRequest) {
  try {
      const data = await fetchStatistics('stats-summary');
      return NextResponse.json(data);
  } catch (error) {
    console.error('Statistics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics data' },
      { status: 500 }
    );
  }
}
