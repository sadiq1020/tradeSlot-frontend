"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function BookingCancelledContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id") || searchParams.get("bookingId");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-base relative overflow-hidden">
      {/* Background subtle workshop grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-accent-rust/15 border border-accent-rust/40 flex items-center justify-center text-accent-rust shadow-lg">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary uppercase">
            Payment Cancelled
          </h1>
          <p className="font-mono text-xs text-accent-rust tracking-wider uppercase">
            No Charges Were Made
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-border-hairline bg-bg-surface shadow-2xl">
          <CardHeader className="pb-4 border-b border-border-hairline">
            <CardTitle className="text-base">
              Checkout was not completed
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <p className="text-xs text-text-secondary leading-relaxed">
              Your Stripe checkout session was cancelled. You can return to the booking chat anytime to restart or pay for your slot.
            </p>

            {bookingId && (
              <div className="p-3 rounded bg-bg-base border border-border-hairline flex items-center justify-between font-mono text-xs">
                <span className="text-text-muted">Booking Reference:</span>
                <span className="text-accent-brass font-bold">
                  #{bookingId.slice(0, 8).toUpperCase()}
                </span>
              </div>
            )}

            <div className="pt-4 flex flex-col space-y-2">
              <Link href="/webchat" className="w-full">
                <Button className="w-full text-xs font-semibold">
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Return to Webchat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center font-mono text-[11px] text-text-muted">
          TradeSlot Dispatch Platform
        </div>
      </div>
    </div>
  );
}

export default function BookingCancelledPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg-base">
          <div className="font-mono text-xs text-text-muted">
            Loading status...
          </div>
        </div>
      }
    >
      <BookingCancelledContent />
    </Suspense>
  );
}
