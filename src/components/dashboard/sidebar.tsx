"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Settings,
  LogOut,
  Wrench,
  MessageSquare,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useLogout, useMe } from "@/lib/queries/auth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();
  const { data: user } = useMe();
  const logoutMutation = useLogout();

  const navItems = [
    {
      title: "Work area",
      href: "/dashboard/work-area",
      icon: MapPin,
    },
    {
      title: "Bookings",
      href: "/dashboard/bookings",
      icon: CalendarDays,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-bg-base border-r border-border-hairline select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border-hairline">
        <Link
          href="/dashboard/bookings"
          className="flex items-center space-x-2.5 group"
          onClick={onNavClick}
        >
          <div className="h-8 w-8 rounded bg-bg-surface border border-border-hairline flex items-center justify-center group-hover:border-accent-brass transition-colors">
            <Wrench className="w-4 h-4 text-accent-brass" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-text-primary group-hover:text-accent-brass transition-colors uppercase">
            TradeSlot
          </span>
        </Link>
      </div>

      {/* Drawer Section Label */}
      <div className="px-6 pt-6 pb-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          DISPATCH NAVIGATION
        </p>
      </div>

      {/* Navigation Links (Toolbox Drawers) */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-bg-surface text-accent-brass border-l-2 border-accent-brass font-semibold shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface/50 border-l-2 border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive
                    ? "text-accent-brass"
                    : "text-text-secondary group-hover:text-text-primary"
                )}
              />
              <span className="font-sans">{item.title}</span>
            </Link>
          );
        })}

        {/* Public Webchat Shortcut */}
        <div className="pt-4 mt-4 border-t border-border-hairline/60">
          <p className="px-3 pb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            CUSTOMER CHANNEL
          </p>
          <Link
            href="/webchat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface/50 transition-all group border-l-2 border-transparent"
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4 text-accent-copper" />
              <span>Webchat Widget</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary transition-colors" />
          </Link>
        </div>
      </nav>

      {/* Trader Profile & Logout Panel */}
      <div className="p-3 border-t border-border-hairline bg-bg-surface/30">
        <div className="flex items-center justify-between p-2 rounded-md bg-bg-surface border border-border-hairline/80">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="h-8 w-8 rounded bg-bg-surface-elevated border border-border-hairline flex items-center justify-center text-accent-brass font-mono text-xs font-bold flex-shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "TR"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs text-text-primary truncate">
                {user?.name || "Trader Terminal"}
              </p>
              <p className="font-mono text-[10px] text-text-secondary truncate">
                {user?.email || "trader@tradeslot.com"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            title="Sign out of terminal"
            className="p-1.5 rounded text-text-muted hover:text-accent-rust hover:bg-accent-rust-muted/40 transition-colors ml-1 flex-shrink-0 disabled:opacity-50"
          >
            {logoutMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-accent-rust" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
