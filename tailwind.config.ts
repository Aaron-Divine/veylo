import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: "#111B32",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#111B32",
          950: "#0B1222",
          ink: "#111B32",
          dark: "#0B1222",
          surface: "#182440",
          card: "#1E2C4E",
          border: "#26365E",
        },
        electric: {
          DEFAULT: "#3D5BFF",
          cobalt: "#3D5BFF",
          hover: "#2E49E6",
          light: "#EEF2FF",
          border: "#C7D2FE",
        },
        acid: {
          DEFAULT: "#D8F15B",
          lime: "#D8F15B",
          hover: "#C5DE48",
          light: "#F7FEE7",
        },
        lime: {
          DEFAULT: "#D8F15B",
          acid: "#D8F15B",
          hover: "#C5DE48",
          light: "#F7FEE7",
        },
        brand: {
          green: "#10B981",
          greenLight: "#ECFDF5",
          greenBorder: "#A7F3D0",
          amber: "#D97706",
          amberLight: "#FEF3C7",
          amberBorder: "#FDE68A",
          red: "#DC2626",
          redLight: "#FEF2F2",
          redBorder: "#FECACA",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["var(--font-instrument)", "var(--font-instrument-serif)", "Instrument Serif", "Georgia", "serif"],
        mono: ["SF Mono", "Fira Code", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "14px",
        cardLg: "20px",
        cardXl: "24px",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(17, 27, 50, 0.06), 0 2px 6px -1px rgba(17, 27, 50, 0.04)",
        cardHover: "0 10px 25px -3px rgba(17, 27, 50, 0.1), 0 4px 10px -2px rgba(17, 27, 50, 0.05)",
        elevated: "0 20px 40px -10px rgba(17, 27, 50, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
