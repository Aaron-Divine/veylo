# Veylo — Interoperable Payment Identity & Open Payments Web Application

Veylo is an independent financial technology product built around payment identity, account-based payments, and interoperable payment infrastructure (Interledger Protocol and Open Payments).

This codebase is a production-quality frontend implementation directly converted from the approved master Figma design (`PqA3LYj7d4rljzY4ELm7c6`).

---

## 🚀 Quick Start

### 1. Requirements
- Node.js 18.18+ or 20+
- npm 9+

### 2. Development Server
Run the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🗺️ Application Routes

### Marketing & Brand Experience
| Route | Description | Figma Source Frame |
| :--- | :--- | :--- |
| `/` | Veylo Marketing Homepage (Desktop & Responsive) with 10-digit account hero card, 3-step value props, business banner, and FAQ accordion. | `27:2` (Desktop) & `27:134` (Mobile) |
| `/auth/login` | Authentication Sign-In via Veylo ID, Account Number, or Passkey. | Design System Auth Pattern |
| `/auth/register` | Onboarding Registration & 10-Digit Account Number Reservation. | Design System Auth Pattern |

### Authenticated Application Suite
| Route | Description | Figma Source Frame |
| :--- | :--- | :--- |
| `/app` | Financial Dashboard with universal 10-digit account pass, 1-click clipboard copy, interactive QR modal, balance tiles, and recent transactions. | `28:2` |
| `/app/send` | Send Money Flow with 3 destination categories (Nigerian Bank, Veylo Account, International). Real-time NUBAN resolution to *Oluwatobi Adebayo* at GTBank, 2.0% Veylo fee calculation, and 6-digit PIN / Face ID modal. | `28:119` |
| `/app/send/international` | Cross-Border Interledger Transfer with adaptive UK Sort Code (`40-22-18`) & Account Number (`88291044`) resolving to *Arthur Pendelton* at Barclays UK. Includes Mode 1 (Direct ILP) vs Mode 2 (Payout Partner) toggle, 60-second live FX quote (`1 GBP = ₦2,040`), and corridor fallback states. | `59:2` |
| `/app/account` | Account & Identity Hub featuring Veylo ID (`@tomiade`), Open Payments pointer (`https://veylo.me/tomiade`), connected GTBank account (`••6789`), and instant account freeze kill-switch. | `28:199` |
| `/app/subscriptions` | Subscriptions & Mandates Manager displaying active recurring authorizations (Netflix `₦6,500/mo`, Spotify `₦2,200/mo`, YouTube `₦3,500/mo`, Reelroom `€12.99/mo`). Includes interactive Netflix Mandate Revocation modal (`#OP-MND-9810`). | `63:2` |
| `/app/budgets` | Budgets & Spending Limits featuring dynamic monthly ceiling slider (₦200k to ₦2.0M), 5 category pacing meters, and burn-rate velocity projection (`₦592,797.50` projected spend). | `29:2` |
| `/app/activity` | Transaction Ledger with filter buttons and slide-out right drawer displaying complete Interledger routing metadata and PDF receipt download. | `29:92` |
| `/app/onboarding` | 3-Step Onboarding Wizard for claiming a 10-digit account number, linking a commercial bank account, and enabling biometric passkeys. | `29:165` |

### Demonstration & Business Suite
| Route | Description | Figma Source Frame |
| :--- | :--- | :--- |
| `/demo/reelroom` | Reelroom Indie Cinema streaming platform demo with 1-click "Pay with Veylo Account" checkout and simulated out-of-band mobile push authorization. | `35:94` |
| `/demo/checkout-architecture` | Architectural comparison matrix (Legacy Card Networks vs. Veylo Open Payments) and interactive Interledger Prepare Packet inspector (ILP v4). | `35:2` |
| `/business` | Veylo Business Merchant Dashboard showing ₦14.8M volume, ₦429k saved in card interchange fees, and live API webhook endpoints. | `34:2` |
| `/business/stand` | Countertop Acrylic POS Stand Simulator with dynamic invoice generator and customer scan-to-pay simulation. | `34:205` |

---

## 🎨 Design System & Token Compliance

- **Exact Color Palette:**
  - 60% Midnight Ink (`#111B32` / `#0B1222`)
  - 30% Electric Cobalt (`#3D5BFF` / Hover `#2E49E6`)
  - 10% Acid Lime (`#D8F15B` / Hover `#C5DE48`)
  - Canvas Neutrals: Slate-50 (`#F8FAFC`), Slate-100 (`#F1F5F9`), Slate-200 (`#E2E8F0`)
- **Typography:**
  - Headings & Editorial Accents: `Instrument Serif` (Google Fonts)
  - UI, Data, and Form Inputs: `Manrope` (Google Fonts Variable wght 400–800)
- **Vector Assets:**
  - Original Veylo interlocking Connected V symbol extracted directly from Figma vector geometry (`src/components/brand/VeyloLogo.tsx`, `public/assets/brand/`).

---

## 🏛️ Interledger & Open Payments Model

- **4-Tier Value Routing:**
  1. Sender Funding Source (`Connected Bank Account: GTBank ••6789`)
  2. Interledger Connectors (multi-hop routing + on-the-fly currency conversion, zero correspondent banks)
  3. Receiving Endpoint (Direct ILP bank endpoint or integrated local Payout Partner)
  4. Local Rail Clearing (UK Faster Payments, NIP Nigeria, SEPA Instant)
- **No Correspondent Banks:** Traditional intermediary banks are eliminated in favor of direct peer routing.
- **Customer UI Terminology:** Internal settlement jargon (e.g. "Rafiki", "Settlement Endpoint") is banned from customer interfaces in favor of familiar banking concepts ("Beneficiary Bank", "Account Number", "Connected Bank Account").

---

## 📁 Project Architecture

```
├── docs/
│   ├── figma-implementation-map.md  # Complete frame-by-frame mapping
│   └── visual-qa.md                 # Visual QA and fidelity verification report
├── public/
│   └── assets/brand/                # Extracted SVG brand marks
├── src/
│   ├── app/                         # Next.js App Router routes
│   │   ├── (marketing)/page.tsx     # Homepage
│   │   ├── app/                     # Authenticated suite
│   │   ├── auth/                    # Sign-in & register
│   │   ├── business/                # Merchant dashboard & stand
│   │   ├── demo/                    # Checkout demos & matrix
│   │   └── layout.tsx               # Root layout & font loading
│   ├── components/
│   │   ├── brand/                   # VeyloLogo and SVG symbol
│   │   ├── layout/                  # Sidebar, Header, Client Layout
│   │   ├── marketing/               # Navbar and Footer
│   │   └── ui/                      # Button, Input, Modal, Badge, Card
│   ├── data/
│   │   └── mockData.ts              # Tomi Adebayo mock data & banks
│   ├── styles/
│   │   ├── globals.css              # Tailwind base
│   │   └── tokens.css               # Exact Figma CSS custom properties
│   └── types/
│       └── index.ts                 # Strong TypeScript models
├── tailwind.config.ts               # Custom brand palette config
└── tsconfig.json                    # Path aliases (@/*)
```
