"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CartIcon, CloseIcon, MenuIcon, UserIcon } from "./icons";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/categories", label: "Categories" },
  { href: "/contact", label: "Contact" },
] as const;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-600";

interface HeaderProps {
  /** TODO: ambil dari state keranjang (card Cart) — sementara 0. */
  cartCount?: number;
}

export function Header({ cartCount = 0 }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Tutup menu mobile setiap pindah halaman.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape menutup menu mobile.
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="relative z-40">
      {/* ===== Bar navy: nav (desktop) / logo + ikon (mobile) ===== */}
      <div className="bg-navy-600 md:bg-navy-deep">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 md:h-11">
          <div className="flex items-center gap-1 md:gap-0">
            <button
              type="button"
              className={`-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-white hover:bg-white/10 md:hidden ${FOCUS_RING}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>

            {/* Logo versi mobile (di bar navy) */}
            <Link
              href="/"
              aria-label="Garasi Nugi — home"
              className={`rounded-md py-2 md:hidden ${FOCUS_RING}`}
            >
              <Image
                src="/logo-garasinugi.png"
                alt="Garasi Nugi"
                width={980}
                height={159}
                className="h-7 w-auto"
              />
            </Link>

            {/* Navigasi utama (desktop) */}
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-8 text-sm font-medium">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`rounded-sm py-1 transition-colors ${FOCUS_RING} ${
                          active
                            ? "text-gold-400 underline decoration-2 underline-offset-[6px]"
                            : "text-white hover:text-gold-300"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-1 md:gap-5">
            {/* TODO: setelah login tersambung, tampilkan nama user & link ke /account */}
            <Link
              href="/login"
              className={`inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-white transition-colors hover:text-gold-300 md:h-8 md:px-1 ${FOCUS_RING}`}
            >
              <UserIcon className="h-5 w-5 md:h-4 md:w-4" />
              <span className="hidden md:inline">Account/Login</span>
              <span className="sr-only md:hidden">Account / Login</span>
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
              className={`relative inline-flex h-11 w-11 items-center justify-center rounded-md text-white transition-colors hover:text-gold-300 md:h-8 md:w-8 ${FOCUS_RING}`}
            >
              <CartIcon className="h-5 w-5" />
              <span
                aria-hidden="true"
                className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-400 px-1 text-[11px] font-bold leading-none text-gray-900 md:-top-0.5"
              >
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Band logo putih (desktop) ===== */}
      <div className="hidden border-b border-gray-100 bg-white md:block">
        <div className="mx-auto flex max-w-7xl justify-center px-4 py-7">
          <Link
            href="/"
            aria-label="Garasi Nugi — home"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-4"
          >
            <Image
              src="/logo-garasinugi.png"
              alt="Garasi Nugi"
              width={980}
              height={159}
              className="h-16 w-auto"
            />
          </Link>
        </div>
      </div>

      {/* ===== Menu mobile ===== */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="absolute inset-x-0 top-full bg-navy-700 shadow-xl md:hidden"
        >
          <ul className="mx-auto max-w-7xl px-2 py-2">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-md px-3 text-base font-medium ${FOCUS_RING} ${
                      active ? "text-gold-400" : "text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
