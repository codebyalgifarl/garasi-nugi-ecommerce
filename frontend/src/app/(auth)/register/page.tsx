import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return <AuthCard initialMode="register" />;
}
