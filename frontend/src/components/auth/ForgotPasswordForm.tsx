"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  PASSWORD_MIN_LENGTH,
  forgotPasswordEmailSchema,
  forgotPasswordOtpSchema,
  resetPasswordSchema,
  type ForgotPasswordEmailValues,
  type ForgotPasswordOtpValues,
  type ResetPasswordValues,
} from "@/lib/validators/auth";

type Step = "email" | "otp" | "reset" | "success";

/** Cooldown in seconds before user can resend OTP */
const RESEND_COOLDOWN = 60;

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("email");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayStep, setDisplayStep] = useState<Step>("email");

  // Resend cooldown timer
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // ---- Step transition (same fade logic as AuthCard) ----
  const transitionTo = useCallback(
    (target: Step) => {
      if (target === step || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setDisplayStep(target);
        setStep(target);
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      }, 300);
    },
    [step, isTransitioning],
  );

  // ---- Step 1: Email form ----
  const emailForm = useForm<ForgotPasswordEmailValues>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: { email: "" },
  });

  async function onEmailSubmit(values: ForgotPasswordEmailValues) {
    // ================================================================
    // TODO: Replace with actual API call to send OTP to user's email
    // ================================================================
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("[ForgotPassword] sending OTP to:", values.email);
    setSubmittedEmail(values.email);
    setCooldown(RESEND_COOLDOWN);
    transitionTo("otp");
  }

  // ---- Step 2: OTP form ----
  const otpForm = useForm<ForgotPasswordOtpValues>({
    resolver: zodResolver(forgotPasswordOtpSchema),
    defaultValues: { otp: "" },
  });

  async function onOtpSubmit(values: ForgotPasswordOtpValues) {
    // ================================================================
    // TODO: Replace with actual API call to verify OTP
    // ================================================================
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("[ForgotPassword] verifying OTP:", values.otp);
    transitionTo("reset");
  }

  async function handleResendOtp() {
    if (cooldown > 0) return;
    // ================================================================
    // TODO: Replace with actual API call to resend OTP
    // ================================================================
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("[ForgotPassword] resending OTP to:", submittedEmail);
    setCooldown(RESEND_COOLDOWN);
  }

  // ---- Step 3: Reset password form ----
  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onResetSubmit(values: ResetPasswordValues) {
    // ================================================================
    // TODO: Replace with actual API call to reset password
    //       Use `values.password` to send the new password.
    // ================================================================
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("[ForgotPassword] password reset complete");
    transitionTo("success");
  }

  // ---- Helper: panel CSS class ----
  function panelClass(panelStep: Step) {
    if (displayStep === panelStep) {
      return isTransitioning
        ? "auth-card-panel auth-card-panel--fading-out"
        : "auth-card-panel auth-card-panel--active";
    }
    return "auth-card-panel auth-card-panel--hidden";
  }

  // ---- Helper: mask email ----
  function maskEmail(email: string) {
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const visible = local.slice(0, 2);
    return `${visible}${"•".repeat(Math.max(local.length - 2, 2))}@${domain}`;
  }

  return (
    <div className="auth-card-container">
      {/* ──────────── Step 1: Enter Email ──────────── */}
      <div className={panelClass("email")}>
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/70 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter the email address associated with your account and we&apos;ll
            send you a code to reset your password.
          </p>

          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            noValidate
            className="mt-6 space-y-5"
          >
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="your-registered@email.com"
              required
              error={emailForm.formState.errors.email?.message}
              {...emailForm.register("email")}
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={emailForm.formState.isSubmitting}
              loadingText="Sending..."
            >
              Send Reset Link
            </Button>
          </form>

          <BackToLogin />
        </div>
      </div>

      {/* ──────────── Step 2: Enter OTP ──────────── */}
      <div className={panelClass("otp")}>
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/70 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Verify Code
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-gray-700">
              {maskEmail(submittedEmail)}
            </span>
            . Enter it below to continue.
          </p>

          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
            noValidate
            className="mt-6 space-y-5"
          >
            <Input
              label="Verification Code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              required
              error={otpForm.formState.errors.otp?.message}
              {...otpForm.register("otp")}
            />

            {/* Resend link with cooldown */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Didn&apos;t receive the code?
              </span>
              {cooldown > 0 ? (
                <span className="text-gray-400">
                  Resend in {cooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-semibold text-navy-600 underline underline-offset-4 hover:text-navy-700 cursor-pointer bg-transparent border-none p-0"
                >
                  Resend Code
                </button>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={otpForm.formState.isSubmitting}
              loadingText="Verifying..."
            >
              Verify Code
            </Button>
          </form>

          <BackToLogin />
        </div>
      </div>

      {/* ──────────── Step 3: New Password ──────────── */}
      <div className={panelClass("reset")}>
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/70 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create a new password for your account.
          </p>

          <form
            onSubmit={resetForm.handleSubmit(onResetSubmit)}
            noValidate
            className="mt-6 space-y-5"
          >
            <Input
              label="New Password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a new password"
              required
              hint={`At least ${PASSWORD_MIN_LENGTH} characters, with letters and numbers`}
              error={resetForm.formState.errors.password?.message}
              {...resetForm.register("password")}
            />

            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              required
              error={resetForm.formState.errors.confirmPassword?.message}
              {...resetForm.register("confirmPassword")}
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={resetForm.formState.isSubmitting}
              loadingText="Resetting..."
            >
              Reset Password
            </Button>
          </form>

          <BackToLogin />
        </div>
      </div>

      {/* ──────────── Step 4: Success ──────────── */}
      <div className={panelClass("success")}>
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/70 sm:p-8 text-center">
          {/* Checkmark icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            Password Reset!
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Your password has been successfully reset. You can now sign in
            with your new password.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-navy-700 active:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Small "back to login" link shown on every step */
function BackToLogin() {
  return (
    <div className="mt-6 text-center text-sm text-gray-500">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 font-medium text-navy-600 hover:text-navy-700 hover:underline transition-colors"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Remember your password? Sign in
      </Link>
    </div>
  );
}
