"use client";

import React from "react";
import { Menu, QrCode, LogOut } from "lucide-react";
import { useAccount } from "@/context/AccountContext";
import { Button } from "@/components/ui/Button";
import { AccountSwitcher } from "./AccountSwitcher";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  onOpenQrModal?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  onOpenQrModal,
}) => {
  const { currentUser, testnetStatus } = useAccount();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white/95 px-4 md:px-8 backdrop-blur-md">
      {/* Left title and hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-[#111B32] font-sans tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {onOpenQrModal && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenQrModal}
            leftIcon={<QrCode className="w-3.5 h-3.5 text-[#111B32]" />}
            className="hidden sm:inline-flex"
          >
            My QR
          </Button>
        )}

        {/* Live Interledger Testnet Status Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[11px] font-mono font-medium text-slate-700">
            ILP Testnet • {testnetStatus.latencyMs}ms
          </span>
        </div>

        {/* Dynamic Demo Persona Switcher (5 Accounts) */}
        <AccountSwitcher />

        {/* Sign Out Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.href = "/auth/login";
          }}
          leftIcon={<LogOut className="w-3.5 h-3.5 text-slate-500" />}
          className="hidden sm:inline-flex text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
};
