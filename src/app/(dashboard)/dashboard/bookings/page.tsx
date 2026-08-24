"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDays,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Layers,
  MessageSquare,
} from "lucide-react";
import { useBookings } from "@/lib/queries/bookings";
import { Booking, BookingStatus } from "@/types/api";
import { JobTicketCard } from "@/components/dashboard/job-ticket-card";
import { BookingDetailModal } from "@/components/dashboard/booking-detail-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const {
    data: bookings = [],
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useBookings({
    status: statusFilter,
    date: dateFilter || undefined,
    search: searchQuery || undefined,
  });

  const filterTabs: Array<{ label: string; value: BookingStatus | "ALL" }> = [
    { label: "All Tickets", value: "ALL" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Pending", value: "PENDING" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border-hairline">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-text-primary uppercase">
            Dispatch Board
          </h2>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Active customer bookings, travel buffer intervals & job status tickets.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="text-xs"
          >
            <RefreshCw
              className={cn(
                "w-3.5 h-3.5 mr-1.5",
                isRefetching && "animate-spin text-accent-brass"
              )}
            />
            Sync Board
          </Button>

          <Link href="/webchat" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="text-xs font-semibold space-x-1.5">
              <Plus className="w-4 h-4" />
              <span>+ New Booking (Bot)</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 border-b border-border-hairline/60">
          {filterTabs.map((tab) => {
            const isSelected = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "font-mono text-xs px-3.5 py-1.5 rounded-t-md font-semibold transition-colors whitespace-nowrap cursor-pointer",
                  isSelected
                    ? "bg-bg-surface text-accent-brass border-t-2 border-accent-brass border-x border-border-hairline"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-surface/40"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Date Filter & Search Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          {/* Search box */}
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Filter by customer name, address or postcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Date Picker Filter */}
          <div className="sm:col-span-4 flex items-center space-x-2">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs font-mono"
            />
            {dateFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateFilter("")}
                className="text-xs text-text-muted hover:text-text-primary"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bookings Job Ticket Cards Stream */}
      <div className="space-y-4 pt-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-lg border border-border-hairline bg-bg-surface animate-pulse space-y-3"
              >
                <div className="flex justify-between">
                  <div className="h-4 bg-bg-surface-elevated rounded w-24" />
                  <div className="h-4 bg-bg-surface-elevated rounded w-16" />
                </div>
                <div className="h-6 bg-bg-surface-elevated rounded w-1/2" />
                <div className="h-4 bg-bg-surface-elevated rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 rounded-lg border border-accent-rust/30 bg-accent-rust-muted/20 text-center space-y-2">
            <p className="text-sm font-semibold text-accent-rust">
              Unable to load dispatch bookings
            </p>
            <p className="text-xs text-text-secondary">
              Please verify backend connectivity and try syncing again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2 text-xs"
            >
              Retry Sync
            </Button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 rounded-lg border border-dashed border-border-hairline bg-bg-surface/30 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-bg-surface border border-border-hairline">
              <CalendarDays className="w-8 h-8 text-accent-brass/80" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="font-heading font-semibold text-base text-text-primary">
                No Bookings Found
              </h3>
              <p className="font-sans text-xs text-text-secondary">
                There are no job tickets matching the current filter criteria.
                Customers can book slots through the webchat chatbot.
              </p>
            </div>

            <Link href="/webchat" target="_blank">
              <Button size="sm" className="text-xs">
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                Launch Customer Webchat Bot
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {bookings.map((booking: Booking) => (
              <JobTicketCard
                key={booking.id}
                booking={booking}
                onClick={() => setSelectedBooking(booking)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
