"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
      // Mengirim request login ke backend
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      // LOG BANTUAN: Menampilkan isi balasan backend ke console browser
      console.log("Data balasan dari NestJS:", data);

      if (!response.ok) {
        setErrorMsg(
          Array.isArray(data.message)
            ? data.message[0]
            : data.message || "Gagal login. Pastikan email dan password Anda benar."
        );
        return;
      }

      // PERBAIKAN: Memborong semua kemungkinan nama variabel token dari NestJS
      const token = data.data?.accessToken || data.accessToken || data.data?.access_token || data.access_token || data.token;

      // Jika berhasil login, simpan token JWT dan masuk ke halaman utama
      if (token) {
        localStorage.setItem("accessToken", token);
        router.push("/");
        router.refresh();
      } else {
        setErrorMsg("Token tidak ditemukan. Silakan cek tab Console (Inspect) di browser!");
      }
    } catch (error) {
      setErrorMsg("Gagal terhubung ke server. Pastikan backend (port 3001) menyala.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/70 sm:p-8">
      <h1 className="text-3xl font-bold text-gray-900">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Email address"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          required
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <Link href="/forgot-password" className="text-sm font-medium text-navy-600 hover:text-navy-500">
            Forgot your password?
          </Link>
        </div>

        {errorMsg && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} loadingText="Signing in...">
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-700">
        <p>Don't have an account yet?</p>
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="mt-1 inline-block font-semibold text-navy-600 underline underline-offset-4 hover:text-navy-700 cursor-pointer bg-transparent border-none p-0"
          >
            Create account
          </button>
        ) : (
          <Link href="/register" className="mt-1 inline-block font-semibold text-navy-600 underline underline-offset-4 hover:text-navy-700">
            Create account
          </Link>
        )}
      </div>
    </div>
  );
}