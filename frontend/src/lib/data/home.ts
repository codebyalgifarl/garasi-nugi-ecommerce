import type { ProductSummary } from "@/types/product";

/**
 * DATA SEMENTARA untuk halaman Home (UI-only).
 * TODO: ganti dengan fetch ke API produk (card EP3) — cukup ganti sumber
 * array di app/(shop)/page.tsx, komponen tidak perlu diubah.
 */
export const newProducts: ProductSummary[] = [
  {
    id: "p-001",
    slug: "mks-headlight-w204-c-class-c250-c300",
    name: "MKS Headlight For W204 C-Class C250 C300",
    brand: "Mercedes-Benz",
    price: 4_500_000,
    image: "/images/products/mks-headlight-w204.webp",
  },
  {
    id: "p-002",
    slug: "brembo-front-brake-pad-bmw-f30-320i",
    name: "Brembo Front Brake Pad BMW F30 320i",
    brand: "BMW",
    price: 1_850_000,
    image: "/images/products/brembo-brake-pad-f30.webp",
  },
  {
    id: "p-003",
    slug: "bilstein-b4-air-suspension-macan-95b",
    name: "Bilstein B4 Air Suspension Macan 95B",
    brand: "Porsche",
    price: 12_200_000,
    image: "/images/products/bilstein-b4-macan.webp",
  },
  {
    id: "p-004",
    slug: "ac-grille-tab-audi-q5-2009-2012",
    name: "AC Grille Tab For Audi Q5 2009-2012",
    brand: "Audi",
    price: 350_000,
    image: "/images/products/ac-grille-q5.webp",
  },
];

export const mostSoldProducts: ProductSummary[] = [
  {
    id: "p-101",
    slug: "ecu-module-w204",
    name: "ECU Module W204",
    brand: "Mercedes-Benz",
    category: "Engine Part",
    price: 8_500_000,
    image: "/images/products/ecu-module-w204.webp",
  },
  {
    id: "p-102",
    slug: "cabin-filter-f30",
    name: "Cabin Filter F30",
    brand: "BMW",
    category: "Accessories",
    price: 450_000,
    image: "/images/products/cabin-filter-f30.webp",
  },
  {
    id: "p-103",
    slug: "ignition-coil-porsche",
    name: "Ignition Coil Porsche",
    brand: "Porsche",
    category: "Engine Part",
    price: 1_100_000,
    image: "/images/products/ignition-coil-porsche.webp",
  },
  {
    id: "p-104",
    slug: "o2-sensor-audi-a4",
    name: "O2 Sensor Audi A4",
    brand: "Audi",
    category: "Electrical",
    price: 2_300_000,
    image: "/images/products/o2-sensor-audi-a4.webp",
  },
];

/**
 * PLACEHOLDER dari desain Figma — bukan testimoni pelanggan sungguhan.
 * Jangan dipublikasikan ke production; ganti dengan review asli dari API.
 */
export const featuredTestimonial = {
  quote:
    "Kualitas suku cadang terjamin dan pelayanannya juara. Sangat membantu saat mencari headlight untuk Mercedes C-Class saya. Pasti akan belanja di sini lagi untuk kebutuhan maintenance.",
  author: "Wibi Raouf Sutama",
  date: "May 21, 2026",
  rating: 5,
} as const;
