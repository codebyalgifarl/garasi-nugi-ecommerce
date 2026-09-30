import Link from "next/link";

const PROMOS = [
  {
    title: "Premium Headlights",
    text: "Best arrivals for BMW, Audi & Mercedes-Benz.",
    href: "/catalog?category=headlight",
  },
  {
    title: "10% sale on accessories",
    text: "Grab discounted parts for cosmetic upgrades. Use promo GARASINUGI10.",
    href: "/catalog?category=accessories",
  },
  {
    title: "Control Modules",
    text: "Brought to you for seamless electrical performance.",
    href: "/catalog?category=control-module",
  },
] as const;

/** Strip promo 3 kolom — hanya di desktop (tidak ada di desain mobile). */
export function PromoStrip({ className = "" }: { className?: string }) {
  return (
    <section
      aria-label="Promotions"
      className={`mx-auto hidden w-full max-w-6xl px-4 pt-20 md:block ${className}`}
    >
      <ul className="grid grid-cols-3 divide-x divide-gray-200 border-y border-gray-200 py-8">
        {PROMOS.map((promo) => (
          <li key={promo.title} className="px-6 text-center">
            <h3 className="text-sm font-bold text-gray-900">{promo.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-gray-600">
              {promo.text}
            </p>
            <Link
              href={promo.href}
              className="mt-3 inline-block rounded-sm text-xs font-semibold text-aqua-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600"
            >
              Shop now
              <span className="sr-only">: {promo.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
