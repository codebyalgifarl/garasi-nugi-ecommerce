import Image from "next/image";
import Link from "next/link";

/**
 * Posisi logo di desktop dibuat "bleed" (sebagian terpotong tepi kartu) sesuai Figma.
 * Class ditulis lengkap di file ini supaya terdeteksi Tailwind (jangan dipindah ke lib/).
 */
const BRANDS = [
  {
    slug: "mercedes-benz",
    name: "Mercedes-Benz",
    shortName: "Mercedes",
    logo: { src: "/images/brands/mercedes-benz.webp", width: 464, height: 464 },
    bg: "bg-gold-card",
    logoDesktop: "md:left-[30%] md:top-[11%] md:w-[98%]",
  },
  {
    slug: "bmw",
    name: "BMW",
    shortName: "BMW",
    logo: { src: "/images/brands/bmw.webp", width: 512, height: 512 },
    bg: "bg-aqua-400",
    logoDesktop: "md:left-[33%] md:top-[12%] md:w-[110%]",
  },
  {
    slug: "porsche",
    name: "Porsche",
    shortName: "Porsche",
    logo: { src: "/images/brands/porsche.webp", width: 420, height: 560 },
    bg: "bg-gold-card",
    logoDesktop: "md:left-[41%] md:top-[6%] md:w-[82%]",
  },
  {
    slug: "audi",
    name: "Audi",
    shortName: "Audi",
    logo: { src: "/images/brands/audi.webp", width: 640, height: 479 },
    bg: "bg-aqua-400",
    logoDesktop: "md:left-[23%] md:top-[38%] md:w-[108%]",
  },
] as const;

export function BrandGrid({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="brands-heading"
      className={`mx-auto w-full max-w-7xl px-4 pt-6 md:pt-10 ${className}`}
    >
      <h2
        id="brands-heading"
        className="mb-3 text-lg font-bold text-navy-600 md:sr-only"
      >
        Shop by Brand
      </h2>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {BRANDS.map((brand) => (
          <li key={brand.slug}>
            <Link
              href={`/catalog?brand=${brand.slug}`}
              className={`group relative block aspect-[5/2] overflow-hidden rounded-lg md:aspect-[3/4] md:rounded-md ${brand.bg} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2`}
            >
              <Image
                src={brand.logo.src}
                width={brand.logo.width}
                height={brand.logo.height}
                alt=""
                sizes="(min-width: 768px) 30vw, 48px"
                className={`absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 object-contain transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 md:right-auto md:h-auto md:translate-y-0 md:object-fill ${brand.logoDesktop}`}
              />

              <div className="absolute inset-0 flex flex-col justify-center p-3 md:justify-end md:p-6 lg:p-8">
                <span className="text-sm font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.35)] md:text-xl md:leading-tight lg:text-3xl">
                  <span className="md:hidden">{brand.shortName}</span>
                  <span className="hidden md:inline">{brand.name}</span>
                </span>
                <span className="mt-0.5 text-[11px] font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)] md:mt-4 md:text-sm">
                  Shop Now <span aria-hidden="true" className="md:hidden">→</span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
