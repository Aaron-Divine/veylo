"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  Transaction,
  SubscriptionMandate,
  PaymentDestinationType,
  InterledgerNetworkStatus,
} from "@/types";
import {
  DEMO_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  MOCK_SUBSCRIPTIONS,
  INTERLEDGER_TESTNET_STATUS,
} from "@/data/mockData";
import { generateIlpPreparePacket } from "@/lib/interledger";

interface AccountContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  switchUser: (userId: string) => void;
  transactions: Transaction[];
  userTransactions: Transaction[];
  subscriptions: SubscriptionMandate[];
  userSubscriptions: SubscriptionMandate[];
  testnetStatus: InterledgerNetworkStatus;
  sendPayment: (params: {
    recipientIdentifier: string;
    recipientName: string;
    amountNgn: number;
    destinationType: PaymentDestinationType;
    destinationBankOrProvider: string;
    destinationAmount?: number;
    destinationCurrency?: string;
  }) => { success: boolean; reference: string; packetId: string };
  revokeMandate: (mandateId: string) => void;
  resetAllDemoData: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(DEMO_ACCOUNTS);
  const [currentUserId, setCurrentUserId] = useState<string>("usr_tomi");
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionMandate[]>(MOCK_SUBSCRIPTIONS);
  const [testnetStatus, setTestnetStatus] = useState<InterledgerNetworkStatus>(
    INTERLEDGER_TESTNET_STATUS
  );

  // Load persisted demo state from localStorage on client mount if available
  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem("veylo_current_user_id");
      if (savedUserId && DEMO_ACCOUNTS.some((u) => u.id === savedUserId)) {
        setCurrentUserId(savedUserId);
      }
      const savedUsers = localStorage.getItem("veylo_users_state");
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedTx = localStorage.getItem("veylo_transactions_state");
      if (savedTx) setTransactions(JSON.parse(savedTx));

      const savedSubs = localStorage.getItem("veylo_subscriptions_state");
      if (savedSubs) setSubscriptions(JSON.parse(savedSubs));
    } catch (e) {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("veylo_current_user_id", currentUserId);
      localStorage.setItem("veylo_users_state", JSON.stringify(users));
      localStorage.setItem("veylo_transactions_state", JSON.stringify(transactions));
      localStorage.setItem("veylo_subscriptions_state", JSON.stringify(subscriptions));
    } catch (e) {
      // Ignore
    }
  }, [currentUserId, users, transactions, subscriptions]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    if (users.some((u) => u.id === userId)) {
      setCurrentUserId(userId);
    }
  };

  const userTransactions = transactions.filter((t) => t.userId === currentUserId);
  const userSubscriptions = subscriptions.filter((s) => s.userId === currentUserId);

  /**
   * Executes an atomic transfer:
   * - Debits current user's balance + 2% Veylo fee
   * - Records outgoing transaction in sender's ledger
   * - If recipient is one of the 5 demo accounts, credits their balance and records incoming transaction in their ledger!
   */
  const sendPayment = ({
    recipientIdentifier,
    recipientName,
    amountNgn,
    destinationType,
    destinationBankOrProvider,
    destinationAmount,
    destinationCurrency = "NGN",
  }: {
    recipientIdentifier: string;
    recipientName: string;
    amountNgn: number;
    destinationType: PaymentDestinationType;
    destinationBankOrProvider: string;
    destinationAmount?: number;
    destinationCurrency?: string;
  }) => {
    const feeNgn = amountNgn * 0.02; // 2.0% Veylo Fee
    const totalDebitNgn = amountNgn + feeNgn;
    const reference = `VYL-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const packet = generateIlpPreparePacket({
      amountNgn,
      sourceAccount: currentUser.veyloAccountNumber,
      destinationAddress: recipientIdentifier,
    });

    const nowStr = "Just now";

    // Normalize identifier and name for flexible matching across all 5 demo accounts
    const cleanId = recipientIdentifier.trim().toLowerCase().replace(/[\s\-\•]/g, "");
    const cleanName = recipientName.trim().toLowerCase();

    // 1. Check if recipient matches any of the demo accounts
    const matchedRecipient = users.find((u) => {
      if (u.id === currentUser.id) return false;
      const uAcc = u.veyloAccountNumber.replace(/[\s\-\•]/g, "").toLowerCase();
      const uHandle = u.handle.toLowerCase().replace("@", "");
      const uName = u.name.toLowerCase();
      const uBankAcc = u.connectedBank.accountNumber.replace(/[\s\-\•]/g, "").toLowerCase();
      const uOp = u.openPaymentsAddress.toLowerCase();

      return (
        uAcc === cleanId ||
        cleanId.includes(uAcc) ||
        uHandle === cleanId ||
        cleanId.includes(uHandle) ||
        cleanName.includes(uName) ||
        uName.includes(cleanName) ||
        (cleanId.length >= 4 && uBankAcc.includes(cleanId)) ||
        (cleanId.length >= 4 && cleanId.includes(uBankAcc)) ||
        cleanId.includes(uOp) ||
        uOp.includes(cleanId)
      );
    });

    // 2. Outgoing transaction for sender
    const senderTx: Transaction = {
      id: `tx_${Date.now()}_send`,
      userId: currentUser.id,
      title: `Transfer to ${recipientName}`,
      destinationType,
      recipientName,
      recipientIdentifier,
      destinationBankOrProvider,
      sourceFunding: `Connected Bank: ${currentUser.connectedBank.bankName} (${currentUser.connectedBank.accountNumber})`,
      amountNgn,
      destinationAmount,
      destinationCurrency,
      feeNgn,
      status: "settled",
      timestamp: nowStr,
      reference,
      interledgerPacketId: packet.packetId,
      category: "transfer",
    };

    // 3. Incoming transaction for recipient if internal demo user
    const recipientTx: Transaction | null = matchedRecipient
      ? {
          id: `tx_${Date.now()}_recv`,
          userId: matchedRecipient.id,
          title: `Received from ${currentUser.name}`,
          destinationType: "veylo",
          recipientName: currentUser.name,
          recipientIdentifier: currentUser.veyloAccountNumber,
          destinationBankOrProvider: matchedRecipient.connectedBank.bankName,
          sourceFunding: `Veylo Account: ${currentUser.name} (${currentUser.veyloAccountNumber})`,
          amountNgn,
          destinationAmount,
          destinationCurrency,
          feeNgn: 0,
          status: "settled",
          timestamp: nowStr,
          reference,
          interledgerPacketId: packet.packetId,
          category: "deposit",
        }
      : null;

    // 4. Update state for both sender and recipient
    setUsers((prevUsers) => {
      const updated = prevUsers.map((u) => {
        if (u.id === currentUser.id) {
          const updatedForeign = u.foreignBalance
            ? {
                ...u.foreignBalance,
                amount: Math.max(
                  0,
                  u.foreignBalance.amount - (destinationAmount || amountNgn / (u.currency === "GBP" ? 2040 : 2200))
                ),
              }
            : undefined;

          return {
            ...u,
            totalBalanceNgn: Math.max(0, u.totalBalanceNgn - totalDebitNgn),
            availableBalanceNgn: Math.max(0, u.availableBalanceNgn - totalDebitNgn),
            foreignBalance: updatedForeign,
          };
        }
        if (matchedRecipient && u.id === matchedRecipient.id) {
          const creditedForeign = u.foreignBalance
            ? {
                ...u.foreignBalance,
                amount:
                  u.foreignBalance.amount +
                  (destinationAmount || amountNgn / (u.currency === "GBP" ? 2040 : 2200)),
              }
            : undefined;

          return {
            ...u,
            totalBalanceNgn: u.totalBalanceNgn + amountNgn,
            availableBalanceNgn: u.availableBalanceNgn + amountNgn,
            foreignBalance: creditedForeign,
          };
        }
        return u;
      });

      try {
        localStorage.setItem("veylo_users_state", JSON.stringify(updated));
      } catch (e) {}

      return updated;
    });

    setTransactions((prev) => {
      const updated = [senderTx, ...(recipientTx ? [recipientTx] : []), ...prev];
      try {
        localStorage.setItem("veylo_transactions_state", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    return {
      success: true,
      reference,
      packetId: packet.packetId,
    };
  };

  const revokeMandate = (mandateId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === mandateId ? { ...s, status: "revoked" } : s))
    );
  };

  const resetAllDemoData = () => {
    setUsers(DEMO_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSubscriptions(MOCK_SUBSCRIPTIONS);
    setCurrentUserId("usr_tomi");
    try {
      localStorage.clear();
    } catch (e) {
      // Ignore
    }
  };

  return (
    <AccountContext.Provider
      value={{
        currentUser,
        allUsers: users,
        switchUser,
        transactions,
        userTransactions,
        subscriptions,
        userSubscriptions,
        testnetStatus,
        sendPayment,
        revokeMandate,
        resetAllDemoData,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
