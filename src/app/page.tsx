"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/lib/queries/auth";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();
  const { data: user, isLoading } = useMe();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/dashboard/bookings");
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base">
      <div className="flex items-center space-x-3 text-text-secondary">
        <Loader2 className="w-5 h-5 animate-spin text-accent-brass" />
        <span className="font-mono text-xs tracking-wider uppercase">
          Initializing TradeSlot...
        </span>
      </div>
    </div>
  );
}
