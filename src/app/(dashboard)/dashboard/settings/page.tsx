"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Building2,
  ArrowRight,
  Info,
  DollarSign,
} from "lucide-react";
import {
  useConnectStatus,
  useCreateConnectOnboarding,
} from "@/lib/queries/payments";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function SettingsContent() {
  const searchParams = useSearchParams();
  const stripeParam = searchParams.get("stripe");

  const [returnBanner, setReturnBanner] = useState<string | null>(null);

  const {
    data: connectStatus,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useConnectStatus();

  const onboardMutation = useCreateConnectOnboarding();

  // If returning from Stripe onboarding redirect
  useEffect(() => {
    if (stripeParam === "return") {
      setReturnBanner(
        "Returned from Stripe Connect. Syncing updated account status..."
      );
      refetch();
    } else if (stripeParam === "refresh") {
      setReturnBanner(
        "Stripe link refreshed. Please click Connect to continue."
      );
      refetch();
    }
  }, [stripeParam, refetch]);

  const chargesEnabled = Boolean(connectStatus?.chargesEnabled);
  const payoutsEnabled = Boolean(connectStatus?.payoutsEnabled);
  const detailsSubmitted = Boolean(connectStatus?.detailsSubmitted);

  const isFullyConnected = chargesEnabled && payoutsEnabled;

  const handleStartOnboarding = async () => {
    try {
      await onboardMutation.mutateAsync();
    } catch (err) {
      console.error("Failed to initiate Stripe onboarding", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-text-primary uppercase">
            Settings & Stripe Connect
          </h2>
          <p className="font-sans text-xs text-text-secondary mt-1">
            Configure direct payments and automated payout processing for your completed trade jobs.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="self-start sm:self-auto text-xs"
        >
          <RefreshCw
            className={cn(
              "w-3.5 h-3.5 mr-1.5",
              isRefetching && "animate-spin text-accent-brass"
            )}
          />
          Sync Status
        </Button>
      </div>

      {/* Return notification if present */}
      {returnBanner && (
        <div className="rounded-lg border border-accent-copper/40 bg-accent-copper-muted/40 p-4 text-xs text-accent-copper flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="font-sans font-medium">{returnBanner}</span>
          </div>
          <button
            onClick={() => setReturnBanner(null)}
            className="text-text-muted hover:text-text-primary underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stripe Account Status Card */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border-hairline bg-bg-surface overflow-hidden">
            <CardHeader className="pb-4 border-b border-border-hairline/60 bg-bg-surface-elevated/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="h-9 w-9 rounded-md bg-bg-surface border border-border-hairline flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-accent-brass" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Stripe Connect Express
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Direct merchant payout destination
                    </CardDescription>
                  </div>
                </div>

                {/* Live Status Stamp */}
                <div
                  className={cn(
                    "stamp-badge text-[10px] tracking-widest uppercase px-2.5 py-1",
                    isLoading
                      ? "border-border-hairline text-text-muted bg-bg-surface"
                      : isFullyConnected
                      ? "border-accent-copper/80 text-accent-copper bg-accent-copper-muted/30"
                      : "border-accent-rust/80 text-accent-rust bg-accent-rust-muted/30"
                  )}
                >
                  {isLoading
                    ? "CHECKING..."
                    : isFullyConnected
                    ? "ACTIVE & CONNECTED"
                    : "SETUP REQUIRED"}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Status checklist metrics */}
              <div className="space-y-3">
                <p className="font-mono text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                  ACCOUNT CAPABILITY STATUS
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Metric 1: Charges */}
                  <div className="p-3.5 rounded-lg bg-bg-base border border-border-hairline space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-text-muted uppercase">
                        Charges
                      </span>
                      {chargesEnabled ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-copper" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-accent-rust" />
                      )}
                    </div>
                    <p className="font-heading text-xs font-bold text-text-primary">
                      {chargesEnabled ? "ENABLED" : "RESTRICTED"}
                    </p>
                    <p className="text-[10px] text-text-secondary leading-tight">
                      {chargesEnabled
                        ? "Able to accept customer payments"
                        : "Requires onboarding"}
                    </p>
                  </div>

                  {/* Metric 2: Payouts */}
                  <div className="p-3.5 rounded-lg bg-bg-base border border-border-hairline space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-text-muted uppercase">
                        Payouts
                      </span>
                      {payoutsEnabled ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-copper" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-accent-rust" />
                      )}
                    </div>
                    <p className="font-heading text-xs font-bold text-text-primary">
                      {payoutsEnabled ? "ENABLED" : "RESTRICTED"}
                    </p>
                    <p className="text-[10px] text-text-secondary leading-tight">
                      {payoutsEnabled
                        ? "Bank transfers active"
                        : "Bank account pending"}
                    </p>
                  </div>

                  {/* Metric 3: Details */}
                  <div className="p-3.5 rounded-lg bg-bg-base border border-border-hairline space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-text-muted uppercase">
                        Details
                      </span>
                      {detailsSubmitted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-copper" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-accent-rust" />
                      )}
                    </div>
                    <p className="font-heading text-xs font-bold text-text-primary">
                      {detailsSubmitted ? "SUBMITTED" : "INCOMPLETE"}
                    </p>
                    <p className="text-[10px] text-text-secondary leading-tight">
                      {detailsSubmitted
                        ? "KYC & identity verified"
                        : "Form info needed"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account ID / Info */}
              {connectStatus?.accountId && (
                <div className="p-3 rounded bg-bg-surface-elevated border border-border-hairline flex items-center justify-between font-mono text-xs">
                  <span className="text-text-muted">Stripe Account ID:</span>
                  <span className="text-accent-brass font-bold">
                    {connectStatus.accountId}
                  </span>
                </div>
              )}

              {/* Onboarding Button */}
              <div className="pt-2">
                <Button
                  onClick={handleStartOnboarding}
                  disabled={onboardMutation.isPending}
                  className="w-full sm:w-auto text-xs font-semibold px-6"
                >
                  {onboardMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {isFullyConnected
                        ? "Manage Stripe Account / Payouts"
                        : "Connect with Stripe"}
                      <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </>
                  )}
                </Button>
                <p className="mt-2 text-[11px] text-text-muted">
                  You will be securely redirected to Stripe's hosted Express onboarding to link your bank account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Platform Billing & Fee Explanation */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border-hairline bg-bg-surface">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-accent-brass" />
                <CardTitle className="text-base">Billing & Fee Model</CardTitle>
              </div>
              <CardDescription className="text-xs">
                How payments and fees are captured on TradeSlot
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-bg-base border border-border-hairline space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-hairline/60">
                  <span className="text-xs text-text-secondary">
                    Customer Job Fee
                  </span>
                  <span className="font-mono text-sm font-bold text-text-primary">
                    £50.00
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border-hairline/60 text-xs">
                  <span className="text-text-muted">Platform Flat Fee</span>
                  <span className="font-mono text-accent-rust font-semibold">
                    - £5.00
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-heading text-xs font-bold text-text-primary">
                    Trader Net Payout
                  </span>
                  <span className="font-mono text-base font-bold text-accent-copper">
                    £45.00
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-bg-surface-elevated border border-border-hairline space-y-2 text-xs text-text-secondary">
                <div className="flex items-center space-x-1.5 text-text-primary font-medium">
                  <Info className="w-3.5 h-3.5 text-accent-brass" />
                  <span>Automated Split Processing</span>
                </div>
                <p className="text-[11px] leading-relaxed text-text-muted">
                  Every confirmed booking processed through Stripe automatically captures the platform application fee and routes the remaining net balance directly to your connected bank account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-accent-brass" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
