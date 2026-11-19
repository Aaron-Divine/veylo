import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "lime" | "cobalt" | "midnight" | "slate" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "slate",
  size = "md",
  className = "",
  dot = false,
}) => {
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1 font-semibold",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
  };

  const variantStyles = {
    lime: "bg-acid-lime/20 text-midnight-900 border border-acid-lime/40",
    cobalt: "bg-electric-cobalt/10 text-electric-cobalt border border-electric-cobalt/25",
    midnight: "bg-midnight-900 text-white border border-midnight-700",
    slate: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
  };

  const dotStyles = {
    lime: "bg-midnight-900",
    cobalt: "bg-electric-cobalt",
    midnight: "bg-acid-lime",
    slate: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]} shrink-0`} />
      )}
      <span>{children}</span>
    </span>
  );
};
