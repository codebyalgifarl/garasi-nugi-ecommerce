import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/layout/SearchBar";
import { TrustBar } from "@/components/home/TrustBar";
import { BrandGrid } from "@/components/home/BrandGrid";
import { NewProducts } from "@/components/home/NewProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { MostSold } from "@/components/home/MostSold";
import { PromoStrip } from "@/components/home/PromoStrip";
import { Testimonial } from "@/components/home/Testimonial";
import { Footer } from "@/components/layout/Footer";
import type { ProductSummary } from "@/types/product";

/* ───────────────────────────────────────────
   Data statis sementara (dummy).
   Nanti diganti fetch dari backend API.
   ─────────────────────────────────────────── */

const NEW_PRODUCTS: ProductSummary[] = [
  {
    id: "1",
    slug: "mk5-headlight-w204-c-class-c250",
    name: "MK5 Headlight For W204 C-Class C250",
    brand: "Mercedes-Benz",
    price: 4560000,
    image: "/images/products/mks-headlight-w204.webp",
  },
  {
    id: "2",
    slug: "brembo-front-brake-pad-bmw-f30-320i",
    name: "Brembo Front Brake Pad BMW F30 320i",
    brand: "BMW",
    price: 1850000,
    image: "/images/products/brembo-brake-pad-f30.webp",
  },
  {
    id: "3",
    slug: "bilstein-b4-air-suspension-macan-95b",
    name: "Bilstein B4 Air Suspension Macan 95B",
    brand: "Porsche",
    price: 12200000,
    image: "/images/products/bilstein-b4-macan.webp",
  },
  {
    id: "4",
    slug: "ac-grille-tab-audi-q5-2009-2012",
    name: "AC Grille Tab For Audi Q5 2009-2012",
    brand: "Audi",
    price: 350000,
    image: "/images/products/ac-grille-q5.webp",
  },
];

const MOST_SOLD_PRODUCTS: ProductSummary[] = [
  {
    id: "5",
    slug: "ecu-module-n54",
    name: "ECU Module N54",
    brand: "BMW",
    category: "Engine Part",
    price: 8560000,
    image: "/images/products/ecu-module-w204.webp",
  },
  {
    id: "6",
    slug: "cabin-filter-f30",
    name: "Cabin Filter F30",
    brand: "BMW",
    category: "Accessories",
    price: 450000,
    image: "/images/products/cabin-filter-f30.webp",
  },
  {
    id: "7",
    slug: "ignition-coil-porsche",
    name: "Ignition Coil Porsche",
    brand: "Porsche",
    category: "Engine Part",
    price: 1380000,
    image: "/images/products/ignition-coil-porsche.webp",
  },
  {
    id: "8",
    slug: "o2-sensor-audi-a4",
    name: "O2 Sensor Audi A4",
    brand: "Audi",
    category: "Electrical",
    price: 2580000,
    image: "/images/products/o2-sensor-audi-a4.webp",
  },
];

const TESTIMONIAL_DATA = {
  quote:
    "Kualitas suku cadang terjamin dan pelayanannya juara. Sangat membantu saat mencari headlight untuk Mercedes G-Class saya. Pasti akan belanja di sini lagi untuk kebutuhan maintenance.",
  author: "Wibi Raouf Sutama",
  date: "Sep 22, 2026",
  rating: 5,
};

export default function Home() {
  return (
    <>
      <Header />

      {/* Search Bar */}
      <div className="bg-navy-600 px-4 py-3 md:bg-white md:py-0">
        <SearchBar className="md:my-6" />
      </div>

      {/* Trust Bar (mobile only) */}
      <TrustBar />

      <main>
        {/* Brand Showcase */}
        <BrandGrid />

        {/* New Products */}
        <NewProducts products={NEW_PRODUCTS} />

        {/* Categories */}
        <CategoryShowcase />

        {/* Most Sold Products */}
        <MostSold products={MOST_SOLD_PRODUCTS} />

        {/* Promo Strip (desktop only) */}
        <PromoStrip />

        {/* Testimonial */}
        <Testimonial testimonial={TESTIMONIAL_DATA} />
      </main>

      <Footer />
    </>
  );
}
