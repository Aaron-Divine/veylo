import { NextRequest, NextResponse } from 'next/server';
import { getAccountByNumber, creditAccount, createTransaction, getWalletAddress, getDisplayName } from '@/lib/veyloDb';
import { calculateRafikiQuote } from '@/lib/rafikiRates';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    let body: {
      account_number?: string;
      amount?: number;
      currency?: string;
    };

    try {
      body = await req.json();
    } catch {
      return corsJson({ status: 'failed', code: 'INVALID_BODY', message: 'Request body must be valid JSON.' }, 400);
    }

    const { account_number, amount, currency = 'NGN' } = body;

    if (!account_number || typeof account_number !== 'string') {
      return corsJson({ status: 'failed', code: 'MISSING_FIELD', message: 'account_number is required.' }, 400);
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return corsJson({ status: 'failed', code: 'INVALID_AMOUNT', message: 'amount must be a positive number.' }, 400);
    }

    const account = await getAccountByNumber(account_number);
    if (!account) {
      return corsJson({ status: 'failed', code: 'ACCOUNT_NOT_FOUND', message: 'No active Veylo account found.' }, 404);
    }

    const depCurrency = currency.toUpperCase().trim();
    let creditedNgn = amount;
    let rateUsed = 1.0;

    // Use Interledger Rafiki Rates Engine for currency conversion
    if (depCurrency !== 'NGN') {
      const quote = await calculateRafikiQuote({
        destinationAmount: amount,
        destinationCurrency: depCurrency,
        sourceCurrency: 'NGN',
      });
      creditedNgn = quote.debitAmountNgn;
      rateUsed = quote.exchangeRate;
    }

    // Update account balance in Supabase
    const newBalance = await creditAccount(account.id, creditedNgn);
    if (newBalance === null) {
      return corsJson({ status: 'failed', code: 'DEPOSIT_FAILED', message: 'Could not credit wallet balance.' }, 500);
    }

    // Record settled transaction
    const ref = `vyl_dep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await createTransaction({
      reference: ref,
      from_account_id: account.id,
      amount_ngn: creditedNgn,
      currency: 'NGN',
      description: `Simulated Deposit of ${amount.toLocaleString('en-US')} ${depCurrency} via Rafiki FX`,
      status: 'settled',
    });

    return corsJson({
      status: 'success',
      message: `Deposit successful. Credited ₦${creditedNgn.toLocaleString('en-NG', { minimumFractionDigits: 2 })} NGN to your wallet pass.`,
      reference: ref,
      deposited_amount: amount,
      deposited_currency: depCurrency,
      credited_amount_ngn: creditedNgn,
      exchange_rate: rateUsed,
      new_balance_ngn: newBalance,
      protocol: 'Interledger Rafiki Rates Service',
    });
  } catch (err) {
    console.error('[/api/deposit] Error:', err);
    return corsJson({ status: 'failed', code: 'SERVER_ERROR', message: 'Internal server error.' }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
