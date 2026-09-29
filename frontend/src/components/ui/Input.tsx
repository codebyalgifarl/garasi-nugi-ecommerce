"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, required, id, className = "", ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasError = Boolean(error);
  const hasMessage = hasError || Boolean(hint);

  // Shake animation: increment counter every time an error appears (or changes)
  // so the wrapper re-mounts and the CSS animation re-triggers.
  const [shakeKey, setShakeKey] = useState(0);
  const prevErrorRef = useRef(error);

  useEffect(() => {
    if (error && error !== prevErrorRef.current) {
      setShakeKey((k) => k + 1);
    }
    prevErrorRef.current = error;
  }, [error]);

  const inputClasses = [
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900",
    "placeholder:text-gray-400 transition-shadow",
    "focus:outline-none focus:ring-[3px]",
    "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
    hasError
      ? "border-error focus:border-error focus:ring-error/10"
      : "border-gray-300 focus:border-navy-600 focus:ring-navy-600/10",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div key={hasError ? shakeKey : undefined} className={`w-full${hasError ? " animate-shake" : ""}`}>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-semibold text-gray-900"
      >
        {label}
        {required && <span aria-hidden="true" className="text-red-500"> *</span>}
      </label>

      {/*
        Sengaja TIDAK pakai atribut native `required` di <input>,
        supaya validasi 100% dipegang zod (pesan error konsisten dengan design system),
        bukan popup bawaan browser.
      */}
      <input
        ref={ref}
        id={inputId}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={hasMessage ? messageId : undefined}
        className={inputClasses}
        {...props}
      />

      {hasError ? (
        <p id={messageId} role="alert" className="mt-1.5 text-xs text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1.5 text-xs text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
