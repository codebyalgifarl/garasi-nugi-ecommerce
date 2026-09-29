"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";

interface LoginFormProps {
  /** When provided, "Create account" triggers this callback instead of navigating. */
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps = {}) {
  const [notice, setNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setNotice(null);

    // ================================================================
    // TODO [EP2-03]: ganti simulasi ini dengan call ke API auth
    // backend Garasi Nugi (BUKAN langsung ke Jubelio), lalu:
    //   1. simpan token/session
    //   2. router.push("/") → redirect ke homepage (AC ke-3)
    //   3. tampilkan error dari API di bawah (AC ke-2)
    // ================================================================
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("[LoginForm] valid submit:", { email: values.email }); // jangan pernah log password
    setNotice("Form valid. Sign-in will work once the auth API is connected.");
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/70 sm:p-8">
      <h1 className="text-3xl font-bold text-gray-900">Login</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-5"
      >
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            required
            error={errors.password?.message}
            {...register("password")}
          />
          {/* Link ke halaman forgot-password */}
          <Link
            href="/forgot-password"
            className="mt-3 inline-block text-sm font-medium text-navy-600 hover:text-navy-700 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        {notice && (
          <div
            role="status"
            className="rounded-lg border border-info/30 bg-blue-50 px-4 py-3 text-sm text-blue-800"
          >
            {notice}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          loadingText="Signing in..."
        >
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-700">
        <p>Don&apos;t have an account yet?</p>
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="mt-1 inline-block font-semibold text-navy-600 underline underline-offset-4 hover:text-navy-700 cursor-pointer bg-transparent border-none p-0"
          >
            Create account
          </button>
        ) : (
          <Link
            href="/register"
            className="mt-1 inline-block font-semibold text-navy-600 underline underline-offset-4 hover:text-navy-700"
          >
            Create account
          </Link>
        )}
      </div>
    </div>
  );
}
