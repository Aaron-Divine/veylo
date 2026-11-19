"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAccount } from "@/context/AccountContext";
import { Check, ChevronDown, User, RefreshCw, Globe2, Building2, Zap, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const AccountSwitcher: React.FC = () => {
  const { currentUser, allUsers, switchUser, testnetStatus, resetAllDemoData } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Active User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D5BFF]"
        title="Switch Demo Persona"
      >
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#10B981] rounded-full border border-white" />
        </div>

        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#111B32]">{currentUser.name}</span>
            <span className="text-[10px] font-mono font-bold uppercase text-[#3D5BFF] bg-[#3D5BFF]/10 px-1 rounded">
              {currentUser.role}
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-500">
            {currentUser.currency === "NGN"
              ? `₦${currentUser.availableBalanceNgn.toLocaleString("en-NG")}`
              : currentUser.currency === "GBP"
              ? `£${currentUser.foreignBalance?.amount.toLocaleString("en-GB")} (${currentUser.availableBalanceNgn.toLocaleString()} NGN)`
              : `€${currentUser.foreignBalance?.amount.toLocaleString("de-DE")} (${currentUser.availableBalanceNgn.toLocaleString()} NGN)`}
          </p>
        </div>

        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
            <div>
              <p className="text-xs font-bold text-[#111B32]">Switch Demo Persona (5 Accounts)</p>
              <p className="text-[10px] text-slate-500">
                Test transfers between personas with real-time balance updates
              </p>
            </div>
            <button
              onClick={() => {
                resetAllDemoData();
                setIsOpen(false);
              }}
              title="Reset balances & transactions"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Accounts List */}
          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {allUsers.map((user) => {
              const isSelected = user.id === currentUser.id;
              return (
                <div
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    setIsOpen(false);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#3D5BFF]/10 ring-1 ring-[#3D5BFF]"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-300"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-[#111B32] truncate">{user.name}</p>
                        <span className="text-[9px] font-mono font-bold uppercase text-[#3D5BFF] bg-[#3D5BFF]/10 px-1 rounded shrink-0">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-[#D8F15B] bg-[#111B32] px-1.5 py-0.2 rounded inline-block">
                        {user.veyloAccountNumber}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {user.connectedBank.bankName} • {user.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono font-bold text-[#111B32]">
                      {user.currency === "NGN"
                        ? `₦${(user.availableBalanceNgn).toLocaleString("en-NG")}`
                        : user.currency === "GBP"
                        ? `£${user.foreignBalance?.amount}`
                        : `€${user.foreignBalance?.amount}`}
                    </p>
                    {isSelected && <Check className="w-4 h-4 text-[#3D5BFF] ml-auto mt-1" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interledger Testnet Pill */}
          <div className="pt-2 border-t border-slate-100 px-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1 text-[#10B981] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Connected: wallet.interledger-test.dev
            </span>
            <span>{testnetStatus.latencyMs}ms</span>
          </div>
        </div>
      )}
    </div>
  );
};
