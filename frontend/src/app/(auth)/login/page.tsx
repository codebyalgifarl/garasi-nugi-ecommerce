import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <AuthCard initialMode="login" />;
}
