import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/layout/icons";

/** Class ditulis lengkap di sini agar terdeteksi Tailwind (jangan dipindah ke lib/). */
const CATEGORIES = [
  {
    slug: "headlight",
    name: "Headlight",
    mobileLabel: "HEADLIGHTS",
    image: { src: "/images/categories/headlight.webp" },
    item: "md:flex-[1.4]",
    desktop: "md:bg-aqua-600",
  },
  {
    slug: "oil-cooler",
    name: "Oil Cooler",
    mobileLabel: "COOLERS",
    image: { src: "/images/categories/oil-cooler.webp" },
    item: "md:flex-1",
    desktop: "md:bg-gold-card",
  },
  {
    slug: "brake-disc",
    name: "Brake Disc",
    mobileLabel: "BRAKE DISC",
    image: { src: "/images/categories/brake-disc.webp" },
    item: "md:flex-1",
    desktop: "md:bg-aqua-400",
  },
] as const;

export function CategoryShowcase({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="categories-heading"
      className={`mx-auto w-full max-w-7xl px-4 pt-8 md:pt-20 ${className}`}
    >
      <h2
        id="categories-heading"
        className="mb-4 text-lg font-bold text-navy-600 md:mb-8 md:text-center md:text-2xl"
      >
        <span className="md:hidden">Featured </span>Categories
      </h2>

      {/* Mobile: 3 tile persegi. Desktop: deretan bar yang bisa di-scroll horizontal. */}
      <ul className="grid grid-cols-3 gap-2 md:flex md:snap-x md:gap-5 md:overflow-x-auto md:pb-3 md:[scrollbar-width:thin]">
        {CATEGORIES.map((category) => (
          <li
            key={category.slug}
            className={`md:min-w-[260px] md:snap-start ${category.item}`}
          >
            <Link
              href={`/catalog?category=${category.slug}`}
              className={`group relative block aspect-square overflow-hidden rounded-md bg-neutral-950 md:aspect-auto md:h-28 ${category.desktop} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2`}
            >
              <div className="absolute inset-x-2 bottom-7 top-2 md:inset-auto md:-right-3 md:top-1/2 md:h-[150%] md:w-1/2 md:-translate-y-1/2">
                <Image
                  src={category.image.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 200px, 30vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <span className="absolute inset-x-0 bottom-0 pb-2 text-center text-[11px] font-bold tracking-wide text-white md:inset-y-0 md:right-auto md:flex md:w-1/2 md:items-center md:pb-0 md:pl-7 md:text-left md:text-xl md:tracking-normal">
                <span className="md:hidden">{category.mobileLabel}</span>
                <span className="hidden md:inline">{category.name}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 hidden justify-center md:flex">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-aqua-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600"
        >
          Discover More
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
