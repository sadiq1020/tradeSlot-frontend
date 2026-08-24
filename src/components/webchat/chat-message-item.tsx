"use client";

import React from "react";
import {
  Wrench,
  User,
  Clock,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Loader2,
  Calendar,
  MapPin,
} from "lucide-react";
import { formatBookingDateTime } from "@/lib/format-booking-date";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  availableSlots?: Array<{ startTime?: string; endTime?: string; time?: string } | string>;
  booking?: any;
  bookingId?: string;
  checkoutUrl?: string;
}

interface ChatMessageItemProps {
  message: ChatMessage;
  onSelectSlot: (slotText: string) => void;
  onPayNow: (bookingId: string, directUrl?: string) => void;
  isCheckingOut?: boolean;
}

export function ChatMessageItem({
  message,
  onSelectSlot,
  onPayNow,
  isCheckingOut,
}: ChatMessageItemProps) {
  const isUser = message.sender === "user";

  const resolvedBooking = message.booking;

  const textRefMatch =
    message.text.match(/\(#([a-zA-Z0-9_-]+)\)/) ||
    message.text.match(/booking\s*\(?#([a-zA-Z0-9_-]+)\)?/i) ||
    message.text.match(/#([a-zA-Z0-9]{5,})/);

  const bookingId =
    message.bookingId ||
    resolvedBooking?.id ||
    (textRefMatch ? textRefMatch[1] : undefined);

  const checkoutUrl = message.checkoutUrl || resolvedBooking?.checkoutUrl;

  const shouldShowPayButton =
    Boolean(bookingId) ||
    message.text.toLowerCase().includes("complete payment") ||
    message.text.toLowerCase().includes("provisional booking") ||
    Boolean(checkoutUrl);

  const { dateLabel, timeLabel } = formatBookingDateTime(resolvedBooking);

  return (
    <div
      className={cn(
        "flex w-full space-x-3 mb-4 animate-in fade-in-50 duration-200",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Bot Icon */}
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-bg-surface border border-border-hairline flex items-center justify-center text-accent-brass flex-shrink-0 mt-0.5">
          <Wrench className="w-4 h-4" />
        </div>
      )}

      {/* Message Content Container */}
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%] space-y-2.5",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Text Bubble */}
        <div
          className={cn(
            "p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-accent-brass text-[#0E1217] rounded-tr-xs font-medium shadow-md"
              : "bg-bg-surface text-text-primary rounded-tl-xs border border-border-hairline shadow-sm"
          )}
        >
          {message.text}
        </div>

        {/* Available Slot Interactive Proposals */}
        {message.availableSlots && message.availableSlots.length > 0 && (
          <div className="p-3.5 rounded-xl bg-bg-surface border border-border-hairline space-y-2">
            <div className="flex items-center space-x-1.5 font-mono text-[11px] text-accent-brass font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Available Time Slots</span>
            </div>
            <p className="text-xs text-text-secondary">
              Select one of the proposed slots below to confirm:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {message.availableSlots.map((slot, index) => {
                let slotLabel = "";
                if (typeof slot === "string") {
                  slotLabel = slot;
                } else if (slot.startTime && slot.endTime) {
                  slotLabel = `${slot.startTime} — ${slot.endTime}`;
                } else if (slot.time) {
                  slotLabel = slot.time;
                } else {
                  slotLabel = `Slot ${index + 1}`;
                }

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onSelectSlot(slotLabel)}
                    className="flex items-center justify-between p-2.5 rounded-md bg-bg-base border border-border-hairline hover:border-accent-brass hover:bg-bg-surface-elevated text-text-primary font-mono text-xs transition-all text-left group"
                  >
                    <span>{slotLabel}</span>
                    <span className="text-[10px] text-accent-brass group-hover:underline">
                      Select &rarr;
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Finalized Booking Ticket & Pay Now Button */}
        {shouldShowPayButton && (
          <div className="p-4 rounded-xl bg-bg-surface-elevated border border-accent-brass/50 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-border-hairline pb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-accent-copper" />
                <span className="font-heading font-bold text-xs text-text-primary uppercase tracking-wide">
                  Booking Confirmed
                </span>
              </div>
              <span className="stamp-badge text-[9px] px-1.5 py-0.2 border-accent-copper text-accent-copper bg-accent-copper-muted">
                SLOT RESERVED
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {resolvedBooking?.customerName && (
                <p className="font-semibold text-text-primary">
                  {resolvedBooking.customerName}
                </p>
              )}

              <div className="flex items-center space-x-1.5 font-mono text-[11px] text-accent-brass">
                <Calendar className="w-3.5 h-3.5" />
                <span>{dateLabel}</span>
                {timeLabel !== "Time Pending" && (
                  <span>&bull; {timeLabel}</span>
                )}
              </div>

              {resolvedBooking?.address && (
                <div className="flex items-center space-x-1.5 text-[11px] text-text-muted">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{resolvedBooking.address}</span>
                </div>
              )}
            </div>

            {/* Pay Now Button */}
            <div className="pt-2 border-t border-border-hairline flex flex-col space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs mb-1">
                <span className="text-text-secondary">Fixed Booking Fee:</span>
                <span className="font-bold text-text-primary">£50.00</span>
              </div>

              <Button
                onClick={() => onPayNow(bookingId, checkoutUrl)}
                disabled={isCheckingOut}
                className="w-full bg-accent-brass hover:bg-accent-brass-hover text-[#0E1217] font-bold text-xs shadow-md"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Opening Stripe Checkout...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now (£50.00)
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </Button>
              <p className="text-[10px] font-mono text-text-muted text-center">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p
          className={cn(
            "font-mono text-[10px] text-text-muted px-1",
            isUser ? "text-right" : "text-left"
          )}
        >
          {message.timestamp}
        </p>
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-accent-brass-muted border border-accent-brass/40 flex items-center justify-center text-accent-brass flex-shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
