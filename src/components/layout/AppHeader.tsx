"use client";

import React from "react";
import { Menu, Bell, ShieldCheck, QrCode } from "lucide-react";
import { MOCK_USER } from "@/data/mockData";
import { Button } from "@/components/ui/Button";

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
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 md:px-8 backdrop-blur-md">
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
          <h1 className="text-lg md:text-xl font-bold text-midnight-950 font-sans tracking-tight">
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
            leftIcon={<QrCode className="w-3.5 h-3.5 text-midnight-900" />}
            className="hidden sm:inline-flex"
          >
            My QR
          </Button>
        )}

        {/* Network status pill */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-medium text-slate-700">
            Open Payments • Live
          </span>
        </div>

        {/* Account balance quick display */}
        <div className="hidden lg:flex flex-col text-right pr-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Available Funds
          </span>
          <span className="text-xs font-bold text-midnight-950 font-mono">
            ₦{(MOCK_USER.availableBalanceNgn).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Verified User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-electric-cobalt/10 text-electric-cobalt flex items-center justify-center font-bold text-xs ring-1 ring-electric-cobalt/30">
            TA
          </div>
        </div>
      </div>
    </header>
  );
};
