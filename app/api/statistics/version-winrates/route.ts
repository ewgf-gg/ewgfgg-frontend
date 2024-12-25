import { NextResponse } from 'next/server';
import { fetchStatistics } from '../../../../lib/api-config';

export async function GET() {
  try {
    const data = await fetchStatistics('version-winrates');
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
