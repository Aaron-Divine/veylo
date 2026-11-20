import { NextRequest, NextResponse } from 'next/server';
import { getExchangeRates } from '@/lib/rafikiRates';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const base = searchParams.get('base') || 'USD';

    const rates = await getExchangeRates(base);

    return NextResponse.json(rates, { headers: CORS_HEADERS });
  } catch (err) {
    return NextResponse.json(
      { error: 'Could not fetch rates', details: String(err) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
