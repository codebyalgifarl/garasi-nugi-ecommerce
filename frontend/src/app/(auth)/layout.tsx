import Image from "next/image";
import Link from "next/link";

/**
 * Layout khusus halaman auth (/login, /register).
 * Folder "(auth)" pakai kurung = route group → TIDAK muncul di URL.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-16">
        <Link
          href="/"
          aria-label="Garasi Nugi — back to homepage"
          className="mb-8 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-4"
        >
          <Image
            src="/logo-garasinugi.png"
            alt="Garasi Nugi"
            width={980}
            height={159}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        {children}
      </main>

      <footer className="py-6 text-center text-xs text-gray-500">
        © 2026 Garasi Nugi. All rights reserved.
      </footer>
    </div>
  );
}
