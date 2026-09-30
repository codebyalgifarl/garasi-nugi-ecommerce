import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─── Product Image ──────────────────────────────────────────────────────────

export class ProductImageDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'UUID gambar produk',
  })
  id: string;

  @ApiProperty({
    example: 'https://cdn.garasi-nugi.id/images/kampas-rem-bosch.webp',
    description: 'URL gambar produk',
  })
  image_url: string;

  @ApiProperty({
    example: true,
    description: 'Apakah ini gambar utama produk',
  })
  is_primary: boolean;

  @ApiProperty({
    example: 0,
    description: 'Urutan tampilan gambar (ascending)',
  })
  sort_order: number;
}

// ─── Vehicle Compatibility ──────────────────────────────────────────────────

export class VehicleCompatibilityDto {
  @ApiProperty({
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    description: 'UUID kendaraan',
  })
  id: string;

  @ApiProperty({ example: 'Toyota', description: 'Brand / merk kendaraan' })
  brand: string;

  @ApiProperty({ example: 'Avanza', description: 'Model kendaraan' })
  model: string;

  @ApiPropertyOptional({
    example: 2015,
    description: 'Tahun mulai produksi kendaraan',
    nullable: true,
  })
  year_start: number | null;

  @ApiPropertyOptional({
    example: 2023,
    description: 'Tahun akhir produksi kendaraan',
    nullable: true,
  })
  year_end: number | null;
}

// ─── Category ───────────────────────────────────────────────────────────────

export class ProductCategoryDto {
  @ApiProperty({
    example: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    description: 'UUID kategori',
  })
  id: string;

  @ApiProperty({ example: 'Rem & Kopling', description: 'Nama kategori' })
  name: string;

  @ApiProperty({ example: 'rem-kopling', description: 'Slug kategori' })
  slug: string;
}

// ─── Product Summary (untuk list) ───────────────────────────────────────────

export class ProductSummaryDto {
  @ApiProperty({
    example: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    description: 'UUID produk',
  })
  id: string;

  @ApiProperty({
    example: 'BOSCH-KR-001',
    description: 'SKU produk',
    nullable: true,
  })
  sku: string | null;

  @ApiProperty({ example: 'Kampas Rem Bosch Premium', description: 'Nama produk' })
  name: string;

  @ApiProperty({ example: 'kampas-rem-bosch-premium', description: 'Slug URL-friendly produk' })
  slug: string;

  @ApiPropertyOptional({
    example: 'Bosch',
    description: 'Brand / merk produk',
    nullable: true,
  })
  brand: string | null;

  @ApiProperty({
    example: '285000.00',
    description: 'Harga produk dalam Rupiah',
  })
  price: string;

  @ApiProperty({ example: 42, description: 'Jumlah stok tersedia' })
  stock: number;

  @ApiProperty({ example: true, description: 'Apakah produk aktif / tersedia' })
  is_active: boolean;

  @ApiProperty({ type: ProductCategoryDto, description: 'Kategori produk' })
  categories: ProductCategoryDto;

  @ApiProperty({
    type: [ProductImageDto],
    description: 'Daftar gambar produk (biasanya hanya gambar utama untuk list)',
  })
  product_images: ProductImageDto[];

  @ApiProperty({
    example: '2026-09-29T06:00:00.000Z',
    description: 'Waktu produk dibuat',
  })
  created_at: Date;

  @ApiProperty({
    example: '2026-09-29T06:00:00.000Z',
    description: 'Waktu produk terakhir diupdate',
  })
  updated_at: Date;
}

// ─── Product Detail (untuk single product) ──────────────────────────────────

export class ProductDetailDto extends ProductSummaryDto {
  @ApiPropertyOptional({
    example: 'Kampas rem Bosch Premium dirancang untuk kendaraan Toyota...',
    description: 'Deskripsi lengkap produk',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 350,
    description: 'Berat produk dalam gram (untuk kalkulasi ongkos kirim)',
  })
  weight_gram: number;

  @ApiProperty({
    type: [VehicleCompatibilityDto],
    description: 'Daftar kendaraan yang kompatibel dengan produk ini',
  })
  compatible_vehicles: VehicleCompatibilityDto[];
}

// ─── Pagination Meta ────────────────────────────────────────────────────────

export class PaginationMetaDto {
  @ApiProperty({ example: 1, description: 'Halaman saat ini' })
  page: number;

  @ApiProperty({ example: 12, description: 'Jumlah item per halaman' })
  limit: number;

  @ApiProperty({ example: 85, description: 'Total item yang tersedia' })
  total: number;

  @ApiProperty({ example: 8, description: 'Total halaman' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Apakah ada halaman berikutnya' })
  hasNextPage: boolean;

  @ApiProperty({ example: false, description: 'Apakah ada halaman sebelumnya' })
  hasPrevPage: boolean;
}

// ─── List Response ──────────────────────────────────────────────────────────

export class ProductListResponseDto {
  @ApiProperty({
    type: [ProductSummaryDto],
    description: 'Array produk',
  })
  data: ProductSummaryDto[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Informasi paginasi' })
  meta: PaginationMetaDto;
}

// ─── Detail Response ─────────────────────────────────────────────────────────

export class ProductDetailResponseDto {
  @ApiProperty({ type: ProductDetailDto, description: 'Data detail produk' })
  data: ProductDetailDto;
}

// ─── Error Responses ─────────────────────────────────────────────────────────

export class ProductNotFoundResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({
    example: { code: 'PRODUCT_NOT_FOUND', message: 'Produk tidak ditemukan' },
    description: 'Detail error',
  })
  message: { code: string; message: string };

  @ApiProperty({ example: 'Not Found' })
  error: string;
}

export class ProductBadRequestResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['categoryId must be a UUID', 'page must not be less than 1'],
    description: 'Pesan validasi — bisa string tunggal atau array',
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
