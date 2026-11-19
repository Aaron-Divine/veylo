import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "lime"
    | "outline"
    | "outline-dark"
    | "ghost"
    | "ghost-dark"
    | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5 font-semibold",
    md: "text-sm px-4 py-2.5 gap-2 font-semibold",
    lg: "text-base px-6 py-3.5 gap-2.5 font-bold",
    xl: "text-lg px-8 py-4 gap-3 font-bold",
  };

  const variantStyles = {
    // 30% Electric Cobalt
    primary:
      "bg-electric-cobalt text-white hover:bg-electric-hover focus-visible:ring-electric-cobalt shadow-sm hover:shadow-md",
    // 60% Midnight Ink
    secondary:
      "bg-midnight-900 text-white hover:bg-midnight-800 focus-visible:ring-midnight-700 shadow-sm border border-midnight-800",
    // 10% Acid Lime Accent
    lime:
      "bg-acid-lime text-midnight-950 hover:bg-acid-hover focus-visible:ring-acid-lime font-bold shadow-sm",
    // Light outline
    outline:
      "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400",
    // Dark surface outline (for midnight cards & hero)
    "outline-dark":
      "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 focus-visible:ring-white/40 shadow-sm",
    ghost:
      "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus-visible:ring-slate-400",
    "ghost-dark":
      "text-slate-300 hover:text-white hover:bg-white/10 focus-visible:ring-white/40",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 shadow-sm",
  };

  const combinedStyles = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} disabled={disabled || isLoading} {...props}>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
