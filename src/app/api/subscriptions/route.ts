import { NextRequest, NextResponse } from 'next/server';
import {
  saveMandate,
  getAllMandates,
  getMandatesByAccount,
  revokeMandate,
  StoredMandate,
} from '@/lib/mandatesStore';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const accountNumber = (searchParams.get('account_number') || '').replace(/\s+/g, '');

    const mandates = accountNumber ? getMandatesByAccount(accountNumber) : getAllMandates();

    return NextResponse.json(
      { status: 'success', subscriptions: mandates },
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    return NextResponse.json(
      { status: 'failed', message: 'Failed to retrieve subscriptions', details: String(err) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'create';

    // ── REVOKE MANDATE ────────────────────────────────────────────────────────
    if (action === 'revoke') {
      const mandateId = body.mandate_id || body.id;
      if (!mandateId) {
        return NextResponse.json(
          { status: 'failed', message: 'mandate_id is required to revoke' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      const revoked = revokeMandate(mandateId);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Open Payments recurring mandate revoked successfully. Future automatic transfers stopped.',
          mandate_id: mandateId,
          subscription: revoked,
        },
        { headers: CORS_HEADERS }
      );
    }

    // ── CREATE MANDATE ────────────────────────────────────────────────────────
    const {
      account_number,
      merchant_name = 'Learnify',
      plan_name = 'Premium Learning Community',
      amount_ngn = 25705.67,
      foreign_amount = 19.0,
      foreign_currency = 'USD',
      frequency = 'monthly',
      mandate_reference,
    } = body;

    const cleanAccount = (account_number || '').replace(/\s+/g, '');
    if (!cleanAccount) {
      return NextResponse.json(
        { status: 'failed', message: 'account_number is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const ref = mandate_reference || `MAN-LRN-${Date.now().toString(36).toUpperCase()}`;
    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const mandate: StoredMandate = {
      id,
      userId: `usr_${cleanAccount}`,
      accountNumber: cleanAccount,
      merchantName: merchant_name,
      merchantLogo: '🎓',
      mandateReference: ref,
      planName: plan_name,
      amountNgn: Number(amount_ngn),
      foreignAmount: Number(foreign_amount),
      foreignCurrency: foreign_currency,
      frequency,
      nextBillingDate: nextMonth.toISOString().split('T')[0],
      category: 'Education & Community',
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      paymentProtocol: 'Open Payments Interledger',
    };

    saveMandate(mandate);

    return NextResponse.json(
      {
        status: 'success',
        message: 'Open Payments recurring mandate registered successfully.',
        subscription: mandate,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    return NextResponse.json(
      { status: 'failed', message: 'Failed to process subscription mandate', details: String(err) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
