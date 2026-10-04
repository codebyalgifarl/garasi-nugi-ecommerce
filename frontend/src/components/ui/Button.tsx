import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "success" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  isLoading?: boolean;
  /** Teks yang tampil saat isLoading = true, misal "Signing in..." */
  loadingText?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-navy-600 text-white hover:bg-navy-700 active:bg-navy-800",
  secondary:
    "border border-navy-600 bg-white text-navy-600 hover:bg-navy-50 active:bg-navy-100",
  success: "bg-success text-white hover:bg-green-700 active:bg-green-800",
  ghost: "bg-transparent text-navy-600 hover:bg-navy-50 active:bg-navy-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      loadingText,
      disabled,
      className = "",
      type = "button",
      children,
      ...props
    },
    ref
  ) {
    const classes = [
      "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-60",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={classes}
        {...props}
      >
        {isLoading && <Spinner />}
        {isLoading && loadingText ? loadingText : children}
      </button>
    );
  }
);
