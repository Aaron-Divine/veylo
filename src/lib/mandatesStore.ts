import fs from 'fs';
import path from 'path';

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
      return m;
    }
  }
  return null;
}
