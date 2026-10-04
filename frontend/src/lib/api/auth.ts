import { ApiError, apiPost } from "./client";

/* ------------------------------------------------------------------ */
/*  Types — mirror dari backend src/auth/dto/*.ts                      */
/*  Kalau DTO backend berubah, update di sini juga.                    */
/* ------------------------------------------------------------------ */

/** UserResponseDto */
export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: "customer" | "admin";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** LoginDto */
export interface LoginPayload {
  email: string;
  password: string;
}

/** RegisterDto — backend menerima `fullName` (camelCase), bukan `name` */
export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

/** LoginResponseDto — flat, tidak dibungkus `{ data: ... }` */
export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

/** RegisterResponseDto — hanya data user, TIDAK ada token (tidak auto-login) */
export type RegisterResponse = AuthUser;

/* ------------------------------------------------------------------ */
/*  Requests                                                           */
/* ------------------------------------------------------------------ */

export function login(payload: LoginPayload) {
  return apiPost<LoginResponse>("/auth/login", payload);
}

export function register(payload: RegisterPayload) {
  return apiPost<RegisterResponse>("/auth/register", payload);
}

/* ------------------------------------------------------------------ */
/*  Token storage                                                      */
/* ------------------------------------------------------------------ */

const ACCESS_TOKEN_KEY = "accessToken";

// TODO(security): localStorage rentan dicuri lewat XSS. Pindah ke httpOnly cookie
// (perlu perubahan di backend) — dicatat sebagai technical debt sprint berikutnya.
export function saveAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/* ------------------------------------------------------------------ */
/*  Error → pesan untuk user                                           */
/* ------------------------------------------------------------------ */

/** Kode error custom dari backend src/auth/auth.service.ts */
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  ACCOUNT_INACTIVE: "ACCOUNT_INACTIVE",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
} as const;

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case AUTH_ERROR_CODES.INVALID_CREDENTIALS:
        return "Incorrect email or password.";
      case AUTH_ERROR_CODES.ACCOUNT_INACTIVE:
        return "Your account is inactive. Please contact our support team.";
      case AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS:
        return "This email is already registered. Try signing in instead.";
    }
    if (error.status >= 500) {
      return "Something went wrong on our side. Please try again in a moment.";
    }
    return error.message;
  }

  // Network error / env belum di-set: detail teknis cukup di console saat development.
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }
  return "Unable to reach the server. Please check your connection and try again.";
}
