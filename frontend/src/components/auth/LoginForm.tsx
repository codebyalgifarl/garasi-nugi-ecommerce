"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { login, saveAccessToken, getAuthErrorMessage } from "@/lib/api/auth";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";

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
      const { access_token, user } = await login({
        email: values.email,
        password: values.password,
      });

      saveAccessToken(access_token);
      // Simpan data user supaya header bisa greeting tanpa panggil /auth/me lagi.
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
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