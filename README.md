# TradeSlot — Frontend MVP

> **Next.js 16 (App Router)** • **TypeScript** • **Tailwind CSS v4** • **TanStack Query** • **Stripe Connect**

TradeSlot is an end-to-end booking and dispatch platform built for tradespeople. It allows a trader to set daily operating zones, accept bookings seamlessly from multiple customer channels (Webchat & WhatsApp) with fixed travel-time buffers, capture flat booking fees, and receive automated direct payouts via **Stripe Connect**.

---

## 🚀 Live Demo & Quick Evaluation

For rapid employer review, demo credentials are pre-configured:
- **Trader Login URL**: `http://localhost:3000/login`
- **Demo Email**: `trader@tradeslot.com`
- **Demo Password**: `Password123!`
- **Quick Action**: Click the **"Fill Demo Trader Credentials"** button on the login screen.
- **Public Customer Webchat**: `http://localhost:3000/webchat`

---

## 📋 Deliverables & Job Task Alignment

| Requirement (Job Task Scope) | Implementation Details | Status |
| :--- | :--- | :--- |
| **3.1 Trader Work Area Setup** | `/dashboard/work-area` — Daily zone configuration with covered postcodes and live stream of scheduled zones. | ✅ **Done** |
| **3.2 Multi-Channel Booking Intake** | `/webchat` — Standalone mobile-friendly customer chat with persistent `senderId` in `localStorage`, unified with WhatsApp channel backend. | ✅ **Done** |
| **3.3 Booking & Travel Buffers** | Dispatch Board (`/dashboard/bookings`) rendering carbon-copy perforated tickets with 30-min travel buffer slot intervals. | ✅ **Done** |
| **3.4 Flat Fee Billing** | £50.00 standard job booking fee tracked on every job ticket and captured at checkout. | ✅ **Done** |
| **3.5 Stripe Connect Integration** | `/dashboard/settings` — Stripe Express Onboarding, live account capability badges (`Charges`, `Payouts`, `Details`), £5 platform fee capture, and £45 net trader destination payout. | ✅ **Done** |
| **4. Designing for Future Scope** | Modular domain architecture, channel decoupling, and flexible data schemas documented in `DESIGN_DECISIONS.md`. | ✅ **Done** |

---

## 🎨 Visual System: "The Dispatch Board"

The application features a bespoke **Industrial Dispatch / Workshop** design aesthetic:
- **Color Palette**:
  - Base Canvas: `#14181D` (Dark graphite)
  - Surface: `#1C2128` (Elevated cards & drawers)
  - Hairline Border: `#2A3038`
  - Accent Brass: `#C99A4B` (Primary actions & active highlights)
  - Accent Rust: `#C1622D` (Attention & pending stamps)
  - Accent Copper: `#6B9080` (Confirmed stamps & `£50 PAID` badges)
- **Typography**: `Space Grotesk` (Headings), `Inter` (UI Body), `JetBrains Mono` (Ticket IDs, timestamps & amounts).
- **Physical Metaphor**: Carbon-copy work order tear holes (`aria-hidden` perforation holes on ticket left edge) and angled stamp badges.

---

## 🛠️ Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/                 # Trader sign-in with quick-fill demo button
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── bookings/          # Dispatch Board with status tabs & date filter
│   │   │   ├── work-area/         # Daily operational zone setup
│   │   │   └── settings/          # Stripe Connect Express onboarding & status
│   │   └── layout.tsx             # Protected layout with toolbox sidebar & header
│   ├── (public)/
│   │   └── webchat/               # Public customer booking chatbot portal
│   └── booking/
│       ├── success/               # Stripe checkout payment confirmation receipt
│       └── cancelled/             # Checkout cancellation status screen
├── components/
│   ├── dashboard/                 # Job tickets, detail modal, sidebar, header
│   ├── webchat/                   # Interactive chat bubbles, slot chips, pay card
│   └── ui/                        # Reusable accessible primitives
├── lib/
│   ├── api/                       # Axios client (with 401 refresh token interceptor)
│   ├── queries/                   # TanStack Query custom hooks & mutations
│   └── format-booking-date.ts     # Flexible time parser & date formatter
└── types/
    └── api.ts                     # Full TypeScript contracts
```

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 End-to-End Test Workflow

1. **Sign In**: Log into `http://localhost:3000/login` using the demo trader credentials.
2. **Work Area**: Go to `/dashboard/work-area` and schedule zones for upcoming dates.
3. **Customer Booking**: Open `/webchat` in an incognito window, request a service, pick a slot, and click **"Pay Now"**.
4. **Stripe Checkout**: Complete test checkout with card `4242 4242 4242 4242` and return to the success screen.
5. **Dispatch Board**: View the live ticket update on `/dashboard/bookings` with the **`£50 PAID`** copper badge and travel buffer times.
