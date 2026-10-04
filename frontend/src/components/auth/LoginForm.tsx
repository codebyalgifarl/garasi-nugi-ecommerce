"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";

/**
 * Shape response /auth/login dari backend Garasi Nugi.
 * Sumber: src/auth/dto/auth-response.dto.ts → LoginResponseDto.
 * CATATAN: backend pakai snake_case (access_token, full_name, is_active).
 */
interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    role: "customer" | "admin";
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

/** Shape response error dari NestJS (400/401/409). */
interface ApiError {
  statusCode: number;
  // 400: string | string[]. 401/409: { code, message } (lihat ErrorResponseDto)
  message: string | string[] | { code: string; message: string };
  error: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Ambil pesan error user-friendly dari berbagai bentuk response NestJS. */
function extractErrorMessage(data: unknown, fallback: string): string {
  const err = data as ApiError;
  if (!err?.message) return fallback;
  if (typeof err.message === "string") return err.message;
  if (Array.isArray(err.message)) return err.message[0] ?? fallback;
  // Shape { code, message } untuk 401/409
  if (typeof err.message === "object" && "message" in err.message) {
    return err.message.message;
  }
  return fallback;
}

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps = {}) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setErrorMsg(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data: LoginResponse | ApiError = await response.json();

      if (!response.ok) {
        setErrorMsg(
          extractErrorMessage(
            data,
            "Email or password is incorrect. Please try again."
          )
        );
        return;
      }

      const loginData = data as LoginResponse;

      // Simpan token + data user. Token dipakai di Authorization header,
      // data user dipakai untuk menampilkan nama di header, dsb.
      // TODO [security]: pindah ke httpOnly cookie sebelum go-live.
      localStorage.setItem("accessToken", loginData.access_token);
      localStorage.setItem("user", JSON.stringify(loginData.user));

      router.push("/");
      router.refresh();
    } catch {
      // Masuk sini kalau network error (backend mati, CORS, dll)
      setErrorMsg(
        "We couldn't reach the server. Please check your connection and try again."
      );
    }
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
          <Link
            href="/forgot-password"
            className="mt-3 inline-block text-sm font-medium text-navy-600 hover:text-navy-700 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="rounded-lg border border-error/30 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorMsg}
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
            className="mt-1 inline-block font-semibold text-navy-600 underline underline-offset-4 hover:text-navy-700"
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