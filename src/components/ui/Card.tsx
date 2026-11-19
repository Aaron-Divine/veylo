import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "slate" | "midnight" | "bordered";
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "white",
  hoverEffect = false,
  className = "",
  ...props
}) => {
  const variantStyles = {
    white: "bg-white border border-slate-200/80 shadow-sm",
    slate: "bg-slate-50 border border-slate-200",
    midnight: "bg-midnight-900 border border-midnight-800 text-white shadow-xl",
    bordered: "bg-transparent border border-slate-200",
  };

  const hoverStyles = hoverEffect
    ? "transition-all duration-200 hover:shadow-md hover:border-slate-300"
    : "";

  return (
    <div
      className={`rounded-2xl p-6 ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
