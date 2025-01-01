import { NextRequest, NextResponse } from 'next/server';
import { fetchPlayerData } from '../../../../lib/api-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { polarisId: string } }
) {
  try {
    const data = await fetchPlayerData(params.polarisId);
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
