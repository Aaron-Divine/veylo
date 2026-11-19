"use client";

import React, { useState } from "react";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useAccount } from "@/context/AccountContext";
import { SubscriptionMandate } from "@/types";
import {
  Repeat,
  Trash2,
  Check,
  AlertTriangle,
  Calendar,
} from "lucide-react";

export default function SubscriptionsPage() {
  const { currentUser, userSubscriptions, revokeMandate } = useAccount();
  const [selectedSubForRevoke, setSelectedSubForRevoke] = useState<SubscriptionMandate | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [revokedSuccess, setRevokedSuccess] = useState(false);

  const handleOpenRevokeModal = (sub: SubscriptionMandate) => {
    setSelectedSubForRevoke(sub);
    setRevokedSuccess(false);
  };

  const handleConfirmRevoke = () => {
    if (!selectedSubForRevoke) return;
    setIsRevoking(true);
    setTimeout(() => {
      setIsRevoking(false);
      setRevokedSuccess(true);
      revokeMandate(selectedSubForRevoke.id);
    }, 700);
  };

  const activeCount = userSubscriptions.filter((s) => s.status === "active").length;
  const totalMonthlySpend = userSubscriptions
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + s.amountNgn, 0);

  return (
    <AppLayoutClient
      title="Recurring Subscriptions & Mandates"
      subtitle={`Open Payments Pre-Authorized Pull Mandates for ${currentUser.name}`}
    >
      <div className="space-y-8">
        {/* Header Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="white" className="space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">Active Mandates</span>
            <p className="text-3xl font-black font-mono text-midnight-950">
              {activeCount} Subscriptions
            </p>
            <p className="text-xs text-slate-500">Authorized via Open Payments protocol</p>
          </Card>

          <Card variant="white" className="space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">Monthly Commitment</span>
            <p className="text-3xl font-black font-mono text-electric-cobalt">
              ₦{totalMonthlySpend.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500">Auto-debited from {currentUser.connectedBank.bankName}</p>
          </Card>

          <Card variant="white" className="space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">Revocation Rights</span>
            <p className="text-3xl font-black font-mono text-emerald-600">100% Control</p>
            <p className="text-xs text-slate-500">Revoke anytime without contacting the merchant</p>
          </Card>
        </div>

        {/* Mandates Table / List */}
        <Card variant="white" className="space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-midnight-950">
                Connected Merchant Mandates
              </h2>
              <p className="text-xs text-slate-500">
                Unlike cards, Open Payments mandates cannot bill amounts above your authorized ceiling.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {userSubscriptions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No active subscriptions for this persona.
              </div>
            ) : (
              userSubscriptions.map((sub) => {
                const isRevoked = sub.status === "revoked";
                return (
                  <div
                    key={sub.id}
                    className={`py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors rounded-xl px-3 ${
                      isRevoked ? "bg-slate-50/60 opacity-60" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isRevoked
                            ? "bg-slate-200 text-slate-500"
                            : "bg-midnight-950 text-acid-lime"
                        }`}
                      >
                        {sub.merchantName.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-midnight-950">{sub.merchantName}</p>
                          <Badge
                            variant={isRevoked ? "danger" : "lime"}
                            size="sm"
                            dot={!isRevoked}
                          >
                            {isRevoked ? "Revoked" : "Active Mandate"}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">{sub.planName}</p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
                          <span>Mandate: {sub.mandateReference}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Next: {sub.nextBillingDate}
                          </span>
                          <span>•</span>
                          <span className="text-electric-cobalt">{sub.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 pl-16 md:pl-0">
                      <div className="text-right">
                        <p className="font-mono font-bold text-lg text-midnight-950">
                          ₦{sub.amountNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                          <span className="text-xs font-normal text-slate-500"> /mo</span>
                        </p>
                        {sub.foreignAmount && (
                          <p className="text-xs font-mono text-slate-400">
                            ({sub.foreignAmount} {sub.foreignCurrency})
                          </p>
                        )}
                      </div>

                      {!isRevoked ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRevokeModal(sub)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200"
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Revoke
                        </Button>
                      ) : (
                        <span className="text-xs font-mono text-rose-500 font-bold px-3 py-1 bg-rose-50 rounded-lg">
                          Terminated
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Mandate Revocation Modal */}
        <Modal
          isOpen={!!selectedSubForRevoke}
          onClose={() => setSelectedSubForRevoke(null)}
          title={revokedSuccess ? "Mandate Cryptographically Terminated" : "Revoke Open Payments Mandate"}
          subtitle={
            revokedSuccess
              ? "The merchant can no longer charge your account"
              : `Confirm termination of ${selectedSubForRevoke?.merchantName}`
          }
        >
          {selectedSubForRevoke && (
            <div className="space-y-6">
              {!revokedSuccess ? (
                <>
                  <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 space-y-2 text-xs text-rose-900">
                    <div className="flex items-center gap-2 font-bold text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Immediate Interledger Revocation</span>
                    </div>
                    <p className="leading-relaxed">
                      Revoking mandate <strong className="font-mono">{selectedSubForRevoke.mandateReference}</strong> will immediately delete the cryptographic grant on the Open Payments network. Any future recurring charge requests from <strong>{selectedSubForRevoke.merchantName}</strong> will be rejected at the protocol level.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Merchant:</span>
                      <span className="font-bold text-slate-900">{selectedSubForRevoke.merchantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Plan:</span>
                      <span>{selectedSubForRevoke.planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Amount:</span>
                      <span className="font-bold text-midnight-950">
                        ₦{selectedSubForRevoke.amountNgn.toLocaleString()} NGN
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setSelectedSubForRevoke(null)}
                      className="flex-1"
                    >
                      Keep Subscription
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      onClick={handleConfirmRevoke}
                      isLoading={isRevoking}
                      className="flex-1"
                    >
                      Confirm Revocation
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 py-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-midnight-950">
                      {selectedSubForRevoke.merchantName} Revoked
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Mandate grant {selectedSubForRevoke.mandateReference} has been deleted.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setSelectedSubForRevoke(null)}
                    className="w-full justify-center"
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AppLayoutClient>
  );
}
