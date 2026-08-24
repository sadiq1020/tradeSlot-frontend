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

## 🧑‍💻 User & Trader Workflow Guides

### 1. How a Customer Books a Slot (Webchat & WhatsApp)

#### 💬 A. Customer Webchat Journey (`/webchat`)
1. **Open Portal**: Customer visits the public webchat link (e.g. `/webchat`). A unique `senderId` is automatically generated and stored in `localStorage` for persistent multi-turn conversations.
2. **Send Natural Language Request**:
   - Customer types their request including date & postcode:
     - Example: *"Hi, I need an emergency boiler fix in EC1A tomorrow afternoon"*
   - The bot parses the date and postcode, verifies whether the trader has a scheduled work area, and calculates real-time available time slots (with 30-min travel buffers).
3. **Select Slot**:
   - The bot responds with interactive slot buttons (e.g. `[ 14:00 — 15:00 ]`, `[ 16:00 — 17:00 ]`).
   - Customer clicks a slot or types *"I'll take the 14:00 slot"*.
4. **Complete Payment**:
   - The bot creates the booking in `PENDING` status and renders a **"Pay Now — £50.00"** checkout button.
   - Clicking **Pay Now** redirects the customer to hosted Stripe Checkout.
5. **Confirmation Receipt**:
   - Upon successful payment, Stripe redirects to `/booking/success?session_id=...&booking_id=...`.
   - The Stripe Webhook updates the booking to `CONFIRMED` with `PaymentStatus: PAID`.

#### 📱 B. WhatsApp Channel Intake
1. **Inbound WhatsApp Message**: Customer messages the trader's registered Meta WhatsApp Cloud business number (e.g. *"Need a plumber in SW1 on Friday morning"*).
2. **Unified Ingestion**: Ingestion endpoint `POST /api/v1/whatsapp/webhook` receives the message, normalizes sender credentials, and dispatches to the booking engine.
3. **Auto-Reply & Stripe Link**: The bot replies via WhatsApp with available slots and a direct Stripe Checkout URL to confirm the trade slot.

---

### 2. Everything a Trader Can Do (Trader Dashboard)

| Dashboard Section | Route | Capabilities & Trader Actions |
| :--- | :--- | :--- |
| **Daily Work Area Setup** | `/dashboard/work-area` | • Select upcoming dates on a calendar.<br>• Assign geographical zone labels (e.g., *"North London"*, *"Zone 1"*).<br>• Add comma-separated covered postcode prefixes (e.g. `EC1`, `WC2`, `N1`).<br>• View a live list of scheduled zones with quick-delete options. |
| **Dispatch Board** | `/dashboard/bookings` | • View all incoming bookings rendered as perforated industrial job tickets.<br>• Filter by status tabs: **All Tickets**, **Confirmed**, **Pending**, **Completed**, **Cancelled**.<br>• Filter by specific date or search by customer name, address, or postcode.<br>• See automatic 30-minute travel buffers before and after each job.<br>• Check live payment status badges (**`£50 PAID`** copper stamp badge vs **`£50 UNPAID`**). |
| **Job Inspection & Actions** | Ticket Click Modal | • Click any job ticket to open the full inspection modal.<br>• View full customer contact info (name, phone, email, address).<br>• Transition job lifecycle status (`CONFIRMED` ➔ `COMPLETED` upon work completion, or `CANCELLED` with a reason).<br>• View transparent fee breakdown: £50 total fee, £5 platform fee, and £45 net payout. |
| **Stripe Connect & Payouts** | `/dashboard/settings` | • Click **"Connect Stripe Account"** to initiate Stripe Express Onboarding.<br>• Live capability status indicators (**Charges Enabled**, **Payouts Enabled**, **Details Submitted**).<br>• Direct automated bank payouts for completed trade jobs. |

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

1. **Sign In**: Log into `http://localhost:3000/login` using the demo trader credentials (`trader@tradeslot.com` / `Password123!`).
2. **Work Area**: Go to `/dashboard/work-area` and schedule zones for upcoming dates.
3. **Customer Booking**: Open `/webchat` in an incognito window, request a service, pick a slot, and click **"Pay Now"**.
4. **Stripe Checkout**: Complete test checkout with card `4242 4242 4242 4242` and return to the success screen.
5. **Dispatch Board**: View the live ticket update on `/dashboard/bookings` with the **`£50 PAID`** copper badge and travel buffer times.
