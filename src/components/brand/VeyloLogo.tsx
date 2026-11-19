import React from "react";
import Link from "next/link";

interface VeyloLogoProps {
  variant?: "light" | "dark" | "cobalt";
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
}

export const VeyloSymbol = ({
  size = 32,
  variant = "light",
  className = "",
}: {
  size?: number;
  variant?: "light" | "dark" | "cobalt";
  className?: string;
}) => {
  // Exact path coordinates from Figma approved Veylo Connected V Symbol
  // Light variant: #3D5BFF (Cobalt left arm) + #111B32 (Midnight right leg)
  // Dark variant: #3D5BFF (Cobalt left arm) + #D8F15B (Acid Lime right leg)
  // Cobalt variant: #FFFFFF (White) + #D8F15B (Acid Lime)
  const leftColor = variant === "cobalt" ? "#FFFFFF" : "#3D5BFF";
  const rightColor =
    variant === "dark" ? "#D8F15B" : variant === "cobalt" ? "#D8F15B" : "#111B32";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Veylo Symbol"
    >
      {/* Left primary arm */}
      <path
        d="M6 8L18 32H23L11 8H6Z"
        fill={leftColor}
      />
      {/* Right connected interlocking arm */}
      <path
        d="M34 8L20 32H15L29 8H34Z"
        fill={rightColor}
        fillOpacity={variant === "light" ? "0.9" : "1"}
      />
      {/* Interlocking bridge connector */}
      <circle cx="20" cy="27" r="2.5" fill={variant === "dark" ? "#FFFFFF" : "#3D5BFF"} />
    </svg>
  );
};

export const VeyloLogo: React.FC<VeyloLogoProps> = ({
  variant = "light",
  showWordmark = true,
  size = "md",
  className = "",
  href = "/",
}) => {
  const sizeMap = {
    sm: { symbol: 24, text: "text-lg tracking-wider" },
    md: { symbol: 32, text: "text-xl tracking-wider" },
    lg: { symbol: 40, text: "text-2xl tracking-widest" },
    xl: { symbol: 52, text: "text-3xl tracking-widest" },
  };

  const { symbol: symbolSize, text: textClass } = sizeMap[size];

  const wordmarkColor =
    variant === "dark" || variant === "cobalt" ? "text-white" : "text-midnight-950";

  const content = (
    <div className={`inline-flex items-center gap-2.5 font-sans ${className}`}>
      <VeyloSymbol size={symbolSize} variant={variant} />
      {showWordmark && (
        <span
          className={`font-black font-sans uppercase font-extrabold ${wordmarkColor} ${textClass}`}
          style={{ letterSpacing: "0.14em" }}
        >
          VEYLO
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-cobalt rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
