import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { getAccountByNumber } from '@/lib/veyloDb';

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
      email?: string;
      pin?: string;
    };

    try {
      body = await req.json();
    } catch {
      return corsJson({ status: 'failed', code: 'INVALID_BODY', message: 'Request body must be valid JSON.' }, 400);
    }

    const { account_number, email, pin } = body;

    if (!pin || typeof pin !== 'string') {
      return corsJson({ status: 'failed', code: 'MISSING_PIN', message: 'PIN is required.' }, 400);
    }

    let account = null;

    if (account_number && typeof account_number === 'string') {
      account = await getAccountByNumber(account_number);
    } else if (email && typeof email === 'string') {
      const { data } = await supabase
        .from('veylo_accounts')
        .select('*')
        .eq('owner_email', email.trim().toLowerCase())
        .eq('is_active', true)
        .single();
      account = data;
    }

    if (!account) {
      return corsJson({
        status: 'failed',
        code: 'ACCOUNT_NOT_FOUND',
        message: 'No active Veylo account found for the provided details.'
      }, 404);
    }

    // Verify PIN with bcrypt
    const pinValid = await bcrypt.compare(pin.trim(), account.pin_hash);
    if (!pinValid) {
      return corsJson({
        status: 'failed',
        code: 'INCORRECT_PIN',
        message: 'Incorrect PIN. Please try again.'
      }, 401);
    }

    return corsJson({
      status: 'success',
      message: 'Login successful.',
      account: {
        id: account.id,
        account_number: account.account_number,
        owner_name: account.owner_name,
        owner_email: account.owner_email,
        balance_ngn: account.balance_ngn,
        currency: account.currency,
        is_active: account.is_active,
        created_at: account.created_at,
      }
    });
  } catch (err) {
    console.error('[/api/auth/login] Error:', err);
    return corsJson({ status: 'failed', code: 'SERVER_ERROR', message: 'Internal server error.' }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
