import { NextResponse } from 'next/server';

export const runtime = "nodejs"

function buildBiteshipUrl(input: string, countries: string, type: string) {
  const baseUrl = 'https://api.biteship.com/v1/maps/areas';
  const params = new URLSearchParams({
    countries,
    input,
    type,
  });
  return `${baseUrl}?${params.toString()}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const input = searchParams.get('input') ?? '';
    const countries = searchParams.get('countries') ?? 'ID';
    const type = searchParams.get('type') ?? 'single';

    const targetUrl = buildBiteshipUrl(input, countries, type);
    const biteshipResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Authorization: process.env.BITESHIP_API_KEY ?? '',
        Accept: 'application/json',
      },
    });

    if (!biteshipResponse.ok) {
      const errorBody = await biteshipResponse.text();
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Failed to fetch area data from Biteship',
          details: errorBody,
        }),
        { status: biteshipResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await biteshipResponse.json();

    if (data.success) {
      const areas = data.areas ?? [];
      return new NextResponse(
        JSON.stringify({ success: true, areas }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch area data from Biteship',
        details: (data as any).message ?? 'Unknown error',
      }),
      { status: biteshipResponse.status, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in area-search proxy:', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
