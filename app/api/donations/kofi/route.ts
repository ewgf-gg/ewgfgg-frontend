import { NextRequest, NextResponse } from 'next/server';
import { IncomingKofiDonation, KofiWebhookPayload } from '@/app/state/types/KofiTypes';
import { getAPIConfig } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    // Ko-fi sends data as form-encoded
    const formData = await request.formData();
    const dataString = formData.get('data');

    if (!dataString || typeof dataString !== 'string') {
      console.error('Missing or invalid data field in Ko-fi webhook');
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // Parse the JSON string from Ko-fi
    let kofiData: IncomingKofiDonation;
    try {
      kofiData = JSON.parse(dataString);
    } catch (parseError) {
      console.error('Failed to parse Ko-fi data:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in webhook data' },
        { status: 400 }
      );
    }

    // Forward to Spring Boot backend
    const config = getAPIConfig();
    const backendUrl = `${config.baseURL}/donations/kofi`;

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(kofiData),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend forwarding failed:', {
        status: backendResponse.status,
        error: errorText,
      });
      return NextResponse.json(
        { error: 'Failed to forward donation to backend' },
        { status: backendResponse.status }
      );
    }

    const responseData = await backendResponse.json().catch(() => ({}));
    console.log('Successfully forwarded Ko-fi donation to backend');

    // Return success to Ko-fi
    return NextResponse.json(
      { success: true, message: 'Donation received and processed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing Ko-fi webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Ko-fi doesn't support GET, but we'll add it for testing
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Ko-fi webhook endpoint',
      method: 'POST',
      endpoint: '/api/donations/kofi'
    },
    { status: 200 }
  );
}
