import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your Garasi Nugi account password. Enter your email to receive a verification code.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
