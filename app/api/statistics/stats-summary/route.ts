import { NextResponse } from 'next/server';
import { fetchStatistics } from '@/lib/api-config';

export async function GET() {
  try {
    const data = await fetchStatistics('stats-summary');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stats summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
