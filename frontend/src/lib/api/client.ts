/**
 * HTTP client tipis untuk backend NestJS Garasi Nugi.
 *
 * Base URL diambil dari NEXT_PUBLIC_API_URL (lihat .env.example).
 * Catatan: variabel NEXT_PUBLIC_* di-inline saat build, jadi wajib diakses
 * persis sebagai `process.env.NEXT_PUBLIC_API_URL` (bukan lewat destructuring).
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

/**
 * Bentuk body error dari NestJS (lihat backend src/auth/dto/auth-response.dto.ts):
 * - 400 validasi       → message: string[]
 * - 401 / 409 (custom) → message: { code, message }
 * - lainnya            → message: string
 */
interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[] | { code?: string; message?: string };
  error?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function toApiError(status: number, body: ApiErrorBody | null): ApiError {
  const fallback = body?.error ?? "Request failed";
  const message = body?.message;

  if (Array.isArray(message)) {
    return new ApiError(status, message[0] ?? fallback);
  }
  if (message && typeof message === "object") {
    return new ApiError(status, message.message ?? fallback, message.code);
  }
  if (typeof message === "string") {
    return new ApiError(status, message);
  }
  return new ApiError(status, fallback);
}

export async function apiPost<TResponse>(path: string, body: unknown): Promise<TResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set. Check frontend/.env.local");
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // Body bisa kosong / bukan JSON (mis. 502 dari proxy), jadi jangan sampai parse error menutupi status asli.
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw toApiError(response.status, data as ApiErrorBody | null);
  }

  return data as TResponse;
}
