import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAccountByNumber } from '@/lib/veyloDb';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const accountNumber = searchParams.get('account_number');

    if (!accountNumber) {
      return corsJson({ status: 'failed', code: 'MISSING_PARAM', message: 'account_number query param is required.' }, 400);
    }

    const account = await getAccountByNumber(accountNumber);
    if (!account) {
      return corsJson({ status: 'failed', code: 'ACCOUNT_NOT_FOUND', message: 'Account not found.' }, 404);
    }

    // Fetch transactions for this account from Supabase
    const { data: txns, error } = await supabase
      .from('veylo_transactions')
      .select('*')
      .or(`from_account_id.eq.${account.id},to_account_id.eq.${account.id}`)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('[/api/transactions] DB error:', error.message);
      return corsJson({ status: 'failed', code: 'DB_ERROR', message: 'Failed to fetch transactions.' }, 500);
    }

    return corsJson({
      status: 'success',
      account_number: account.account_number,
      transactions: txns || []
    });
  } catch (err) {
    console.error('[/api/transactions] Server error:', err);
    return corsJson({ status: 'failed', code: 'SERVER_ERROR', message: 'Internal server error.' }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
