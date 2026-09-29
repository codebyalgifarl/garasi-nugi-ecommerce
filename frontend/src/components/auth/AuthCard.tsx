"use client";

import { useState, useCallback } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type AuthMode = "login" | "register";

interface AuthCardProps {
  /** Which form to show first */
  initialMode?: AuthMode;
}

/**
 * Wrapper component that holds both LoginForm and RegisterForm
 * and provides a smooth fade-crossfade animation when toggling.
 *
 * Both forms are always mounted (so form state is preserved during
 * rapid switching), but only the active one is visible & interactive.
 */
export function AuthCard({ initialMode = "login" }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayMode, setDisplayMode] = useState<AuthMode>(initialMode);

  const switchTo = useCallback(
    (target: AuthMode) => {
      if (target === mode || isTransitioning) return;

      // Phase 1: fade out current form
      setIsTransitioning(true);

      // After fade-out completes, swap the visible form and fade in
      setTimeout(() => {
        setDisplayMode(target);
        setMode(target);

        // Small delay to allow the DOM to update before fading in
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      }, 300); // matches the CSS transition duration
    },
    [mode, isTransitioning],
  );

  return (
    <div className="auth-card-container">
      {/* Login Form */}
      <div
        className={`auth-card-panel ${
          displayMode === "login"
            ? isTransitioning
              ? "auth-card-panel--fading-out"
              : "auth-card-panel--active"
            : "auth-card-panel--hidden"
        }`}
      >
        <LoginForm onSwitchToRegister={() => switchTo("register")} />
      </div>

      {/* Register Form */}
      <div
        className={`auth-card-panel ${
          displayMode === "register"
            ? isTransitioning
              ? "auth-card-panel--fading-out"
              : "auth-card-panel--active"
            : "auth-card-panel--hidden"
        }`}
      >
        <RegisterForm onSwitchToLogin={() => switchTo("login")} />
      </div>
    </div>
  );
}
