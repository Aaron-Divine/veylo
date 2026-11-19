"use client";

import React, { useState } from "react";
import { AppLayoutClient } from "@/components/layout/AppLayoutClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAccount } from "@/context/AccountContext";
import { Transaction } from "@/types";
import {
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Download,
  Share2,
} from "lucide-react";

export default function ActivityPage() {
  const { currentUser, userTransactions } = useAccount();
  const [filter, setFilter] = useState<string>("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(
    userTransactions.length > 0 ? userTransactions[0] : null
  );
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filteredTransactions = userTransactions.filter((tx) => {
    if (filter === "transfers") return tx.category === "transfer";
    if (filter === "subscriptions") return tx.category === "subscription";
    if (filter === "international") return tx.destinationType === "international_bank";
    if (filter === "deposits") return tx.category === "deposit";
    return true;
  });

  const handleDownloadReceipt = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <AppLayoutClient
      title="Activity & Transactions"
      subtitle={`Complete Ledger of Transfers, Subscriptions, and Interledger Settlements for ${currentUser.name}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Transactions List */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="white" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
              {[
                { id: "all", label: "All Activity" },
                { id: "transfers", label: "Transfers" },
                { id: "international", label: "International" },
                { id: "subscriptions", label: "Subscriptions" },
                { id: "deposits", label: "Deposits" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filter === f.id
                      ? "bg-midnight-950 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-600">No activity in this category</p>
                  <p>Send a transfer from the Send Money page to see real-time updates.</p>
                </div>
              ) : (
                filteredTransactions.map((tx) => {
                  const isSelected = selectedTx?.id === tx.id;
                  return (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? "bg-electric-cobalt/5 ring-1 ring-electric-cobalt"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            tx.category === "deposit"
                              ? "bg-emerald-50 text-emerald-700"
                              : tx.destinationType === "international_bank"
                              ? "bg-electric-cobalt/10 text-electric-cobalt"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {tx.category === "deposit" ? (
                            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-midnight-950">{tx.title}</p>
                          <p className="text-xs text-slate-500 font-mono">
                            {tx.destinationBankOrProvider} • {tx.timestamp}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`font-mono font-bold text-sm ${
                            tx.category === "deposit" ? "text-emerald-600" : "text-midnight-950"
                          }`}
                        >
                          {tx.category === "deposit" ? "+" : "-"}₦
                          {tx.amountNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                        </p>
                        <Badge variant="success" size="sm">
                          Settled
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Slide-out Drawer / Detail Panel */}
        <div className="lg:col-span-5">
          {selectedTx ? (
            <div className="sticky top-24 rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 space-y-6 text-left">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <Badge variant="success" size="sm" dot>
                    Settled on Clearing Rail
                  </Badge>
                  <h3 className="text-xl font-black font-sans text-midnight-950 mt-2">
                    ₦{selectedTx.amountNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedTx.reference}</p>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Destination Category Pill */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Destination Type:</span>
                <span className="font-mono font-bold uppercase text-midnight-950">
                  {selectedTx.destinationType.replace("_", " ")}
                </span>
              </div>

              {/* Metadata Breakdown */}
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Beneficiary Name</span>
                  <span className="font-bold text-slate-900">{selectedTx.recipientName}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Beneficiary Identifier</span>
                  <span className="text-slate-800">{selectedTx.recipientIdentifier}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Receiving Bank / Provider</span>
                  <span className="text-slate-800">{selectedTx.destinationBankOrProvider}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Source Funding Rail</span>
                  <span className="text-slate-800">{selectedTx.sourceFunding}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Veylo Transaction Fee</span>
                  <span className="text-slate-800">
                    ₦{selectedTx.feeNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {selectedTx.interledgerPacketId && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-sans">ILP Packet Hash</span>
                    <span className="text-electric-cobalt truncate max-w-[160px]">
                      {selectedTx.interledgerPacketId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-sans">Execution Timestamp</span>
                  <span className="text-slate-800">{selectedTx.timestamp}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownloadReceipt}
                  className="w-full justify-center"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  {downloadSuccess ? "PDF Receipt Generated!" : "Download PDF Receipt"}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full justify-center"
                  leftIcon={<Share2 className="w-4 h-4" />}
                >
                  Share Transfer Proof
                </Button>
              </div>
            </div>
          ) : (
            <Card variant="slate" className="text-center py-12 text-slate-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Select a transaction</p>
              <p className="text-xs text-slate-400">Click any row on the left to inspect its full routing metadata</p>
            </Card>
          )}
        </div>
      </div>
    </AppLayoutClient>
  );
}
