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
  ArrowRight,
  UserCheck,
  Phone,
  Mail,
  Lock,
  Coins,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { setCustomUser } = useAccount();

  // All inputs start completely blank with soft placeholders
  const [fullName, setFullName] = useState("");
  const [walletSlug, setWalletSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Success state after account is registered in Supabase
  const [createdAccount, setCreatedAccount] = useState<{
    account_number: string;
    balance_ngn: number;
    owner_name: string;
    owner_email: string;
    wallet_address?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg("Please enter your name or username.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!pin.trim() || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setErrorMsg("Please create exactly a 4-digit numeric PIN.");
      return;
    }

    setIsLoading(true);

    try {
      const chosenSlug = (walletSlug || fullName).toLowerCase().replace(/[^a-z0-9_-]/g, "");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          wallet_name: chosenSlug,
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          pin: pin.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success" || !data.account) {
        setErrorMsg(data.message || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      const acc = data.account;
      setCreatedAccount(acc);

      // Convert to UserProfile and update AccountContext
      const formattedAcc = acc.account_number.length === 10
        ? `${acc.account_number.slice(0, 3)} ${acc.account_number.slice(3, 6)} ${acc.account_number.slice(6)}`
        : acc.account_number;

      const userProfile: UserProfile = {
        id: `usr_${acc.id}`,
        name: acc.owner_name,
        email: acc.owner_email,
        handle: `@${acc.owner_name.toLowerCase().replace(/\s+/g, "")}`,
        role: "consumer",
        veyloAccountNumber: formattedAcc,
        isVerified: true,
        location: "Lagos, Nigeria",
        openPaymentsAddress: acc.wallet_address || `$ilp-veylowallet-${chosenSlug}`,
        connectedBank: {
          bankName: "Veylo Simulated Bank",
          accountNumber: "••" + acc.account_number.slice(-4),
          accountHolder: acc.owner_name,
          currency: "NGN",
          status: "connected",
        },
        totalBalanceNgn: acc.balance_ngn || 0,
        availableBalanceNgn: acc.balance_ngn || 0,
        currency: "NGN",
      };

      setCustomUser(userProfile);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Register error:", err);
      setErrorMsg("Network error connecting to Veylo service.");
      setIsLoading(false);
    }
  };

  const formatDisplayNumber = (num: string) => {
    const raw = num.replace(/\D/g, "");
    if (raw.length === 10) {
      return `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
    }
    return num;
  };

  const copyToClipboard = () => {
    if (!createdAccount) return;
    navigator.clipboard.writeText(formatDisplayNumber(createdAccount.account_number));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-sans">
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-6">
        <VeyloLogo variant="light" size="sm" href="/" />
      </header>

      <main className="max-w-md mx-auto w-full my-auto">
        {createdAccount ? (
          /* SUCCESS STATE: Display newly created Account Number & instructions */
          <Card variant="white" className="p-8 sm:p-10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-midnight-950 font-sans">
                Account &amp; Wallet Created!
              </h1>
              <p className="text-xs text-slate-500">
                Your unique 10-digit Veylo Account Number has been assigned to your Open Payments wallet address.
              </p>
            </div>

            {/* Account Card Display */}
            <div className="p-5 rounded-2xl bg-midnight-950 text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-acid-lime font-bold">
                  Your 10-Digit Account Number
                </span>
                <span className="text-[10px] font-mono text-slate-400">Portable Identity</span>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-white">
                  {formatDisplayNumber(createdAccount.account_number)}
                </span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg bg-electric-cobalt text-white hover:bg-electric-cobalt/80 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Copy account number"
                >
                  {copied ? <Check className="w-4 h-4 text-acid-lime" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-midnight-900 border border-midnight-800 text-xs">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Assigned Wallet Address</span>
                <span className="font-mono text-acid-lime font-bold text-xs break-all">
                  {createdAccount.wallet_address || `$ilp-veylowallet-${createdAccount.owner_name.toLowerCase().replace(/[^a-z0-9_-]/g, "")}`}
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Account Holder</span>
                  <span className="font-semibold text-white">{createdAccount.owner_name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Security PIN</span>
                  <span className="font-mono text-acid-lime font-bold">4-Digit Hashed</span>
                </div>
              </div>
            </div>

            {/* Deposit notice callout */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1.5">
              <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Next Step: Deposit Test Funds</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Log into your dashboard to deposit simulated funds in any world currency (USD, EUR, GBP, NGN) converted with live Rafiki FX rates.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/app")}
                className="w-full justify-center"
              >
                Go to Veylo Dashboard
              </Button>
            </div>
          </Card>
        ) : (
          /* REGISTRATION FORM */
          <Card variant="white" className="p-8 sm:p-10 shadow-xl space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl font-black font-sans text-midnight-950">
                Open your Veylo Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Get an instant 10-digit interoperable payment account and wallet PIN.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name or Username"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="username or full name"
                required
                leftAddon={<UserCheck className="w-4 h-4 text-slate-400" />}
              />

              <div className="space-y-1">
                <Input
                  label="Wallet Address Name"
                  value={walletSlug}
                  onChange={(e) => setWalletSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  placeholder="e.g. aaron, divine, tomi"
                  leftAddon={<span className="text-xs font-mono font-bold text-electric-cobalt">$</span>}
                  helperText={`Your wallet address will be: $ilp-veylowallet-${walletSlug || "yourname"}`}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                leftAddon={<Mail className="w-4 h-4 text-slate-400" />}
              />

              <Input
                label="Phone Number (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="phone number e.g. +234..."
                leftAddon={<Phone className="w-4 h-4 text-slate-400" />}
              />

              <Input
                label="Create 4-Digit Wallet PIN"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="4-digit secret PIN"
                maxLength={4}
                required
                leftAddon={<Lock className="w-4 h-4 text-slate-400" />}
                helperText="4 numeric digits required to authorize debits and course purchases"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full justify-center pt-3"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Veylo Account
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-electric-cobalt font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </Card>
        )}
      </main>

      <footer className="max-w-md mx-auto w-full text-center text-xs text-slate-400">
        © 2026 Veylo Inc. Connected to Open Payments.
      </footer>
    </div>
  );
}
