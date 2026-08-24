"use client";

import React from "react";
import Link from "next/link";
import { Plus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border-hairline/60">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-text-primary">
            Dispatch Board
          </h2>
          <p className="font-sans text-xs text-text-secondary">
            Manage, confirm, and review customer job tickets.
          </p>
        </div>

        <Link href="/webchat" target="_blank">
          <Button size="sm" className="space-x-2">
            <Plus className="w-4 h-4" />
            <span>Open Booking Bot</span>
          </Button>
        </Link>
      </div>

      <div className="p-8 rounded-lg border border-dashed border-border-hairline bg-bg-surface/30 flex flex-col items-center justify-center text-center space-y-3">
        <div className="p-3 rounded-full bg-bg-surface border border-border-hairline">
          <CalendarDays className="w-6 h-6 text-accent-brass" />
        </div>
        <div>
          <p className="font-heading font-semibold text-sm text-text-primary">
            Bookings Stream Ready
          </p>
          <p className="font-sans text-xs text-text-secondary max-w-sm mt-1">
            Job ticket cards and filters will be mounted in Step 9.
          </p>
        </div>
      </div>
    </div>
  );
}
