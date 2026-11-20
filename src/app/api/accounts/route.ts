import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { getAccountByNumber } from '@/lib/veyloDb';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

function requireApiKey(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  return token === process.env.VEYLO_API_KEY;
}

function generateAccountNumber(): string {
  // Generate a random 10-digit number
  return String(Math.floor(1000000000 + Math.random() * 9000000000));
}

/**
 * POST /api/accounts — Create a new Veylo account.
 * Body: { name: string; email: string; initial_balance_ngn?: number }
 */
export async function POST(req: NextRequest) {
  if (!requireApiKey(req)) {
    return corsJson({ status: 'failed', code: 'UNAUTHORIZED', message: 'Invalid or missing API key.' }, 401);
  }

  let body: { name?: string; email?: string; initial_balance_ngn?: number };
  try {
    body = await req.json();
  } catch {
    return corsJson({ status: 'failed', code: 'INVALID_BODY', message: 'Request body must be valid JSON.' }, 400);
  }

  const { name, email, initial_balance_ngn = 0 } = body;

  if (!name || typeof name !== 'string') {
    return corsJson({ status: 'failed', code: 'MISSING_FIELD', message: 'name is required.' }, 400);
  }
  if (!email || typeof email !== 'string') {
    return corsJson({ status: 'failed', code: 'MISSING_FIELD', message: 'email is required.' }, 400);
  }

  // Hash the default PIN "000000"
  const defaultPin = '000000';
  const pinHash = await bcrypt.hash(defaultPin, 10);

  // Generate unique account number (retry once if collision)
  let accountNumber = generateAccountNumber();
  for (let attempt = 0; attempt < 3; attempt++) {
    const existing = await getAccountByNumber(accountNumber);
    if (!existing) break;
    accountNumber = generateAccountNumber();
  }

  const { data, error } = await supabase
    .from('veylo_accounts')
    .insert({
      account_number: accountNumber,
      pin_hash: pinHash,
      balance_ngn: initial_balance_ngn,
      owner_name: name,
      owner_email: email,
    })
    .select('id, account_number, balance_ngn, owner_name, owner_email, currency, is_active, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return corsJson({ status: 'failed', code: 'EMAIL_EXISTS', message: 'An account with that email already exists.' }, 409);
    }
    console.error('[/api/accounts POST] DB error:', error.message);
    return corsJson({ status: 'failed', code: 'SERVER_ERROR', message: 'Could not create account.' }, 500);
  }

  return corsJson({
    status: 'success',
    message: 'Account created. Default PIN is 000000 — user must change it.',
    account: data,
  }, 201);
}

/**
 * GET /api/accounts?number=4821937604 — Get account info by number.
 */
export async function GET(req: NextRequest) {
  if (!requireApiKey(req)) {
    return corsJson({ status: 'failed', code: 'UNAUTHORIZED', message: 'Invalid or missing API key.' }, 401);
  }

  const { searchParams } = new URL(req.url);
  const accountNumber = searchParams.get('number');

  if (!accountNumber) {
    return corsJson({ status: 'failed', code: 'MISSING_PARAM', message: 'Query param ?number= is required.' }, 400);
  }

  const account = await getAccountByNumber(accountNumber);
  if (!account) {
    return corsJson({ status: 'failed', code: 'ACCOUNT_NOT_FOUND', message: 'No active account found.' }, 404);
  }

  return corsJson({
    status: 'success',
    account: {
      id: account.id,
      account_number: account.account_number,
      owner_name: account.owner_name,
      owner_email: account.owner_email,
      balance_ngn: account.balance_ngn,
      currency: account.currency,
      is_active: account.is_active,
      created_at: account.created_at,
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
