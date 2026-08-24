"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useConnectStatus } from "@/lib/queries/payments";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export function Header({
  onMobileMenuToggle,
  isMobileMenuOpen,
}: HeaderProps) {
  const pathname = usePathname();
  const { data: connectStatus, isLoading: isCheckingStripe } = useConnectStatus();

  // Determine section title based on active route
  const getPageTitle = () => {
    if (pathname.includes("/dashboard/work-area")) return "Work area schedule";
    if (pathname.includes("/dashboard/settings")) return "Settings & Payments";
    return "Today's bookings";
  };

  const isStripeConnected = Boolean(
    connectStatus?.chargesEnabled && connectStatus?.payoutsEnabled
  );

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border-hairline bg-bg-base/80 backdrop-blur sticky top-0 z-20 select-none">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="p-2 -ml-2 rounded-md md:hidden text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors"
          aria-label="Toggle Navigation Drawer"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        <h1 className="font-heading text-lg md:text-xl font-bold tracking-tight text-text-primary">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Stripe Connect Status Badge */}
      <div className="flex items-center space-x-3">
        <Link href="/dashboard/settings">
          <div
            className={cn(
              "stamp-badge transition-all hover:scale-[1.02] cursor-pointer",
              isCheckingStripe
                ? "border-border-hairline text-text-muted bg-bg-surface"
                : isStripeConnected
                ? "border-accent-copper/60 text-accent-copper bg-accent-copper-muted/30"
                : "border-accent-rust/60 text-accent-rust bg-accent-rust-muted/30"
            )}
          >
            <div className="flex items-center space-x-1.5">
              {isStripeConnected ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span className="font-mono text-[11px] font-bold tracking-wider">
                {isCheckingStripe
                  ? "CHECKING STRIPE..."
                  : isStripeConnected
                  ? "STRIPE CONNECTED"
                  : "STRIPE PENDING"}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
