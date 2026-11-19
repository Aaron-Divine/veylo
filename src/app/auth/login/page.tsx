"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VeyloLogo } from "@/components/brand/VeyloLogo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAccount } from "@/context/AccountContext";
import {
  ShieldCheck,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Building2,
  Globe2,
  Fingerprint,
  Sparkles,
  ArrowLeft,
  Lock,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { allUsers, currentUser, switchUser, testnetStatus } = useAccount();

  const [activeTab, setActiveTab] = useState<"quick_select" | "manual">("quick_select");
  const [manualIdentifier, setManualIdentifier] = useState("");
  const [authenticatingUserId, setAuthenticatingUserId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sign in with selected demo account
  const handleSelectAccount = (userId: string) => {
    setAuthenticatingUserId(userId);
    setErrorMsg(null);
    switchUser(userId);

    setTimeout(() => {
      router.push("/app");
    }, 600);
  };

  // Sign in with manual input (resolve by account number or handle)
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanInput = manualIdentifier.trim().toLowerCase().replace(/\s+/g, "");
    if (!cleanInput) {
      setErrorMsg("Please enter your 10-digit Veylo Account Number or @handle");
      return;
    }

    const matchedUser = allUsers.find((u) => {
      const cleanAcc = u.veyloAccountNumber.replace(/\s+/g, "");
      const cleanHandle = u.handle.toLowerCase();
      return cleanAcc === cleanInput || cleanHandle === cleanInput || cleanHandle === `@${cleanInput}`;
    });

    if (matchedUser) {
      handleSelectAccount(matchedUser.id);
    } else {
      // Default fallback for demo flexibility
      handleSelectAccount("usr_tomi");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#3D5BFF] selection:text-white">
      {/* Top Navigation */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200/80">
        <VeyloLogo variant="light" size="sm" href="/" />

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] font-mono text-slate-700">
              ILP Testnet • {testnetStatus.latencyMs}ms
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-midnight-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="max-w-4xl mx-auto w-full my-8">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D5BFF]/10 text-xs font-mono font-bold text-[#3D5BFF]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CRYPTOGRAPHIC MULTI-ACCOUNT AUTHENTICATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111B32] font-sans tracking-tight">
            Sign In to Veylo
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Choose an account to sign in, or enter your 10-digit Veylo Account Number to authenticate via Passkey or Face ID.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="max-w-md mx-auto flex p-1.5 bg-slate-200/80 rounded-2xl gap-1 mb-8 shadow-inner">
          <button
            onClick={() => setActiveTab("quick_select")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "quick_select"
                ? "bg-white text-midnight-950 shadow-sm"
                : "text-slate-600 hover:text-midnight-950"
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#3D5BFF]" />
            <span>Demo Accounts (5)</span>
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "manual"
                ? "bg-white text-midnight-950 shadow-sm"
                : "text-slate-600 hover:text-midnight-950"
            }`}
          >
            <Fingerprint className="w-4 h-4 text-[#3D5BFF]" />
            <span>Manual Sign In</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: PREMIUM DEMO ACCOUNT SELECTOR (5 Accounts)
           ======================================================== */}
        {activeTab === "quick_select" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allUsers.map((user) => {
              const isSelected = authenticatingUserId === user.id;

              return (
                <div
                  key={user.id}
                  onClick={() => handleSelectAccount(user.id)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer text-left bg-white shadow-sm hover:shadow-md active:scale-[0.99] flex flex-col justify-between gap-4 group ${
                    isSelected
                      ? "border-[#3D5BFF] ring-2 ring-[#3D5BFF]/30 bg-[#3D5BFF]/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-[#3D5BFF] transition-all"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10B981] rounded-full border-2 border-white" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#111B32] group-hover:text-[#3D5BFF] transition-colors">
                            {user.name}
                          </h3>
                          <span className="text-[10px] font-mono font-bold uppercase text-[#3D5BFF] bg-[#3D5BFF]/10 px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {user.handle} • {user.location}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#111B32] bg-[#F1F5F9] px-2.5 py-1 rounded-lg shrink-0">
                      {user.currency === "NGN"
                        ? `₦${(user.availableBalanceNgn).toLocaleString("en-NG")}`
                        : user.currency === "GBP"
                        ? `£${user.foreignBalance?.amount.toLocaleString("en-GB")}`
                        : `€${user.foreignBalance?.amount.toLocaleString("de-DE")}`}
                    </span>
                  </div>

                  {/* Account Metadata Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="bg-[#111B32] text-[#D8F15B] px-2 py-0.5 rounded text-[11px] font-bold">
                        {user.veyloAccountNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">({user.connectedBank.bankName})</span>
                    </div>

                    <button
                      className={`inline-flex items-center gap-1 text-xs font-bold transition-colors ${
                        isSelected ? "text-[#3D5BFF]" : "text-slate-600 group-hover:text-[#3D5BFF]"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <span className="animate-spin w-3.5 h-3.5 border-2 border-[#3D5BFF] border-t-transparent rounded-full" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================
            TAB 2: MANUAL ACCOUNT NUMBER & PASSKEY FORM
           ======================================================== */}
        {activeTab === "manual" && (
          <div className="max-w-md mx-auto">
            <Card variant="white" className="p-8 shadow-xl space-y-6">
              <div className="space-y-1 text-center">
                <h3 className="text-lg font-bold text-[#111B32]">Manual Credentials</h3>
                <p className="text-xs text-slate-500">
                  Enter any 10-digit account number (e.g. 482 193 7604) or verified handle
                </p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <Input
                  label="10-Digit Account Number or @handle"
                  value={manualIdentifier}
                  onChange={(e) => setManualIdentifier(e.target.value)}
                  placeholder="e.g. 482 193 7604 or @tomiade"
                  leftAddon={<UserCheck className="w-4 h-4 text-slate-400" />}
                  error={errorMsg || undefined}
                  helperText="Tip: Enter any demo number or handle"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={authenticatingUserId !== null}
                  className="w-full justify-center"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Authorize with Passkey / Face ID
                </Button>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Don&apos;t have a Veylo account yet?{" "}
                <Link href="/auth/register" className="text-[#3D5BFF] font-bold hover:underline">
                  Claim Account Number
                </Link>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <p>© 2026 Veylo Inc. Connected to Open Payments Network.</p>
        <div className="flex items-center gap-4">
          <Link href="/demo/checkout-architecture" className="hover:text-slate-600 transition-colors">
            Protocol Security
          </Link>
          <Link href="/business" className="hover:text-slate-600 transition-colors">
            Merchant Portal
          </Link>
        </div>
      </footer>
    </div>
  );
}
