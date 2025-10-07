// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchPlayersServer } from '@/lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query || query.length < 3) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 });
  }

  try {
    const results = await searchPlayersServer(query);
    
    // Ensure results is an array
    if (!Array.isArray(results)) {
      console.error('Invalid search results format:', results);
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    // Validate each result has required fields for the new PlayerSearchDTO structure
    const validResults = results.filter(result => 
      result && 
      typeof result === 'object' && 
      'polarisId' in result && 
      'name' in result &&
      'region' in result &&
      'mainChar' in result &&
      'lastSeen' in result &&
      typeof result.isBanned === 'boolean' &&
      typeof result.isVerified === 'boolean' &&
      typeof result.isDonor === 'boolean'
    );

    return NextResponse.json(validResults);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 }
    );
  }
}
