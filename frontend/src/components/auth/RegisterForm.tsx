"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  PASSWORD_MIN_LENGTH,
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validators/auth";

interface RegisterFormProps {
  /** When provided, "Sign in here" triggers this callback instead of navigating. */
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps = {}) {
  const [notice, setNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    setNotice(null);

    // ================================================================
    // TODO [EP2-03]: ganti simulasi ini dengan call ke API register
    // backend Garasi Nugi. Error "email sudah dipakai" dari API
    // tampilkan pakai setError("email", { message }) dari react-hook-form.
    // ================================================================
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("[RegisterForm] valid submit:", {
      fullName: values.fullName,
      email: values.email,
    }); // jangan pernah log password
    setNotice("Form valid. Account creation will work once the auth API is connected.");
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/70 sm:p-8">
      <h1 className="text-3xl font-bold text-gray-900">Register</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-5"
      >
        <Input
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          required
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          required
          hint={`At least ${PASSWORD_MIN_LENGTH} characters, with letters and numbers`}
          error={errors.password?.message}
          {...register("password")}
        />

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
          loadingText="Creating account..."
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-700">
        <p>Already have an account?</p>
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="mt-1 inline-block font-semibold text-navy-600 underline underline-offset-4 hover:text-navy-700 cursor-pointer bg-transparent border-none p-0"
          >
            Sign in here
          </button>
        ) : (
          <Link
            href="/login"
            className="mt-1 inline-block font-semibold text-navy-600 underline underline-offset-4 hover:text-navy-700"
          >
            Sign in here
          </Link>
        )}
      </div>
    </div>
  );
}
