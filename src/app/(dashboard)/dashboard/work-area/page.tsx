"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns";
import {
  MapPin,
  Calendar,
  Plus,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Clock,
  Navigation,
} from "lucide-react";
import { AxiosError } from "axios";
import { workAreaSchema, WorkAreaFormData } from "@/lib/validations/work-area";
import { useWorkAreas, useCreateWorkArea } from "@/lib/queries/work-areas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkArea } from "@/types/api";

export default function WorkAreaPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    data: workAreas = [],
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useWorkAreas();

  const createMutation = useCreateWorkArea();

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkAreaFormData>({
    resolver: zodResolver(workAreaSchema),
    defaultValues: {
      date: todayStr,
      areaLabel: "",
      postcodes: "",
    },
  });

  const onSubmit = async (formData: WorkAreaFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    // Parse comma-separated postcodes into clean array if provided
    const parsedPostcodes = formData.postcodes
      ? formData.postcodes
          .split(",")
          .map((p) => p.trim().toUpperCase())
          .filter(Boolean)
      : undefined;

    try {
      await createMutation.mutateAsync({
        date: formData.date,
        areaLabel: formData.areaLabel.trim(),
        postcodes: parsedPostcodes,
      });

      setSuccessMessage(
        `Work area for ${formData.date} successfully set to "${formData.areaLabel}".`
      );
      reset({
        date: todayStr,
        areaLabel: "",
        postcodes: "",
      });

      // Clear success banner after 4 seconds
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setServerError(
          err.response?.data?.message ||
            "Failed to schedule work area. Please check the inputs."
        );
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Helper to format date display nicely
  const formatAreaDate = (dateStr: string) => {
    try {
      const parsed = parseISO(dateStr);
      let prefix = "";
      if (isToday(parsed)) prefix = "Today — ";
      else if (isTomorrow(parsed)) prefix = "Tomorrow — ";

      return `${prefix}${format(parsed, "EEEE, dd MMM yyyy")}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-text-primary">
            Work Area Setup
          </h2>
          <p className="font-sans text-xs text-text-secondary mt-1">
            Configure your daily operational zone so the chatbot only accepts bookings in your targeted areas.
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
            className={`w-3.5 h-3.5 mr-1.5 ${isRefetching ? "animate-spin text-accent-brass" : ""}`}
          />
          Sync Areas
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Schedule Area Form */}
        <div className="lg:col-span-5">
          <Card className="border-border-hairline bg-bg-surface sticky top-24">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-accent-brass" />
                <CardTitle className="text-base">Set Daily Zone</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Set where you will be working for any upcoming day.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {successMessage && (
                <div className="mb-4 rounded-md border border-accent-copper/40 bg-accent-copper-muted p-3 text-xs text-accent-copper flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {serverError && (
                <div className="mb-4 rounded-md border border-accent-rust/40 bg-accent-rust-muted p-3 text-xs text-accent-rust flex items-start space-x-2">
                  <span className="font-mono font-bold">ERROR:</span>
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Date Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="date">Service Date</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      className="font-mono text-sm uppercase"
                      {...register("date")}
                      disabled={createMutation.isPending}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-xs text-accent-rust mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                {/* Area Label Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="areaLabel">Area / District Label</Label>
                  <Input
                    id="areaLabel"
                    placeholder="e.g. North London, Camden, East Zone"
                    {...register("areaLabel")}
                    disabled={createMutation.isPending}
                  />
                  {errors.areaLabel && (
                    <p className="text-xs text-accent-rust mt-1">
                      {errors.areaLabel.message}
                    </p>
                  )}
                </div>

                {/* Postcodes Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="postcodes">Covered Postcodes (Optional)</Label>
                    <span className="font-mono text-[10px] text-text-muted">
                      Comma separated
                    </span>
                  </div>
                  <Input
                    id="postcodes"
                    placeholder="e.g. N1, N2, NW1, NW3"
                    className="font-mono text-xs uppercase"
                    {...register("postcodes")}
                    disabled={createMutation.isPending}
                  />
                  <p className="text-[11px] text-text-muted">
                    Leave blank to cover all requests in this area label.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full mt-3"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Work Area...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-1.5" />
                      Save Work Area
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Scheduled Areas Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm tracking-wide text-text-primary uppercase flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-accent-brass" />
              <span>Scheduled Work Areas ({workAreas.length})</span>
            </h3>
            <span className="font-mono text-xs text-text-muted">
              Live from backend
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-lg border border-border-hairline bg-bg-surface animate-pulse flex flex-col space-y-2.5"
                >
                  <div className="h-4 bg-bg-surface-elevated rounded w-1/3" />
                  <div className="h-5 bg-bg-surface-elevated rounded w-2/3" />
                  <div className="h-3 bg-bg-surface-elevated rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <Card className="border-accent-rust/30 bg-accent-rust-muted/20 text-center p-8">
              <p className="text-sm text-accent-rust font-semibold">
                Unable to load work areas
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Please check backend connectivity and try again.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-4 text-xs"
              >
                Retry
              </Button>
            </Card>
          ) : workAreas.length === 0 ? (
            <Card className="border-dashed border-border-hairline bg-bg-surface/30 text-center p-12">
              <div className="p-3 rounded-full bg-bg-surface border border-border-hairline w-fit mx-auto mb-3">
                <MapPin className="w-6 h-6 text-text-muted" />
              </div>
              <h4 className="font-heading font-semibold text-sm text-text-primary">
                No Work Areas Scheduled
              </h4>
              <p className="font-sans text-xs text-text-secondary max-w-sm mx-auto mt-1">
                Use the form on the left to set your operational zone for today or upcoming dates.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {workAreas.map((area: WorkArea) => {
                const isPastDate = isPast(parseISO(area.date)) && !isToday(parseISO(area.date));

                return (
                  <div
                    key={area.id}
                    className={`p-5 rounded-lg border bg-bg-surface transition-all ${
                      isPastDate
                        ? "border-border-hairline/60 opacity-60"
                        : "border-border-hairline hover:border-accent-brass/50 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-accent-brass">
                            {formatAreaDate(area.date)}
                          </span>
                          {isPastDate && (
                            <span className="font-mono text-[10px] text-text-muted uppercase px-1.5 py-0.5 rounded bg-bg-surface-elevated">
                              Past
                            </span>
                          )}
                        </div>

                        <h4 className="font-heading text-base font-bold text-text-primary">
                          {area.areaLabel}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-1.5 self-start sm:self-auto font-mono text-[11px] text-text-secondary">
                        <Clock className="w-3.5 h-3.5 text-text-muted" />
                        <span>Zone Active</span>
                      </div>
                    </div>

                    {/* Postcodes badges */}
                    {area.postcodes && area.postcodes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border-hairline/60 flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] text-text-muted uppercase mr-1">
                          Postcodes:
                        </span>
                        {area.postcodes.map((pc, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] px-2 py-0.5 rounded bg-bg-surface-elevated border border-border-hairline text-text-primary"
                          >
                            {pc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
