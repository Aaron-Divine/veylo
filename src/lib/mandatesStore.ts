import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

export interface StoredMandate {
  id: string;
  userId: string;
  accountNumber: string;
  merchantName: string;
  merchantLogo?: string;
  mandateReference: string;
  planName: string;
  amountNgn: number;
  foreignAmount?: number;
  foreignCurrency?: string;
  frequency: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: string;
  category: string;
  status: 'active' | 'revoked' | 'paused';
  createdDate: string;
  paymentProtocol: 'Open Payments Interledger';
}

const MANDATES_FILE = path.join(process.env.VERCEL ? '/tmp' : process.cwd(), 'veylo-mandates.json');

declare global {
  // eslint-disable-next-line no-var
  var __veylo_mandates_cache: Map<string, StoredMandate> | undefined;
}

if (!global.__veylo_mandates_cache) {
  global.__veylo_mandates_cache = new Map<string, StoredMandate>();
}

const memoryCache = global.__veylo_mandates_cache;

function loadFromFile(): void {
  try {
    if (fs.existsSync(MANDATES_FILE)) {
      const content = fs.readFileSync(MANDATES_FILE, 'utf-8');
      const items: StoredMandate[] = JSON.parse(content || '[]');
      items.forEach((m) => memoryCache.set(m.id, m));
    }
  } catch (e) {
    // ignore
  }
}

function saveToFile(): void {
  try {
    const items = Array.from(memoryCache.values());
    fs.writeFileSync(MANDATES_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (e) {
    // ignore
  }
}

// Initial load
loadFromFile();

export function saveMandate(mandate: StoredMandate): StoredMandate {
  memoryCache.set(mandate.id, mandate);
  saveToFile();
  return mandate;
}

export function getAllMandates(): StoredMandate[] {
  loadFromFile();
  return Array.from(memoryCache.values());
}

export function getMandatesByAccount(accountNumber: string): StoredMandate[] {
  loadFromFile();
  const clean = accountNumber.replace(/\s+/g, '');
  return Array.from(memoryCache.values()).filter(
    (m) => m.accountNumber.replace(/\s+/g, '') === clean || m.userId.includes(clean)
  );
}

export function getMandateByReference(reference: string): StoredMandate | null {
  loadFromFile();
  const clean = reference.trim();
  const found = Array.from(memoryCache.values()).find(
    (m) => m.mandateReference === clean || m.id === clean
  );
  return found || null;
}

export function revokeMandate(mandateIdOrRef: string): StoredMandate | null {
  return updateMandateStatus(mandateIdOrRef, 'paused');
}

export function pauseMandate(mandateIdOrRef: string): StoredMandate | null {
  return updateMandateStatus(mandateIdOrRef, 'paused');
}

export function resumeMandate(mandateIdOrRef: string): StoredMandate | null {
  return updateMandateStatus(mandateIdOrRef, 'active');
}

export function updateMandateStatus(mandateIdOrRef: string, status: 'active' | 'paused' | 'revoked'): StoredMandate | null {
  loadFromFile();
  const clean = mandateIdOrRef.trim();
  for (const [id, m] of memoryCache.entries()) {
    if (m.id === clean || m.mandateReference === clean) {
      m.status = status;
      memoryCache.set(id, m);
      saveToFile();
      // Asynchronously persist to Supabase
      persistMandateStatusToDb(m.mandateReference, status, m.accountNumber).catch(() => {});
      return m;
    }
  }
  // Even if not in local cache, persist status to Supabase so other serverless instances know
  persistMandateStatusToDb(clean, status).catch(() => {});
  return null;
}

export async function persistMandateStatusToDb(
  mandateRef: string,
  status: 'active' | 'paused' | 'revoked',
  accountNumber?: string
): Promise<void> {
  try {
    let fromAccountId: string | null = null;
    if (accountNumber) {
      const { data: acc } = await supabase
        .from('veylo_accounts')
        .select('id')
        .eq('account_number', accountNumber.replace(/\s+/g, ''))
        .maybeSingle();
      if (acc) fromAccountId = acc.id;
    }
    if (!fromAccountId) {
      const { data: anyAcc } = await supabase.from('veylo_accounts').select('id').limit(1).maybeSingle();
      if (anyAcc) fromAccountId = anyAcc.id;
    }

    if (!fromAccountId) return;

    await supabase.from('veylo_transactions').insert({
      reference: `mandate_status_${mandateRef.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`,
      from_account_id: fromAccountId,
      amount_ngn: 0,
      fee_ngn: 0,
      currency: 'NGN',
      description: `MANDATE_STATUS:${mandateRef}:${status}`,
      status: status,
      external_reference: mandateRef,
    });
  } catch (e) {
    // silently ignore errors
  }
}

export async function checkMandateStatusFromDb(mandateRef: string): Promise<'active' | 'paused' | 'revoked' | null> {
  try {
    const clean = mandateRef.trim();
    const { data } = await supabase
      .from('veylo_transactions')
      .select('status')
      .eq('external_reference', clean)
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0 && data[0].status) {
      const st = data[0].status as 'active' | 'paused' | 'revoked';
      if (st === 'paused' || st === 'revoked' || st === 'active') {
        return st;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}
