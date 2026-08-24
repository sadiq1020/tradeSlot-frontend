"use client";

import React from "react";
import { Clock, MapPin } from "lucide-react";
import { Booking, BookingStatus } from "@/types/api";
import { formatBookingDateTime } from "@/lib/format-booking-date";
import { cn } from "@/lib/utils";

interface JobTicketCardProps {
  booking: Booking;
  onClick?: () => void;
}

export function JobTicketCard({ booking, onClick }: JobTicketCardProps) {
  // Defensive field resolution across various backend formats
  const customerName =
    booking.customerName ||
    booking.customer?.name ||
    "Customer Request";

  const serviceDesc =
    booking.serviceDescription ||
    booking.jobDescription ||
    booking.description ||
    booking.service ||
    booking.notes ||
    "Trade Booking";

  const address =
    booking.address ||
    booking.customer?.address ||
    booking.location ||
    "";

  const postcode =
    booking.postcode ||
    booking.customer?.postcode ||
    "";

  const amount =
    (booking.payment?.amount
      ? booking.payment.amount >= 100
        ? Math.round(booking.payment.amount / 100)
        : booking.payment.amount
      : undefined) ??
    booking.amount ??
    booking.fee ??
    booking.bookingFee ??
    50;

  // Resolve payment status flexibly (nested payment relation, camelCase, snake_case, boolean flags)
  const paymentStatusRaw = (
    booking.payment?.status ||
    (booking as any).payment?.paymentStatus ||
    booking.paymentStatus ||
    (booking as any).payment_status ||
    (booking as any).paymentState ||
    (booking as any).payment_state ||
    ((booking as any).isPaid ? "PAID" : undefined) ||
    ((booking as any).paid ? "PAID" : undefined) ||
    "UNPAID"
  ).toUpperCase();

  const isPaid =
    paymentStatusRaw === "PAID" ||
    paymentStatusRaw === "COMPLETED" ||
    paymentStatusRaw === "SUCCEEDED" ||
    Boolean(booking.payment?.stripePaymentIntentId) ||
    Boolean(booking.stripePaymentIntentId) ||
    Boolean((booking as any).stripe_payment_intent_id);

  const displayPaymentStatus = isPaid ? "PAID" : "UNPAID";

  const shortId = `#${(booking.id || "")
    .replace(/-/g, "")
    .slice(0, 6)
    .toUpperCase()}`;

  const { timeLabel, shortDate } = formatBookingDateTime(booking);

  // Status Badge styling according to Dispatch Board palette
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return {
          label: "CONFIRMED",
          className:
            "border-accent-brass/80 text-accent-brass bg-accent-brass-muted/30 shadow-[0_0_8px_rgba(201,154,75,0.15)]",
        };
      case "PENDING":
        return {
          label: "PENDING",
          className:
            "border-accent-rust/80 text-accent-rust bg-accent-rust-muted/30 shadow-[0_0_8px_rgba(193,98,45,0.15)]",
        };
      case "COMPLETED":
        return {
          label: "COMPLETED",
          className:
            "border-accent-copper/80 text-accent-copper bg-accent-copper-muted/30",
        };
      case "CANCELLED":
        return {
          label: "CANCELLED",
          className:
            "border-border-hairline text-text-muted bg-bg-surface-elevated/50 line-through opacity-70",
        };
      default:
        return {
          label: status || "PENDING",
          className: "border-border-hairline text-text-secondary bg-bg-surface",
        };
    }
  };

  const statusConfig = getStatusBadge(booking.status);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between p-5 rounded-lg bg-bg-surface border border-border-hairline transition-all duration-200 cursor-pointer overflow-hidden",
        "hover:border-accent-brass/60 hover:bg-bg-surface-hover hover:shadow-lg hover:-translate-y-0.5",
        "pl-7" // padding for perforation left edge
      )}
    >
      {/* Left-edge Perforation detail (carbon-copy work order tear holes) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-between items-center py-2.5 pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-bg-base border border-border-hairline/80" />
        <div className="w-1.5 h-1.5 rounded-full bg-bg-base border border-border-hairline/80" />
        <div className="w-1.5 h-1.5 rounded-full bg-bg-base border border-border-hairline/80" />
        <div className="w-1.5 h-1.5 rounded-full bg-bg-base border border-border-hairline/80" />
        <div className="w-1.5 h-1.5 rounded-full bg-bg-base border border-border-hairline/80" />
      </div>

      {/* Card Header: Mono ID & Stamp Badge */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <div className="flex items-center space-x-2.5">
          <span className="font-mono text-xs font-bold tracking-wider text-text-secondary group-hover:text-accent-brass transition-colors">
            {shortId}
          </span>
          {shortDate && (
            <span className="font-mono text-[11px] text-text-muted">
              &bull; {shortDate}
            </span>
          )}
        </div>

        {/* Rotated Stamp Badge */}
        <div
          className={cn(
            "stamp-badge text-[10px] tracking-widest font-extrabold uppercase px-2 py-0.5 rounded-xs transition-transform duration-200 group-hover:scale-105",
            statusConfig.className
          )}
        >
          {statusConfig.label}
        </div>
      </div>

      {/* Card Body: Customer & Service Description */}
      <div className="py-2 space-y-1">
        <h3 className="font-heading text-base font-bold text-text-primary tracking-tight group-hover:text-white transition-colors">
          {customerName}{" "}
          <span className="text-text-secondary font-normal font-sans">
            — {serviceDesc}
          </span>
        </h3>

        {(address || postcode) && (
          <div className="flex items-center space-x-1.5 text-xs text-text-muted truncate">
            <MapPin className="w-3 h-3 text-text-muted flex-shrink-0" />
            <span className="truncate">
              {address}
              {postcode ? `${address ? ", " : ""}${postcode}` : ""}
            </span>
          </div>
        )}
      </div>

      {/* Card Footer: Time Slot, Fee, Channel */}
      <div className="mt-3 pt-3 border-t border-border-hairline/60 flex items-center justify-between font-mono text-xs text-text-secondary">
        <div className="flex items-center space-x-1.5 text-text-primary">
          <Clock className="w-3.5 h-3.5 text-accent-brass" />
          <span className="font-bold tracking-tight">{timeLabel}</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          {/* Amount / Paid status */}
          <div className="flex items-center space-x-1">
            <span className="font-bold text-text-primary">
              £{amount}
            </span>
            <span
              className={cn(
                "text-[9px] px-1.5 py-0.2 rounded font-bold uppercase",
                isPaid
                  ? "text-accent-copper bg-accent-copper-muted font-extrabold border border-accent-copper/40"
                  : "text-text-muted bg-bg-surface-elevated"
              )}
            >
              {displayPaymentStatus}
            </span>
          </div>

          {/* Channel badge */}
          <span className="text-[10px] text-text-muted uppercase px-1.5 py-0.5 rounded bg-bg-surface-elevated border border-border-hairline">
            {booking.channel || "BOT"}
          </span>
        </div>
      </div>
    </div>
  );
}
