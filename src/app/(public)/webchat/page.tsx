import React from "react";
import Link from "next/link";
import { Wrench, ShieldCheck, Clock, MessageSquare, ExternalLink, Sparkles } from "lucide-react";
import { ChatWidget } from "@/components/webchat/chat-widget";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+44 7700 900077";
const WHATSAPP_RAW_NUMBER = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

export default function WebchatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary relative overflow-hidden">
      {/* Background subtle workshop grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Navbar */}
      <header className="h-16 px-6 border-b border-border-hairline bg-bg-base/80 backdrop-blur flex items-center justify-between z-10 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded bg-bg-surface border border-border-hairline flex items-center justify-center text-accent-brass">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight uppercase">
            TradeSlot
          </span>
          <span className="font-mono text-[10px] text-text-muted px-2 py-0.5 rounded bg-bg-surface border border-border-hairline hidden sm:inline-block">
            Customer Booking Portal
          </span>
        </div>

        <Link
          href="/login"
          className="font-mono text-xs text-text-secondary hover:text-accent-brass transition-colors"
        >
          Trader Login &rarr;
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-xl space-y-4">
          <div className="text-center space-y-1">
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Book a Certified Tradesperson
            </h1>
            <p className="font-sans text-xs text-text-secondary">
              Instant AI availability check &bull; Fixed £50 standard booking fee
            </p>
          </div>

          {/* Embedded Chatbot Widget */}
          <ChatWidget />

          {/* WhatsApp Alternative Channel Banner */}
          <div className="p-3.5 rounded-lg border border-border-hairline bg-bg-surface flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-text-primary flex items-center gap-1.5">
                  <span>Prefer to book on WhatsApp?</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    24/7 AI BOT
                  </span>
                </p>
                <p className="text-[11px] text-text-secondary">
                  Text <span className="font-mono font-semibold text-text-primary">{WHATSAPP_NUMBER}</span> to check slots and reserve instantly.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_RAW_NUMBER}?text=Hi%2C%20I%20would%20like%20to%20book%20a%20trade%20slot`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors whitespace-nowrap shadow-sm"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Trust badges footer */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-center font-mono text-[11px] text-text-muted pt-1">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-copper" />
              <span>Verified Tradespeople</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-accent-brass" />
              <span>Travel Buffer Optimization</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
