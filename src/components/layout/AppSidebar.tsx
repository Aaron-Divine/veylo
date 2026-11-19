"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Send,
  Globe2,
  UserCheck,
  Repeat,
  PieChart,
  Clock,
  Film,
  Building2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Shield,
} from "lucide-react";
import { VeyloLogo } from "@/components/brand/VeyloLogo";
import { MOCK_USER } from "@/data/mockData";

export const AppSidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();

  const mainNavItems = [
    { label: "Dashboard", href: "/app", icon: LayoutDashboard },
    { label: "Send to Bank / Veylo", href: "/app/send", icon: Send },
    { label: "International Transfer", href: "/app/send/international", icon: Globe2 },
    { label: "Account & Identity", href: "/app/account", icon: UserCheck },
    { label: "Subscriptions", href: "/app/subscriptions", icon: Repeat, badge: "4 Active" },
    { label: "Budgets & Limits", href: "/app/budgets", icon: PieChart },
    { label: "Activity & History", href: "/app/activity", icon: Clock },
  ];

  const demoNavItems = [
    { label: "Reelroom Checkout", href: "/demo/reelroom", icon: Film },
    { label: "Checkout Architecture", href: "/demo/checkout-architecture", icon: Shield },
    { label: "Veylo Business Portal", href: "/business", icon: Building2 },
  ];

  const sidebarContent = (
    <div className="flex h-full w-64 flex-col justify-between bg-midnight-950 p-4 text-slate-300 border-r border-midnight-900/80">
      {/* Top Section: Brand + Navigation */}
      <div className="space-y-6">
        {/* Brand header */}
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <VeyloLogo variant="dark" size="sm" href="/app" />
          <span className="text-[10px] font-mono uppercase tracking-wider bg-midnight-800 text-acid-lime border border-midnight-700 px-2 py-0.5 rounded-full font-bold">
            Portal
          </span>
        </div>

        {/* User Card */}
        <div className="rounded-xl bg-midnight-900/90 border border-midnight-800 p-3 flex items-center gap-3">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MOCK_USER.avatarUrl}
              alt={MOCK_USER.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-electric-cobalt/40"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-acid-lime rounded-full border-2 border-midnight-900 flex items-center justify-center">
              <CheckCircle2 className="w-2.5 h-2.5 text-midnight-950" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-white truncate">{MOCK_USER.name}</p>
            </div>
            <p className="text-[11px] font-mono text-acid-lime tracking-wide truncate">
              {MOCK_USER.veyloAccountNumber}
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Finance & Controls
          </div>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-electric-cobalt text-white shadow-sm shadow-electric-cobalt/20"
                    : "text-slate-400 hover:text-white hover:bg-midnight-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-acid-lime"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-midnight-900/60 text-acid-lime"
                        : "bg-midnight-800 text-acid-lime"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Demo Section */}
        <div className="space-y-1 pt-2 border-t border-midnight-900">
          <div className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Interledger Demos
          </div>
          {demoNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-midnight-800 text-white font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-midnight-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-electric-cobalt" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Connected Funding Bank Card */}
      <div className="pt-4 border-t border-midnight-900">
        <div className="rounded-xl bg-midnight-900/80 border border-midnight-800/80 p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Connected Funding Bank
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>GTBank</span>
            <span className="text-slate-400 font-normal">••6789</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            {MOCK_USER.connectedBank.accountHolder}
          </div>
          <div className="pt-1 flex items-center justify-between text-[10px] text-electric-cobalt font-medium">
            <span>Direct Open Payments Link</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:flex shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-midnight-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
