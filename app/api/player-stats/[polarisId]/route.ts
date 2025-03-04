import { NextRequest, NextResponse } from 'next/server';
import { fetchPlayerData } from '../../../../lib/api-config';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { polarisId: string } }
) {
  // Set cache control headers to prevent caching
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
  try {
    const data = await fetchPlayerData(params.polarisId);
    return NextResponse.json(data, { headers });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers }
    );
  }
}
