"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Eye, EyeOff, Lock, Mail, Wrench, Loader2 } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useLogin, useMe } from "@/lib/queries/auth";
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

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: user, isLoading: isCheckingAuth } = useMe();
  const loginMutation = useLogin();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!isCheckingAuth && user) {
      router.replace("/dashboard/bookings");
    }
  }, [user, isCheckingAuth, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFillDemo = () => {
    setValue("email", "trader@tradeslot.com", { shouldValidate: true });
    setValue("password", "password123", { shouldValidate: true });
    setServerError(null);
  };

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await loginMutation.mutateAsync(data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setServerError(
          err.response?.data?.message ||
            "Authentication failed. Please check your credentials."
        );
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="flex items-center space-x-3 text-text-secondary">
          <Loader2 className="w-6 h-6 animate-spin text-accent-brass" />
          <span className="font-mono text-sm tracking-wider uppercase">
            Verifying terminal access...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-base relative overflow-hidden">
      {/* Background subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-lg bg-bg-surface border border-border-hairline flex items-center justify-center shadow-inner">
            <Wrench className="w-6 h-6 text-accent-brass" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary uppercase">
            TradeSlot
          </h1>
          <p className="font-mono text-xs text-text-secondary tracking-widest uppercase">
            Dispatch Board &bull; Trader Terminal
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border-hairline bg-bg-surface/90 backdrop-blur shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Sign In to Dashboard</CardTitle>
            <CardDescription className="text-xs">
              Enter your credentials to manage your work areas, bookings & payments.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {serverError && (
              <div className="mb-4 rounded-md border border-accent-rust/40 bg-accent-rust-muted p-3 text-xs text-accent-rust flex items-start space-x-2">
                <span className="font-mono font-bold">ERROR:</span>
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email field */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Trader Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="trader@tradeslot.com"
                    className="pl-9 font-sans"
                    {...register("email")}
                    disabled={loginMutation.isPending}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-accent-rust mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 font-sans"
                    {...register("password")}
                    disabled={loginMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-accent-rust mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Access Dispatch Board"
                )}
              </Button>
            </form>

            {/* Demo Trader Auto-Fill Button for Reviewers */}
            <div className="mt-4 pt-4 border-t border-border-hairline/80 flex flex-col items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFillDemo}
                className="w-full text-xs text-accent-brass border-accent-brass/30 hover:bg-accent-brass-muted hover:text-accent-brass hover:border-accent-brass"
              >
                <Wrench className="w-3.5 h-3.5 mr-1.5" />
                Fill Demo Trader Credentials
              </Button>
              <p className="mt-1.5 text-[10px] font-mono text-text-muted text-center">
                Reviewer shortcut &bull; trader@tradeslot.com / password123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="text-center font-mono text-[11px] text-text-muted">
          TradeSlot MVP v1.0 &bull; Secure JWT Session
        </div>
      </div>
    </div>
  );
}
