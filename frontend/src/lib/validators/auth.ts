import { z } from "zod";

/**
 * TODO [EP2-03]: konfirmasi aturan password ke Ridwan (backend).
 * Aturan di frontend WAJIB sama dengan backend, supaya user tidak lolos
 * validasi di sini tapi ditolak di server.
 */
export const PASSWORD_MIN_LENGTH = 8;

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address, e.g. name@example.com");

export const loginSchema = z.object({
  email: emailField,
  // Saat login cukup cek tidak kosong — aturan panjang/kompleksitas hanya saat register
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be 100 characters or fewer"),
  email: emailField,
  password: z
    .string()
    .min(
      PASSWORD_MIN_LENGTH,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
    )
    .regex(/[A-Za-z]/, "Password must include at least one letter")
    .regex(/\d/, "Password must include at least one number"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
