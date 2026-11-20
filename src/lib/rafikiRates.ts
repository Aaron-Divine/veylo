/**
 * Rafiki Rates and Conversion Service
 * ------------------------------------
 * Reference implementation based on Interledger Rafiki:
 * https://github.com/interledger/rafiki
 *
 * Specific packages implemented:
 * - packages/backend/src/rates/service.ts (RatesService)
 * - packages/backend/src/rates/util.ts (convertDestination, convertSource)
 * - packages/backend/src/open_payments/quote/ (Open Payments Quote structure)
 */

export interface Asset {
  code: string;
  scale: number;
}

export interface Rates {
  base: string;
  rates: Record<string, number>;
  source?: string;
  timestamp?: string;
}

export interface ConvertDestinationOptions {
  exchangeRate: number;
  destinationAmount: bigint;
  sourceAsset: Asset;
  destinationAsset: Asset;
}

export interface ConvertSourceOptions {
  exchangeRate: number;
  sourceAmount: bigint;
  sourceAsset: Asset;
  destinationAsset: Asset;
}

export interface ConvertResults {
  amount: bigint;
  scaledExchangeRate: number;
}

/**
 * Conforms directly to Rafiki's `convertSource` in:
 * packages/backend/src/rates/util.ts
 */
export function convertSource(opts: ConvertSourceOptions): ConvertResults {
  const scaleDiff = opts.destinationAsset.scale - opts.sourceAsset.scale;
  const scaledExchangeRate = opts.exchangeRate * 10 ** scaleDiff;

  return {
    amount: BigInt(Math.floor(Number(opts.sourceAmount) * scaledExchangeRate)),
    scaledExchangeRate,
  };
}

/**
 * Conforms directly to Rafiki's `convertDestination` in:
 * packages/backend/src/rates/util.ts
 *
 * Calculates the exact source amount needed to deliver a fixed destination amount.
 */
export function convertDestination(opts: ConvertDestinationOptions): ConvertResults {
  const scaleDiff = opts.destinationAsset.scale - opts.sourceAsset.scale;
  const scaledExchangeRate = opts.exchangeRate * 10 ** scaleDiff;

  return {
    amount: BigInt(Math.ceil(Number(opts.destinationAmount) / scaledExchangeRate)),
    scaledExchangeRate,
  };
}

// ── In-Memory Rates Cache (mimics Rafiki's CacheDataStore) ───────────────────
interface CachedRates {
  data: Rates;
  expiresAt: number;
}

const ratesCache: Map<string, CachedRates> = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds (Rafiki default exchangeRatesLifetime)

// Fallback rates if external rates endpoint is temporarily unreachable
const FALLBACK_RATES: Record<string, Record<string, number>> = {
  USD: {
    USD: 1.0,
    NGN: 1450.0,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.36,
  },
  NGN: {
    NGN: 1.0,
    USD: 1 / 1450.0,
    EUR: 0.92 / 1450.0,
    GBP: 0.79 / 1450.0,
  },
};

/**
 * Fetches current exchange rates conforming to Rafiki's RatesService.
 * Uses Rafiki's EXCHANGE_RATES_URL or public high-availability feed.
 */
export async function getExchangeRates(base = 'USD'): Promise<Rates> {
  const normalizedBase = base.toUpperCase();
  const cached = ratesCache.get(normalizedBase);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  // 1. Check if custom EXCHANGE_RATES_URL is set (Rafiki standard env var)
  const ratesUrl =
    process.env.EXCHANGE_RATES_URL ||
    `https://open.er-api.com/v6/latest/${normalizedBase}`;

  try {
    const res = await fetch(ratesUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      const rawRates: Record<string, number> = data.rates || {};

      // Ensure base is self-mapped to 1.0
      rawRates[normalizedBase] = 1.0;

      const ratesPayload: Rates = {
        base: normalizedBase,
        rates: rawRates,
        source: 'Interledger Rafiki Rates Service',
        timestamp: new Date().toISOString(),
      };

      ratesCache.set(normalizedBase, {
        data: ratesPayload,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      return ratesPayload;
    }
  } catch (err) {
    console.warn('[RafikiRates] Failed to fetch external rates, using fallback:', err);
  }

  // Fallback
  const fallback = FALLBACK_RATES[normalizedBase] || FALLBACK_RATES.USD;
  return {
    base: normalizedBase,
    rates: fallback,
    source: 'Interledger Rafiki Fallback Rates',
    timestamp: new Date().toISOString(),
  };
}

export interface RafikiQuoteResult {
  sourceAsset: Asset;
  destinationAsset: Asset;
  destinationAmount: number;
  debitAmountNgn: number;
  debitAmountBigInt: bigint;
  exchangeRate: number; // Rate in NGN per 1 unit of destination currency (e.g. 1 USD = ~1450 NGN)
  scaledExchangeRate: number;
}

/**
 * Calculates a complete Interledger Rafiki conversion quote.
 *
 * Example:
 * Course price: 69.00 USD
 * Wallet: NGN (scale 2)
 *
 * Returns debitAmountNgn: ~₦100,050.00
 */
export async function calculateRafikiQuote(params: {
  destinationAmount: number; // e.g. 69.00
  destinationCurrency: string; // e.g. 'USD'
  sourceCurrency?: string; // default 'NGN'
}): Promise<RafikiQuoteResult> {
  const { destinationAmount, destinationCurrency, sourceCurrency = 'NGN' } = params;

  const destCode = destinationCurrency.toUpperCase();
  const srcCode = sourceCurrency.toUpperCase();

  const sourceAsset: Asset = { code: srcCode, scale: 2 };
  const destinationAsset: Asset = { code: destCode, scale: 2 };

  // If same currency, 1:1
  if (srcCode === destCode) {
    const amountBigInt = BigInt(Math.round(destinationAmount * 100));
    return {
      sourceAsset,
      destinationAsset,
      destinationAmount,
      debitAmountNgn: destinationAmount,
      debitAmountBigInt: amountBigInt,
      exchangeRate: 1.0,
      scaledExchangeRate: 1.0,
    };
  }

  // Fetch rates with base = destination currency (e.g. base = USD)
  const rates = await getExchangeRates(destCode);
  const ngnPerUnit = rates.rates[srcCode] || FALLBACK_RATES.USD.NGN;

  // In Rafiki terms:
  // Source is NGN, Destination is USD
  // rate NGN -> USD is (1 / ngnPerUnit)
  const exchangeRateNgnToDest = 1 / ngnPerUnit;

  const destinationAmountBigInt = BigInt(Math.round(destinationAmount * 10 ** destinationAsset.scale));

  const result = convertDestination({
    exchangeRate: exchangeRateNgnToDest,
    destinationAmount: destinationAmountBigInt,
    sourceAsset,
    destinationAsset,
  });

  const debitAmountNgn = Number(result.amount) / 10 ** sourceAsset.scale;

  return {
    sourceAsset,
    destinationAsset,
    destinationAmount,
    debitAmountNgn: Math.round(debitAmountNgn * 100) / 100,
    debitAmountBigInt: result.amount,
    exchangeRate: ngnPerUnit,
    scaledExchangeRate: result.scaledExchangeRate,
  };
}
