import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils/format";
import type { ProductSummary } from "@/types/product";

interface ProductCardProps {
  product: ProductSummary;
  /** "compact": tile kecil untuk bagian "Most sold" (label = kategori part). */
  variant?: "default" | "compact";
}

/**
 * Kartu produk. Seluruh kartu bisa diklik lewat "stretched link"
 * (pseudo-element pada link nama produk), tanpa membungkus semua dalam <a>.
 */
export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const compact = variant === "compact";
  const label = compact ? (product.category ?? product.brand) : product.brand;

  return (
    <article className="group relative rounded-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy-600 has-[:focus-visible]:ring-offset-4">
      <div
        className={`relative overflow-hidden rounded-md bg-gray-100 ${
          compact ? "aspect-[3/2]" : "aspect-square"
        }`}
      >
        <Image
          src={product.image}
          alt=""
          fill
          sizes={
            compact
              ? "(min-width: 768px) 16vw, 25vw"
              : "(min-width: 768px) 24vw, 46vw"
          }
          className={`object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
            compact ? "p-3" : "p-5"
          }`}
        />
      </div>

      <div className={compact ? "mt-2" : "mt-3"}>
        <p className="text-[11px] uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <h3
          className={`mt-1 line-clamp-2 font-semibold text-gray-900 ${
            compact ? "text-xs leading-4" : "min-h-10 text-sm leading-5"
          }`}
        >
          <Link
            href={`/product/${product.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        <p
          className={`font-bold text-navy-600 ${
            compact ? "mt-1 text-xs" : "mt-2 text-sm"
          }`}
        >
          {formatRupiah(product.price)}
        </p>
      </div>
    </article>
  );
}

/** Baris produk horizontal — dipakai di daftar "Most sold" versi mobile. */
export function ProductRow({ product }: { product: ProductSummary }) {
  return (
    <article className="group relative flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy-600">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="56px"
          className="object-contain p-1.5 mix-blend-multiply"
        />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          <Link
            href={`/product/${product.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        {product.category && (
          <p className="text-xs text-gray-500">{product.category}</p>
        )}
        <p className="mt-0.5 text-sm font-bold text-navy-600">
          {formatRupiah(product.price)}
        </p>
      </div>
    </article>
  );
}
