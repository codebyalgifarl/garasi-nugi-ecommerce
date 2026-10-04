"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api/client";
import {
  AUTH_ERROR_CODES,
  getAuthErrorMessage,
  register as registerUser,
} from "@/lib/api/auth";
import {
  PASSWORD_MIN_LENGTH,
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validators/auth";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps = {}) {
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    setNotice(null);
    setErrorMsg(null);

    try {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });

      // Register TIDAK auto-login (RegisterResponseDto tidak punya access_token).
      // Tampilkan notice sukses + arahkan user ke /login.
      setNotice("Account created! Please sign in to continue.");
      setTimeout(() => {
        if (onSwitchToLogin) {
          onSwitchToLogin();
        } else {
          router.push("/login");
        }
      }, 1500);
    } catch (error) {
      // Email conflict (409) → highlight ke field email, bukan banner umum.
      if (
        error instanceof ApiError &&
        error.code === AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS
      ) {
        setError("email", { message: getAuthErrorMessage(error) });
        return;
      }

      setErrorMsg(getAuthErrorMessage(error));
    }
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

        {errorMsg && (
          <div
            role="alert"
            className="rounded-lg border border-error/30 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorMsg}
          </div>
        )}

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
            className="mt-1 inline-block font-semibold text-navy-600 underline underline-offset-4 hover:text-navy-700"
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