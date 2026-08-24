# TradeSlot — Architecture & Design Decisions

This document outlines the key architectural assumptions, tradeoffs, and design choices made during the development of the TradeSlot MVP, specifically addressing **Section 4 ("Designing for Future Scope")** and **Section 5 ("Deliverables")** of the Job Task Brief.

---

## 1. Core Architecture Decisions

### Multi-Channel Decoupling
- **Goal**: Allow WhatsApp, Webchat, and future channels (Telegram, SMS, Messenger, Voice) to plug into the system without touching core booking logic.
- **Implementation**: 
  - The frontend separates the public customer widget (`/webchat`) completely from the internal dispatch management app (`/dashboard`).
  - Messages are normalized on the backend into a common schema `(senderId, channel, content, timestamp)` and processed through a single booking pipeline.
  - The webchat widget operates statelessly via a persistent `senderId` stored in `localStorage`, enabling seamless reconnection and chat continuity across browser sessions.

### Multi-Trader Scalability in Data Contracts
- **Decision**: Avoided hard-coding single-trader assumptions in frontend state and API types.
- **Future Scope**:
  - The API service layers and query hooks accept optional `traderId` scopes.
  - Work areas and dispatch boards are isolated per authenticated user session via `useMe()`, ready for multi-seat organization accounts without structural refactoring.

---

## 2. Scheduling & Travel-Time Buffers

- **Buffer Representation**: Fixed 30-minute buffers between consecutive jobs are clearly displayed in both the customer slot proposal chips and the trader's dispatch ticket cards.
- **Time Parsing Resilience**: Created a universal date-time parser (`format-booking-date.ts`) to gracefully handle various time formats (ISO timestamps, string intervals like `14:00 - 15:00`, and nested relation slot records).

---

## 3. Financial & Stripe Connect Model

- **Fee Structure**:
  - Customer Booking Fee: **£50.00**
  - Platform Application Fee: **£5.00**
  - Trader Net Destination Payout: **£45.00**
- **Stripe Connect Express**:
  - The settings page tracks capability flags (`chargesEnabled`, `payoutsEnabled`, `detailsSubmitted`) in real time.
  - Implemented automatic sync detection on `?stripe=return` URL parameters when the trader returns from onboarding.
- **Asynchronous Webhook Sync**:
  - Handled payment status changes reactively so that bookings automatically reflect `PAID` once Stripe emits `checkout.session.completed`.

---

## 4. UI/UX Design System ("The Dispatch Board")

- **Theme & Palette**: Built around an industrial workshop aesthetic using custom color tokens (`#14181D` dark graphite canvas, `#C99A4B` accent brass, `#C1622D` rust stamp, `#6B9080` copper patina badge).
- **Physical Work-Order Metaphor**: Carbon-copy tear holes (`aria-hidden` perforation dots on ticket edges) and angled stamp badges provide a tangible dispatch board experience.
- **Typography Hierarchy**: Distinct fonts for headers (`Space Grotesk`), UI readability (`Inter`), and monospace data fields (`JetBrains Mono` for ticket references, ISO timestamps, and currency).

---

## 5. Summary of Assumptions

1. **Daily Work Area Scope**: The MVP uses single-day work area configurations. Recurring weekly patterns and geographic polygon boundaries can be layered onto this entity in future iterations.
2. **Standard Booking Duration**: Slot calculations assume 1-hour service duration + 30-minute fixed travel buffer.
3. **Single Currency**: All fees are calculated in GBP (£).
