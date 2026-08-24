"use client";

import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { Booking, BookingStatus } from "@/types/api";
import {
  useUpdateBookingStatus,
  useCancelBooking,
} from "@/lib/queries/bookings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailModalProps) {
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  const updateStatusMutation = useUpdateBookingStatus();
  const cancelMutation = useCancelBooking();

  if (!isOpen || !booking) return null;

  const shortId = `#${booking.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

  const formatFullDateTime = () => {
    try {
      const start = parseISO(booking.startTime);
      const end = parseISO(booking.endTime);
      return {
        date: format(start, "EEEE, dd MMMM yyyy"),
        time: `${format(start, "HH:mm")} — ${format(end, "HH:mm")}`,
      };
    } catch {
      return { date: "Date Pending", time: "Time Pending" };
    }
  };

  const { date, time } = formatFullDateTime();

  const handleUpdateStatus = async (status: BookingStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: booking.id, status });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await cancelMutation.mutateAsync({
        id: booking.id,
        reason: cancelReason || "Cancelled by trader",
      });
      setShowCancelPrompt(false);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const isPending =
    updateStatusMutation.isPending || cancelMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-xl bg-bg-surface border border-border-hairline shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-hairline bg-bg-base/60">
          <div className="flex items-center space-x-3">
            <div className="font-mono text-sm font-bold text-accent-brass">
              {shortId}
            </div>
            <span
              className={cn(
                "stamp-badge text-[10px] px-2 py-0.5",
                booking.status === "CONFIRMED"
                  ? "border-accent-brass text-accent-brass bg-accent-brass-muted"
                  : booking.status === "PENDING"
                  ? "border-accent-rust text-accent-rust bg-accent-rust-muted"
                  : booking.status === "COMPLETED"
                  ? "border-accent-copper text-accent-copper bg-accent-copper-muted"
                  : "border-border-hairline text-text-muted"
              )}
            >
              {booking.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Job Overview */}
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
              CUSTOMER & JOB REQUEST
            </p>
            <h2 className="font-heading text-xl font-bold text-text-primary">
              {booking.customerName}
            </h2>
            <p className="font-sans text-sm text-text-secondary">
              {booking.serviceDescription}
            </p>
          </div>

          {/* Schedule & Location Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-bg-base border border-border-hairline">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-text-muted uppercase flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-accent-brass" />
                <span>Scheduled Date</span>
              </span>
              <p className="font-mono text-xs font-semibold text-text-primary">
                {date}
              </p>
              <p className="font-mono text-xs text-accent-brass font-bold flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3" />
                <span>{time}</span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-text-muted uppercase flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-accent-brass" />
                <span>Service Address</span>
              </span>
              <p className="font-sans text-xs text-text-primary">
                {booking.address || "Address provided during chat"}
              </p>
              {booking.postcode && (
                <span className="inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg-surface border border-border-hairline text-accent-brass mt-1">
                  {booking.postcode}
                </span>
              )}
            </div>
          </div>

          {/* Customer Contact Details */}
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
              CONTACT INFORMATION
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {booking.customerPhone && (
                <div className="flex items-center space-x-2 p-2.5 rounded bg-bg-surface-elevated border border-border-hairline">
                  <Phone className="w-3.5 h-3.5 text-text-muted" />
                  <span className="font-mono text-text-primary">
                    {booking.customerPhone}
                  </span>
                </div>
              )}
              {booking.customerEmail && (
                <div className="flex items-center space-x-2 p-2.5 rounded bg-bg-surface-elevated border border-border-hairline">
                  <Mail className="w-3.5 h-3.5 text-text-muted" />
                  <span className="font-mono text-text-primary truncate">
                    {booking.customerEmail}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Billing & Payout Breakdown */}
          <div className="p-4 rounded-lg bg-bg-surface-elevated border border-border-hairline space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text-secondary flex items-center space-x-1.5">
                <CreditCard className="w-3.5 h-3.5 text-accent-copper" />
                <span>Job Flat Fee:</span>
              </span>
              <span className="font-mono text-sm font-bold text-text-primary">
                £{booking.amount || 50}.00
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-muted">Platform Fee:</span>
              <span className="text-text-secondary">
                £{booking.platformFee || 5}.00
              </span>
            </div>

            <div className="pt-2 border-t border-border-hairline flex items-center justify-between font-mono text-xs">
              <span className="text-text-muted">Payment Status:</span>
              <span
                className={cn(
                  "font-bold uppercase px-2 py-0.5 rounded",
                  booking.paymentStatus === "PAID"
                    ? "text-accent-copper bg-accent-copper-muted"
                    : "text-accent-rust bg-accent-rust-muted"
                )}
              >
                {booking.paymentStatus || "UNPAID"}
              </span>
            </div>
          </div>

          {/* Cancel Reason Prompt Drawer if triggered */}
          {showCancelPrompt && (
            <div className="p-4 rounded-lg border border-accent-rust bg-accent-rust-muted/30 space-y-3">
              <div className="flex items-center space-x-2 text-accent-rust">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-heading font-semibold text-sm">
                  Cancel this Booking?
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                This will release the slot and mark the job ticket as cancelled.
              </p>
              <input
                type="text"
                placeholder="Cancellation reason (optional)..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2 rounded bg-bg-surface border border-border-hairline text-text-primary placeholder:text-text-muted"
              />
              <div className="flex items-center space-x-2 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCancelPrompt(false)}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleCancelBooking}
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm Cancel"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        {!showCancelPrompt && (
          <div className="p-4 border-t border-border-hairline bg-bg-base/80 flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCancelPrompt(true)}
              disabled={isPending || booking.status === "CANCELLED"}
              className="text-accent-rust hover:text-accent-rust hover:border-accent-rust"
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5" />
              Cancel Job
            </Button>

            <div className="flex items-center space-x-2">
              {booking.status === "PENDING" && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus("CONFIRMED")}
                  disabled={isPending}
                  className="bg-accent-brass text-[#0E1217] hover:bg-accent-brass-hover"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Confirm Job
                </Button>
              )}

              {booking.status === "CONFIRMED" && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleUpdateStatus("COMPLETED")}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Mark Completed
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
