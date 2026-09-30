export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  /** Merek mobil, mis. "Mercedes-Benz" */
  brand: string;
  /** Kategori part, mis. "Engine Part" (dipakai di bagian "Most sold") */
  category?: string;
  /** Harga dalam Rupiah, angka utuh tanpa desimal */
  price: number;
  /** Path gambar di /public */
  image: string;
}
