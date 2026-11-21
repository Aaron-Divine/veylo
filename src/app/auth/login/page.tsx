"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VeyloLogo } from "@/components/brand/VeyloLogo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAccount } from "@/context/AccountContext";
import { UserProfile } from "@/types";
import {
  ShieldCheck,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Building2,
  Globe2,
  Lock,
  ArrowLeft,
  KeyRound,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { allUsers, switchUser, setCustomUser, testnetStatus } = useAccount();

  const [activeTab, setActiveTab] = useState<"account" | "demo">("account");

  // All fields start completely empty
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [authenticatingUserId, setAuthenticatingUserId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sign in with Real/Registered Account Number & PIN
  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanAcc = accountNumber.trim().replace(/\s+/g, "");
    const cleanPin = pin.trim();

    if (!cleanAcc) {
      setErrorMsg("Please enter your 10-digit Veylo Account Number or email.");
      return;
    }
    if (!cleanPin) {
      setErrorMsg("Please enter your 4-digit PIN.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: cleanAcc,
          pin: cleanPin,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success" || !data.account) {
        setErrorMsg(data.message || "Invalid account credentials. Please verify your Account Number and PIN.");
        setIsLoading(false);
        return;
      }

      const acc = data.account;
      const formattedAcc = acc.account_number.length === 10
        ? `${acc.account_number.slice(0, 3)} ${acc.account_number.slice(3, 6)} ${acc.account_number.slice(6)}`
        : acc.account_number;

      const userProfile: UserProfile = {
        id: `usr_${acc.id}`,
        name: acc.owner_name,
        email: acc.owner_email,
        handle: `@${acc.owner_name.toLowerCase().replace(/\s+/g, "")}`,
        role: "consumer",
        avatarUrl: acc.avatar_url || "/avatars/male.svg",
        veyloAccountNumber: formattedAcc,
        isVerified: true,
        location: "Lagos, Nigeria",
        openPaymentsAddress: acc.wallet_address || `$ilp-veylowallet-${acc.owner_name.toLowerCase().replace(/[^a-z0-9_-]/g, "")}`,
        connectedBank: {
          bankName: "Veylo Simulated Bank",
          accountNumber: "••" + acc.account_number.slice(-4),
          accountHolder: acc.owner_name,
          currency: "NGN",
          status: "connected",
        },
        totalBalanceNgn: acc.balance_ngn,
        availableBalanceNgn: acc.balance_ngn,
        currency: "NGN",
      };

      setCustomUser(userProfile);

      setTimeout(() => {
        router.push("/app");
      }, 400);
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg("Could not connect to Veylo server. Please check network.");
      setIsLoading(false);
    }
  };

  // Sign in with pre-configured demo account
  const handleSelectDemoAccount = (userId: string) => {
    setAuthenticatingUserId(userId);
    setErrorMsg(null);
    switchUser(userId);

    setTimeout(() => {
      router.push("/app");
    }, 500);
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
            <span>OPEN PAYMENTS AUTHENTICATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111B32] font-sans tracking-tight">
            Sign In to Veylo
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Enter your 10-digit Veylo Account Number and 4-digit PIN to access your wallet.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="max-w-md mx-auto flex p-1.5 bg-slate-200/80 rounded-2xl gap-1 mb-8 shadow-inner">
          <button
            onClick={() => { setActiveTab("account"); setErrorMsg(null); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "account"
                ? "bg-white text-midnight-950 shadow-sm"
                : "text-slate-600 hover:text-midnight-950"
            }`}
          >
            <KeyRound className="w-4 h-4 text-[#3D5BFF]" />
            <span>Account Login</span>
          </button>
          <button
            onClick={() => { setActiveTab("demo"); setErrorMsg(null); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "demo"
                ? "bg-white text-midnight-950 shadow-sm"
                : "text-slate-600 hover:text-midnight-950"
            }`}
          >
            <Users className="w-4 h-4 text-[#3D5BFF]" />
            <span>Demo Personas</span>
          </button>
        </div>

        {/* TAB 1: REAL ACCOUNT & PIN LOGIN */}
        {activeTab === "account" && (
          <div className="max-w-md mx-auto">
            <Card variant="white" className="p-8 shadow-xl space-y-6">
              <div className="space-y-1 text-center">
                <h3 className="text-lg font-bold text-[#111B32]">Sign In with Account Number</h3>
                <p className="text-xs text-slate-500">
                  Enter your unique 10-digit number and wallet PIN
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold animate-in fade-in">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleAccountLogin} className="space-y-4">
                <Input
                  label="10-Digit Account Number or Wallet Address"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 482 193 7604 or $ilp-veylowallet-..."
                  required
                  leftAddon={<UserCheck className="w-4 h-4 text-slate-400" />}
                  helperText="Your 10-digit number, wallet address ($ilp-veylowallet-...), or email"
                />

                <Input
                  label="4-Digit Wallet PIN"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="4-digit secret PIN"
                  maxLength={4}
                  required
                  leftAddon={<Lock className="w-4 h-4 text-slate-400" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full justify-center pt-3"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In to Wallet
                </Button>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Don&apos;t have an account yet?{" "}
                <Link href="/auth/register" className="text-[#3D5BFF] font-bold hover:underline">
                  Create & Fund Account
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: DEMO PERSONAS QUICK-SELECT */}
        {activeTab === "demo" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allUsers.slice(0, 5).map((user) => {
              const isSelected = authenticatingUserId === user.id;

              return (
                <div
                  key={user.id}
                  onClick={() => handleSelectDemoAccount(user.id)}
                  className={`p-6 rounded-2xl bg-white border transition-all cursor-pointer text-left flex flex-col justify-between gap-4 group ${
                    isSelected
                      ? "border-[#3D5BFF] ring-2 ring-[#3D5BFF]/30 shadow-md"
                      : "border-slate-200 hover:border-[#3D5BFF]/60 hover:shadow-lg"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold uppercase">
                        {user.role}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-midnight-950 text-base group-hover:text-[#3D5BFF] transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-xs font-mono text-slate-400">{user.handle}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Veylo Account</div>
                      <div className="font-mono font-bold text-midnight-950 text-sm tracking-wide">
                        {user.veyloAccountNumber}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-600">
                        Balance: ₦{user.totalBalanceNgn.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-center group-hover:bg-[#3D5BFF] group-hover:text-white transition-all text-xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Select Persona
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <p>© 2026 Veylo Inc. Connected to Open Payments Network.</p>
        <div className="flex items-center gap-4">
          <Link href="/auth/register" className="hover:text-slate-600 transition-colors">
            Register Account
          </Link>
        </div>
      </footer>
    </div>
  );
}
