# Veylo Figma-to-Code Implementation Map

This document serves as the authoritative inventory and mapping between the Figma design master canvas (`PqA3LYj7d4rljzY4ELm7c6`) and the code implementation in this Next.js project.

---

## 1. Public Marketing Website

| Figma Frame Name | Figma Node ID | Dimensions | Route | Component / Page | Required Assets / Notes | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **05 — Marketing Website (Desktop 1440px)** | `27:2` | 1440 × 4800 | `/` | `src/app/(marketing)/page.tsx` | Veylo logo, hero interactive card, 10-digit pillars, 3-step flow, business card, Reelroom preview, FAQ, footer | Planned |
| **06 — Responsive Marketing Website (Tablet 768px)** | `27:134` | 768 × 4800 | `/` | Responsive media query (`md:` breakpoint) | Scaled navigation, collapsed grids, touch-friendly CTAs | Planned |
| **06 — Responsive Marketing Website (Mobile 390px)** | `27:134` | 390 × 4800 | `/` | Responsive media query (`sm:` / default) | Mobile hamburger menu, stacked cards, full-width buttons | Planned |

---

## 2. Authenticated Web Application (`/app`)

| Figma Frame Name | Figma Node ID | Dimensions | Route | Component / Page | Interactions & Features | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **07 — Web App: Main Dashboard** | `28:2` | 1440 × 1024 | `/app` | `src/app/app/page.tsx` | Hero Veylo Account # `482 193 7604`, copy button, QR modal, quick send, recent activity, multi-currency balance | Planned |
| **08A — Web App: Send Money (Nigerian Bank)** | `28:119` | 1440 × 1024 | `/app/send` | `src/app/app/send/page.tsx` | 3 Destination tabs, GTBank recipient `0123456789` (*Oluwatobi Adebayo*), 2% fee, in-app PIN & Face ID auth | Planned |
| **08B — Web App: Send Money (International Bank)** | `59:2` | 1440 × 1024 | `/app/send/international` | `src/app/app/send/international/page.tsx` | UK adaptive fields (Sort Code `40-22-18` + Acct `88291044` -> Barclays), Mode 1/2 currency toggle, 45s locked FX quote, corridor error states | Planned |
| **09 — Web App: Account & Identity Hub** | `28:199` | 1440 × 1024 | `/app/account` | `src/app/app/account/page.tsx` | Veylo Account # card, `@tomiade` Veylo ID, Connected Bank Account `GTBank (••6789)`, security, KYC tier | Planned |
| **10A — Web App: Subscriptions Manager** | `63:2` | 1440 × 1024 | `/app/subscriptions` | `src/app/app/subscriptions/page.tsx` | Active subscriptions (Netflix ₦6,500, Spotify ₦2,200, YouTube ₦3,500, Reelroom €12.99), Veylo-Managed vs Tracked, Netflix mandate cancellation modal (`#OP-MND-9810`) | Planned |
| **10B — Web App: Budgets & Spending Limits** | `29:2` | 1440 × 1024 | `/app/budgets` | `src/app/app/budgets/page.tsx` | ₦650k ceiling, 5 category pacing meters, burn rate velocity chart, quick ceiling slider, overspending alerts | Planned |
| **11 — Web App: Activity & Transaction Drawer** | `29:92` | 1440 × 1024 | `/app/activity` | `src/app/app/activity/page.tsx` | Filterable transaction table (All, Nigerian Banks, International, Veylo P2P, Subscriptions), slide-out right drawer with full metadata & PDF receipt export | Planned |
| **12 — Web App: Onboarding & Account Assignment** | `29:165` | 1440 × 1024 | `/app/onboarding` | `src/app/app/onboarding/page.tsx` | 3-step onboarding: Identity verification, 10-digit Account Number assignment, Connected Bank linking | Planned |
| **Authentication Flow (Sign In / Sign Up)** | Reference | 1440 × 1024 | `/auth/login`, `/auth/register` | `src/app/(auth)/login/page.tsx`, `register/page.tsx` | Clean credentials entry, demo session switch, biometric passkey prompt | Planned |

---

## 3. Veylo Business & Merchant Experience (`/business`)

| Figma Frame Name | Figma Node ID | Dimensions | Route | Component / Page | Features | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **21 — Veylo Business: Merchant Admin Dashboard** | `34:2` | 1700 × 1024 | `/business` | `src/app/business/page.tsx` | Merchant revenue overview, terminal management, payout bank accounts, webhook ingress log | Planned |
| **22 — Veylo Business: Countertop Dynamic QR Stand** | `34:205` | 1840 × 1024 | `/business/stand` | `src/app/business/stand/page.tsx` | Interactive point-of-sale countertop acrylic stand simulator with dynamic QR generation & webhook ping | Planned |

---

## 4. Reelroom Streaming Demo & Checkout Architecture (`/demo`)

| Figma Frame Name | Figma Node ID | Dimensions | Route | Component / Page | Features | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **24 — REELROOM: Streaming Service Demo** | `35:94` | 2140 × 1040 | `/demo/reelroom` | `src/app/demo/reelroom/page.tsx` | Film community streaming homepage, pricing plan selector, and 1-click "Pay with Veylo Account" checkout modal | Planned |
| **23 — Checkout Innovation: Account-Based Architecture** | `35:2` | 1600 × 1040 | `/demo/checkout-architecture` | `src/app/demo/checkout-architecture/page.tsx` | Interactive technical comparison matrix: 16-Digit Card Schemes vs Veylo Interledger Protocol, with live out-of-band push authorization simulator | Planned |

---

## 5. Mobile Web Application Views (Responsive Mobile)

| Figma Frame Name | Figma Node ID | Dimensions | Route (Mobile Viewport) | Features | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **13 — Mobile: Home Dashboard** | `32:2` | 390 × 844 | `/app` on mobile | Mobile hero card with 10-digit number, quick actions, bottom nav | Planned |
| **14 — Mobile: Send Recipient Lookup** | `32:108` | 390 × 844 | `/app/send` on mobile | 3 destination category tabs, keypad lookup, verified badge | Planned |
| **14B — Mobile: Nigerian Bank Transfer Flow** | `68:2` | 390 × 844 | `/app/send/bank` on mobile | Bank selector, 0123456789 NUBAN resolution, 2% fee breakdown | Planned |
| **15 — Mobile: In-App Authorization** | `32:169` | 390 × 844 | In-app modal / sheet | 6-Digit PIN keypad & Face ID biometric authorization | Planned |
| **16 — Mobile: Payment Completed & Receipt** | `32:206` | 390 × 844 | Completed confirmation | Animated green success badge, receipt share & download | Planned |
| **17 — Mobile: In-Store QR Scanner** | `33:2` | 390 × 844 | `/app/scan` on mobile | Viewfinder simulation with flash and QR target brackets | Planned |
| **18 — Mobile: Camera Permission Denied** | `33:30` | 390 × 844 | Scanner fallback | Graceful recovery state with manual 10-digit number entry | Planned |
| **19 — Mobile: Finance, Category Pacing & Subscriptions** | `33:58` | 390 × 844 | `/app/budgets` on mobile | Pacing meters + distinct recurring subscriptions card with cancel mandate action | Planned |
| **20 — Mobile: Profile & Veylo Account Pass Card** | `33:125` | 390 × 844 | `/app/pass` on mobile | Apple Wallet / Google Wallet pass card with QR and offline ILP token | Planned |

---

## 6. Design System Tokens & Brand Asset Foundations

| Category | Token / Value | Figma Reference | Code Destination |
| :--- | :--- | :--- | :--- |
| **Primary Authority Background (60%)** | `#111B32` (`--color-midnight-ink`) | `24:91`, `26:2` | `src/styles/tokens.css`, `tailwind.config.ts` |
| **Fintech Digital Accent (30%)** | `#3D5BFF` (`--color-electric-cobalt`) | `24:91`, `26:2` | `src/styles/tokens.css`, `tailwind.config.ts` |
| **Energy Contrast & Badges (10%)** | `#D8F15B` (`--color-acid-lime`) | `24:91`, `26:2` | `src/styles/tokens.css`, `tailwind.config.ts` |
| **Canvas Background** | `#F8FAFC` (`--color-slate-50`) | `26:2` | `src/styles/tokens.css`, `tailwind.config.ts` |
| **Card Borders & Dividers** | `#E2E8F0` (`--color-slate-200`) | `26:2` | `src/styles/tokens.css`, `tailwind.config.ts` |
| **Primary Sans-Serif Font** | `Manrope`, sans-serif | `26:2` | `src/app/layout.tsx` (Google Fonts / next/font) |
| **Editorial Serif Font** | `Instrument Serif`, serif | `26:2` | `src/app/layout.tsx` (Google Fonts / next/font) |
| **Card Radii** | `14px`, `16px`, `24px` | `26:2` | `src/styles/tokens.css` |
| **Veylo Connected V Logo** | SVG vector icon & wordmark | `24:91` | `src/components/brand/VeyloLogo.tsx`, `public/assets/brand/` |
