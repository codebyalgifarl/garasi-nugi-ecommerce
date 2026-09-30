import { BrandGrid } from "@/components/home/BrandGrid";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { MostSold } from "@/components/home/MostSold";
import { NewProducts } from "@/components/home/NewProducts";
import { PromoStrip } from "@/components/home/PromoStrip";
import { Testimonial } from "@/components/home/Testimonial";
import { TrustBar } from "@/components/home/TrustBar";
import { SearchBar } from "@/components/layout/SearchBar";
import { featuredTestimonial, mostSoldProducts, newProducts } from "@/lib/data/home";

/**
 * Halaman Home ("/") — publik, TIDAK perlu login.
 *
 * Urutan section berbeda antara desktop & mobile di Figma
 * (mobile: Categories sebelum New Products), jadi diatur lewat class `order-*`.
 * Catatan: `order-*` hanya mengubah tampilan visual, bukan urutan Tab keyboard.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      <h1 className="sr-only">Garasi Nugi — Premium European car spare parts</h1>

      {/* Search: di mobile menyatu dengan bar navy header, di desktop pil navy di bawah logo */}
      <section
        aria-label="Search"
        className="order-1 w-full bg-navy-600 px-4 pb-4 pt-1 md:bg-transparent md:pb-0 md:pt-10"
      >
        <SearchBar />
      </section>

      <TrustBar className="order-2" />
      <BrandGrid className="order-3" />
      <CategoryShowcase className="order-4 md:order-5" />
      <NewProducts products={newProducts} className="order-5 md:order-4" />
      <MostSold products={mostSoldProducts} className="order-6" />
      <PromoStrip className="order-7" />
      <Testimonial testimonial={featuredTestimonial} className="order-8" />
    </div>
  );
}
