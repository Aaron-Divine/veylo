export type PaymentDestinationType = "veylo" | "nigerian_bank" | "international_bank";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  handle: string;
  veyloAccountNumber: string;
  isVerified: boolean;
  avatarUrl?: string;
  connectedBank: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    status: "connected" | "pending" | "disconnected";
  };
  totalBalanceNgn: number;
  availableBalanceNgn: number;
  currency: string;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
  country: string;
  currency: string;
  logoUrl?: string;
}

export interface BeneficiaryResolution {
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  isResolved: boolean;
  isVerified: boolean;
  destinationType: PaymentDestinationType;
  resolutionTimeMs?: number;
}

export interface InterledgerQuote {
  sourceAmountNgn: number;
  destinationAmount: number;
  destinationCurrency: "GBP" | "EUR" | "USD" | "NGN";
  exchangeRate: number; // e.g. 1 GBP = 2040 NGN
  veyloFeeNgn: number; // 2.0%
  partnerRailFeeNgn: number;
  networkType: "direct_ilp" | "local_clearing_partner";
  routePath: string[]; // ["Veylo Sender", "Interledger Connector (FX)", "Barclays Direct ILP"]
  estimatedDelivery: string; // e.g. "Instant (~3.8s)"
  quoteExpiresInSec: number;
}

export interface Transaction {
  id: string;
  title: string;
  destinationType: PaymentDestinationType;
  recipientName: string;
  recipientIdentifier: string; // Veylo ID, Acct Number, Sort Code + Acct
  destinationBankOrProvider: string;
  sourceFunding: string; // "Connected Bank Account: GTBank ••6789"
  amountNgn: number;
  destinationAmount?: number;
  destinationCurrency?: string;
  feeNgn: number;
  status: "settled" | "processing" | "failed" | "refunded";
  timestamp: string;
  reference: string;
  interledgerPacketId?: string;
  category: "transfer" | "subscription" | "merchant" | "deposit";
}

export interface SubscriptionMandate {
  id: string;
  merchantName: string;
  merchantLogo?: string;
  mandateReference: string; // e.g. "#OP-MND-9810"
  planName: string;
  amountNgn: number;
  foreignAmount?: number;
  foreignCurrency?: string;
  frequency: "monthly" | "yearly" | "weekly";
  nextBillingDate: string;
  category: string;
  status: "active" | "revoked" | "paused";
  createdDate: string;
  paymentProtocol: "Open Payments Interledger";
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocatedNgn: number;
  spentNgn: number;
  color: string;
  iconName: string;
}

export interface BudgetOverview {
  monthlyCeilingNgn: number;
  totalSpentNgn: number;
  remainingNgn: number;
  daysRemainingInMonth: number;
  categories: BudgetCategory[];
}
