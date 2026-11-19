import type { Metadata, Viewport } from "next";
import { Manrope, Instrument_Serif } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import { RootProviders } from "@/components/providers/RootProviders";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veylo — The Interoperable Payment Identity",
  description:
    "Move money across participating financial providers and Open Payments networks. One memorable 10-digit account number. Instant settlement. Zero card lock-in.",
  icons: {
    icon: "/assets/brand/veylo-symbol.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#111B32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${instrumentSerif.variable}`}
      style={{
        ["--font-instrument-serif" as any]: "var(--font-instrument)",
      }}
    >
      <body className="min-h-screen bg-[#F8FAFC] text-[#111B32] font-sans antialiased selection:bg-[#3D5BFF] selection:text-white">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
