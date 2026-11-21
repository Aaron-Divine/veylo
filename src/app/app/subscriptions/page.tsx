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
  PauseCircle,
  PlayCircle,
  Check,
  AlertTriangle,
  Calendar,
} from "lucide-react";

export default function SubscriptionsPage() {
  const { currentUser, userSubscriptions, revokeMandate, syncLiveAccount } = useAccount();
  const [selectedSubForToggle, setSelectedSubForToggle] = useState<SubscriptionMandate | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionDone, setActionDone] = useState(false);
  const [targetAction, setTargetAction] = useState<"pause" | "resume">("pause");

  const handleOpenToggleModal = (sub: SubscriptionMandate, action: "pause" | "resume") => {
    setSelectedSubForToggle(sub);
    setTargetAction(action);
    setActionDone(false);
  };

  const handleConfirmToggle = async () => {
    if (!selectedSubForToggle) return;
    setIsUpdating(true);
    try {
      await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: targetAction,
          mandate_id: selectedSubForToggle.mandateReference || selectedSubForToggle.id,
        }),
      });

      if (targetAction === "pause") {
        revokeMandate(selectedSubForToggle.id);
      }
      if (syncLiveAccount) {
        await syncLiveAccount(currentUser.veyloAccountNumber.replace(/\s+/g, ""));
      }

      setActionDone(true);
    } catch {
      // ignore
    } finally {
      setIsUpdating(false);
    }
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
            <span className="text-xs font-mono text-slate-500 uppercase">Consumer Sovereign Control</span>
            <p className="text-3xl font-black font-mono text-emerald-600">Pause &amp; Resume</p>
            <p className="text-xs text-slate-500">Pause anytime to decline merchant debits instantly</p>
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
                Pause a mandate here to decline automatic charges. Like an empty bank account, the merchant will continue to decline until you press resume.
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
                const isPaused = sub.status === "revoked" || sub.status === "paused";
                return (
                  <div
                    key={sub.id}
                    className={`py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors rounded-xl px-3 ${
                      isPaused ? "bg-amber-50/40" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isPaused
                            ? "bg-amber-100 text-amber-800"
                            : "bg-midnight-950 text-acid-lime"
                        }`}
                      >
                        {sub.merchantName.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-midnight-950">{sub.merchantName}</p>
                          <Badge
                            variant={isPaused ? "danger" : "lime"}
                            size="sm"
                            dot={!isPaused}
                          >
                            {isPaused ? "Paused by User" : "Active Mandate"}
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

                      {!isPaused ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenToggleModal(sub, "pause")}
                          className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 hover:border-amber-300"
                          leftIcon={<PauseCircle className="w-3.5 h-3.5" />}
                        >
                          Pause Mandate
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenToggleModal(sub, "resume")}
                          leftIcon={<PlayCircle className="w-3.5 h-3.5" />}
                        >
                          Resume Mandate
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Mandate Pause/Resume Modal */}
        <Modal
          isOpen={!!selectedSubForToggle}
          onClose={() => setSelectedSubForToggle(null)}
          title={
            actionDone
              ? targetAction === "pause" ? "Mandate Paused" : "Mandate Resumed"
              : targetAction === "pause" ? "Pause Open Payments Mandate" : "Resume Open Payments Mandate"
          }
          subtitle={
            actionDone
              ? targetAction === "pause"
                ? "Merchant transfers will now decline until you press resume"
                : "Future recurring transfers will now succeed normally"
              : `Confirm state change for ${selectedSubForToggle?.merchantName}`
          }
        >
          {selectedSubForToggle && (
            <div className="space-y-6">
              {!actionDone ? (
                <>
                  <div className={`rounded-2xl p-4 space-y-2 text-xs ${targetAction === "pause" ? "bg-amber-50 border border-amber-200 text-amber-900" : "bg-emerald-50 border border-emerald-200 text-emerald-900"}`}>
                    <div className="flex items-center gap-2 font-bold">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{targetAction === "pause" ? "Interledger Transfer Block" : "Interledger Transfer Unblock"}</span>
                    </div>
                    <p className="leading-relaxed">
                      {targetAction === "pause"
                        ? `Pausing mandate ${selectedSubForToggle.mandateReference} will immediately block recurring pulls from ${selectedSubForToggle.merchantName}. Like having zero funds, future debits will decline until you resume.`
                        : `Resuming mandate ${selectedSubForToggle.mandateReference} will allow ${selectedSubForToggle.merchantName} to resume recurring billing.`}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setSelectedSubForToggle(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={targetAction === "pause" ? "danger" : "primary"}
                      size="md"
                      onClick={handleConfirmToggle}
                      isLoading={isUpdating}
                      className="flex-1"
                    >
                      {targetAction === "pause" ? "Confirm Pause" : "Confirm Resume"}
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
                      {selectedSubForToggle.merchantName} {targetAction === "pause" ? "Paused" : "Resumed"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {targetAction === "pause"
                        ? "Merchant recurring debits will decline until you resume."
                        : "Mandate is now active and recurring debits will process."}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setSelectedSubForToggle(null)}
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
