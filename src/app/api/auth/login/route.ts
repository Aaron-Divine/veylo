import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { getAccountByIdentifier, getWalletAddress, getDisplayName } from '@/lib/veyloDb';

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
      identifier?: string;
      pin?: string;
    };

    try {
      body = await req.json();
    } catch {
      return corsJson({ status: 'failed', code: 'INVALID_BODY', message: 'Request body must be valid JSON.' }, 400);
    }

    const { account_number, email, identifier, pin } = body;
    const lookupKey = (identifier || account_number || email || '').trim();

    if (!pin || typeof pin !== 'string') {
      return corsJson({ status: 'failed', code: 'MISSING_PIN', message: '4-digit PIN is required.' }, 400);
    }

    if (!lookupKey) {
      return corsJson({ status: 'failed', code: 'MISSING_IDENTIFIER', message: 'Account number, wallet address, or email is required.' }, 400);
    }

    const account = await getAccountByIdentifier(lookupKey);

    if (!account) {
      return corsJson({
        status: 'failed',
        code: 'ACCOUNT_NOT_FOUND',
        message: 'No active Veylo account found for the provided details.'
      }, 404);
    }

    // Verify 4-digit PIN with bcrypt
    const pinValid = await bcrypt.compare(pin.trim(), account.pin_hash);
    if (!pinValid) {
      return corsJson({
        status: 'failed',
        code: 'INCORRECT_PIN',
        message: 'Incorrect PIN. Please try again.'
      }, 401);
    }

    const walletAddress = getWalletAddress(account);
    const displayName = getDisplayName(account.owner_name);

    return corsJson({
      status: 'success',
      message: 'Login successful.',
      account: {
        id: account.id,
        account_number: account.account_number,
        wallet_address: walletAddress,
        owner_name: displayName,
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
