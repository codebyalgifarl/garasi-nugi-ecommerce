import Link from "next/link";
import { ChevronRightIcon } from "@/components/layout/icons";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types/product";

interface NewProductsProps {
  products: ProductSummary[];
  className?: string;
}

export function NewProducts({ products, className = "" }: NewProductsProps) {
  return (
    <section
      aria-labelledby="new-products-heading"
      className={`mx-auto w-full max-w-7xl px-4 pt-8 md:pt-20 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between md:mb-8 md:justify-center">
        <h2
          id="new-products-heading"
          className="text-lg font-bold text-navy-600 md:text-2xl"
        >
          New Products
        </h2>
        <Link
          href="/catalog?sort=newest"
          className="inline-flex min-h-11 items-center gap-0.5 rounded-sm text-sm font-semibold text-aqua-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 md:hidden"
        >
          See All
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-x-6">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      <div className="mt-8 hidden justify-center md:flex">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-aqua-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600"
        >
          Show all products
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
