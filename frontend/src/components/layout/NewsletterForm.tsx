"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();

    if (!EMAIL_PATTERN.test(email)) {
      setStatus("idle");
      setError("Enter a valid email address, e.g. name@example.com");
      return;
    }

    setError(null);
    setStatus("submitting");

    // TODO: kirim `email` ke endpoint newsletter backend. Sementara simulasi.
    await new Promise((resolve) => setTimeout(resolve, 600));

    setStatus("success");
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-3">
      <div className="flex flex-col gap-3 md:flex-row md:gap-2">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="Enter your email…"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "newsletter-message" : undefined}
            className={`h-11 w-full rounded-md border bg-white px-3 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-[3px] md:h-10 md:text-sm ${
              error
                ? "border-error focus:ring-error/30"
                : "border-gray-300 focus:border-navy-600 focus:ring-navy-600/20"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-11 items-center justify-center rounded-md bg-navy-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-70 md:h-10 md:focus-visible:ring-offset-white"
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      <p
        id="newsletter-message"
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-5 text-xs ${
          error ? "text-red-400 md:text-error" : "text-green-400 md:text-success"
        }`}
      >
        {error ?? (status === "success" ? "Thanks! You are on the list." : "")}
      </p>
    </form>
  );
}
