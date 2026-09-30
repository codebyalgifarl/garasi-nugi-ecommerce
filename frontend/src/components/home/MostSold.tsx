import Link from "next/link";
import { ChevronRightIcon } from "@/components/layout/icons";
import { ProductCard, ProductRow } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types/product";

interface MostSoldProps {
  products: ProductSummary[];
  className?: string;
}

export function MostSold({ products, className = "" }: MostSoldProps) {
  return (
    <section
      aria-labelledby="most-sold-heading"
      className={`mx-auto w-full max-w-7xl px-4 pt-8 md:pt-20 ${className}`}
    >
      <div className="md:grid md:grid-cols-3 md:items-center md:gap-10">
        <div className="md:col-span-1">
          <h2
            id="most-sold-heading"
            className="mb-4 text-lg font-bold capitalize text-navy-600 md:mb-0 md:text-2xl md:normal-case"
          >
            Most sold products
          </h2>
          <p className="mt-4 hidden text-sm text-gray-600 md:block">
            Most viral and wanted products.
          </p>
          <Link
            href="/catalog?sort=best-selling"
            className="mt-5 hidden items-center gap-1 rounded-sm text-sm font-semibold text-aqua-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 md:inline-flex"
          >
            Top 100 most sold
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile: daftar baris */}
        <ul className="space-y-3 md:hidden">
          {products.map((product) => (
            <li key={product.id}>
              <ProductRow product={product} />
            </li>
          ))}
        </ul>

        {/* Desktop: 4 tile kecil */}
        <ul className="hidden gap-4 md:col-span-2 md:grid md:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} variant="compact" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
