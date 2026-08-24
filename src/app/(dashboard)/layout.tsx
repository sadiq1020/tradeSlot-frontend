"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMe } from "@/lib/queries/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useMe();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace("/login");
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-2 border-border-hairline border-t-accent-brass animate-spin" />
            <Loader2 className="absolute h-5 w-5 text-accent-brass animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-heading text-sm font-semibold tracking-wider text-text-primary uppercase">
              Loading Dispatch Board
            </p>
            <p className="font-mono text-xs text-text-secondary">
              Verifying active trader session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
