import { NextRequest, NextResponse } from 'next/server';
import { calculateRafikiQuote } from '@/lib/rafikiRates';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amountStr = searchParams.get('amount') || '69';
    const destinationCurrency = searchParams.get('to') || searchParams.get('destination') || 'USD';
    const sourceCurrency = searchParams.get('from') || searchParams.get('source') || 'NGN';

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount parameter' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const quote = await calculateRafikiQuote({
      destinationAmount: amount,
      destinationCurrency,
      sourceCurrency,
    });

    const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return NextResponse.json(
      {
        id: quoteId,
        paymentType: 'outgoing',
        receiver: searchParams.get('receiver') || 'https://learnify-delta-six.vercel.app',
        debitAmount: {
          value: quote.debitAmountBigInt.toString(),
          amount: quote.debitAmountNgn,
          assetCode: quote.sourceAsset.code,
          assetScale: quote.sourceAsset.scale,
        },
        receiveAmount: {
          value: Math.round(amount * 10 ** quote.destinationAsset.scale).toString(),
          amount,
          assetCode: quote.destinationAsset.code,
          assetScale: quote.destinationAsset.scale,
        },
        estimatedExchangeRate: quote.exchangeRate,
        expiresAt: new Date(Date.now() + 60000).toISOString(),
        protocol: 'Interledger Rafiki Rates Engine',
      },
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to generate quote', details: String(err) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount || body.receiveAmount?.value ? (Number(body.receiveAmount.value) / 100) : 69);
    const destinationCurrency = body.destinationCurrency || body.receiveAmount?.assetCode || 'USD';
    const sourceCurrency = body.sourceCurrency || body.debitAmount?.assetCode || 'NGN';

    const quote = await calculateRafikiQuote({
      destinationAmount: amount,
      destinationCurrency,
      sourceCurrency,
    });

    const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return NextResponse.json(
      {
        id: quoteId,
        paymentType: 'outgoing',
        walletAddress: body.walletAddress,
        receiver: body.receiver,
        debitAmount: {
          value: quote.debitAmountBigInt.toString(),
          amount: quote.debitAmountNgn,
          assetCode: quote.sourceAsset.code,
          assetScale: quote.sourceAsset.scale,
        },
        receiveAmount: {
          value: Math.round(amount * 10 ** quote.destinationAsset.scale).toString(),
          amount,
          assetCode: quote.destinationAsset.code,
          assetScale: quote.destinationAsset.scale,
        },
        estimatedExchangeRate: quote.exchangeRate,
        expiresAt: new Date(Date.now() + 60000).toISOString(),
        protocol: 'Interledger Rafiki Rates Engine',
      },
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to process quote', details: String(err) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
