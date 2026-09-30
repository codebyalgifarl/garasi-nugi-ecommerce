# Panduan Detail: EP3-01 — API Daftar & Detail Produk

### Untuk Ridwan (Level Pemula) — Lanjutan Setelah EP2-02

---

## 0. Checklist Prasyarat

- [ ] EP2-02 (Register & Login) sudah selesai dan bisa jalan tanpa error
- [ ] Tabel `categories` dan `products` sudah ada di database (dari `garasi_nugi_schema.sql`)
- [ ] Sudah ada minimal 1 data kategori & produk di database untuk testing (kalau belum ada, insert manual dulu lewat `npx prisma studio`)

**Acceptance Criteria card ini** (target akhir yang harus tercapai):

- [ ] `GET /products` mendukung pagination & filter kategori
- [ ] `GET /products/:slug` mengembalikan detail lengkap termasuk stok

---

## Konsep Dasar yang Perlu Dipahami Dulu

### Kenapa Butuh Pagination?

Bayangkan toko punya 5.000 produk. Kalau `GET /products` mengembalikan SEMUA 5.000 sekaligus, halaman jadi lambat banget dan boros bandwidth. Pagination artinya kita kirim **sedikit demi sedikit** (misal 20 produk per "halaman"), dan frontend tinggal minta halaman berikutnya kalau user scroll/klik "next".

### Query Param vs Path Param — Apa Bedanya?

- **Path param**: `/products/:slug` → bagian dari alamat URL itu sendiri. Dipakai untuk identifikasi 1 data spesifik (produk MANA yang mau dilihat).
- **Query param**: `/products?page=2&category=rem` → tambahan setelah tanda `?`. Dipakai untuk filter/pengaturan tampilan (bukan identifikasi 1 data spesifik).

Karena `GET` request tidak boleh punya `Body` (beda dengan `POST`), semua input untuk `GET /products` HARUS lewat query param, bukan body.

### Kenapa Pakai `slug` di URL, Bukan `id`?

Bandingkan `garasinugi.com/produk/a3f9c012-88e2-...` (pakai UUID) vs `garasinugi.com/produk/kampas-rem-depan-avanza` (pakai slug). Yang kedua jauh lebih SEO-friendly dan mudah dibaca manusia — ini sesuai requirement SEO dari klien yang sudah kita bahas dari awal.

---

## LANGKAH 1: Generate Module Products

```bash
nest g module products
nest g controller products
nest g service products
```

Sama seperti EP2-02, ini otomatis membuat folder `src/products/` dan mendaftarkannya ke `app.module.ts`.

---

## LANGKAH 2: Pastikan Model Prisma Sesuai Schema

Buka `prisma/schema.prisma`, pastikan ada model berikut (terjemahan dari `garasi_nugi_schema.sql`):

```prisma
model Category {
  id          String   @id @default(uuid()) @db.Uuid
  parentId    String?  @map("parent_id") @db.Uuid
  name        String   @db.VarChar(100)
  slug        String   @unique @db.VarChar(120)
  description String?
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @default(now()) @map("updated_at") @db.Timestamptz

  parent   Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")
  products Product[]

  @@map("categories")
}

model Product {
  id               String   @id @default(uuid()) @db.Uuid
  categoryId       String   @map("category_id") @db.Uuid
  sku              String?  @unique @db.VarChar(50)
  name             String   @db.VarChar(200)
  slug             String   @unique @db.VarChar(220)
  brand            String?  @db.VarChar(100)
  description      String?
  price            Decimal  @db.Decimal(12, 2)
  stock            Int      @default(0)
  weightGram       Int      @default(0) @map("weight_gram")
  jubelioProductId String?  @unique @map("jubelio_product_id") @db.VarChar(100)
  isActive         Boolean  @default(true) @map("is_active")
  createdAt        DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt        DateTime @default(now()) @map("updated_at") @db.Timestamptz

  category Category       @relation(fields: [categoryId], references: [id])
  images   ProductImage[]

  @@map("products")
}

model ProductImage {
  id        String   @id @default(uuid()) @db.Uuid
  productId String   @map("product_id") @db.Uuid
  imageUrl  String   @map("image_url")
  isPrimary Boolean  @default(false) @map("is_primary")
  sortOrder Int      @default(0) @map("sort_order")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  product Product @relation(fields: [productId], references: [id])

  @@map("product_images")
}
```

Setelah edit, WAJIB jalankan:

```bash
npx prisma generate
```

---

## LANGKAH 3: Buat DTO untuk Query Parameter

Buat file baru: `src/products/dto/product-query.dto.ts`

```typescript
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page harus berupa angka' })
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit harus berupa angka' })
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  category?: string; // ini slug kategori, misal "rem", bukan nama "Rem"

  @IsOptional()
  @IsString()
  search?: string;
}
```

**Perhatikan `@Type(() => Number)`** — ini WAJIB ada. Semua query param dari URL itu aslinya berbentuk teks (`"2"`, bukan `2`). Decorator ini yang mengubahnya jadi angka asli sebelum divalidasi `@IsInt()`.

### ⚠️ Update Wajib di `main.ts`

Supaya `@Type()` di atas benar-benar berfungsi, buka `src/main.ts` yang sudah Anda buat di EP2-02, tambahkan `transform: true`:

```typescript
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

Kalau `transform: true` ini tidak ditambahkan, `query.page` akan tetap berupa teks `"2"` dan perhitungan pagination di Langkah 4 akan error/aneh (misal `NaN`).

---

## LANGKAH 4: Isi Products Service — Fungsi `findAll` (List + Pagination + Filter)

Buka `src/products/products.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    // Bangun kondisi WHERE secara dinamis
    const where: any = { isActive: true };

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    // Jalankan 2 query SEKALIGUS (lebih cepat daripada berurutan)
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
```

**Penjelasan bagian yang mungkin baru buat Anda:**

- `skip` & `take` → ini istilah Prisma untuk "lewati berapa baris" dan "ambil berapa baris". Kalau `page=2, limit=20`, maka `skip = 20` (lewati 20 data pertama), `take = 20` (ambil 20 berikutnya).
- `Promise.all([...])` → menjalankan 2 query database secara bersamaan (paralel), bukan satu-satu — lebih cepat.
- `mode: 'insensitive'` → supaya pencarian "REM" dan "rem" dianggap sama (khusus PostgreSQL).

---

## LANGKAH 5: Tambah Fungsi `findBySlug` (Detail Produk)

Masih di file yang sama, tambahkan fungsi baru di dalam class `ProductsService`:

```typescript
async findBySlug(slug: string) {
  const product = await this.prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!product || !product.isActive) {
    throw new NotFoundException({
      code: 'PRODUCT_NOT_FOUND',
      message: 'Produk tidak ditemukan',
    });
  }

  return product;
}
```

**Kenapa dicek `!product.isActive` juga**, bukan cuma `!product`? Karena produk yang di-nonaktifkan (misal dihentikan produksinya) sebaiknya tidak bisa diakses via URL langsung juga, walaupun datanya masih ada di database — bukan cuma disembunyikan dari daftar katalog.

---

## LANGKAH 6: Buat Endpoint di Products Controller

Buka `src/products/products.controller.ts`:

```typescript
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    const result = await this.productsService.findAll(query);
    return {
      success: true,
      data: result.items,
      meta: result.meta,
    };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    return { success: true, data: product };
  }
}
```

**Catatan penting soal urutan route** (untuk bekal endpoint lain nanti): NestJS mencocokkan route dari atas ke bawah. Kalau suatu saat Anda menambah endpoint statis seperti `/products/featured`, endpoint itu HARUS ditulis SEBELUM `@Get(':slug')` — kalau tidak, `"featured"` akan dianggap sebagai value dari `:slug` dan tidak pernah sampai ke endpoint yang benar. Untuk card ini belum masalah karena baru ada 2 endpoint, tapi ingat ini untuk nanti.

---

## LANGKAH 7: Testing Manual via Postman

Jalankan `npm run start:dev`, lalu coba **5 skenario ini**:

**Test 1 — List produk (default)**

```
GET http://localhost:3000/products
```

✅ Harusnya dapat `data` berupa array produk, dan `meta` berisi `page: 1, limit: 20, total, totalPages`.

**Test 2 — Filter berdasarkan kategori**

```
GET http://localhost:3000/products?category=rem
```

✅ Hanya produk dengan kategori slug `rem` yang muncul (gunakan slug kategori yang benar-benar ada di database Anda).

**Test 3 — Pagination halaman 2**

```
GET http://localhost:3000/products?page=2&limit=5
```

✅ `meta.page` harus `2`, `meta.limit` harus `5`, dan datanya berbeda dari halaman 1.

**Test 4 — Detail produk yang ADA**

```
GET http://localhost:3000/products/kampas-rem-depan-avanza
```

*(Ganti dengan slug produk asli di database Anda — ini contoh dari data yang kita pakai waktu review schema kemarin)* ✅ Harusnya dapat detail lengkap termasuk `stock`, `category`, dan `images`.

**Test 5 — Detail produk yang TIDAK ADA**

```
GET http://localhost:3000/products/produk-ngasal-yang-gaada
```

✅ Harusnya dapat response 404 dengan `error.code: "PRODUCT_NOT_FOUND"`.

Simpan ke-5 request ini di Postman Collection seperti kemarin.

---

## LANGKAH 8: Troubleshooting Umum

| Gejala | Kemungkinan Penyebab | Solusi |
| --- | --- | --- |
| `meta.page` / `meta.limit` jadi aneh atau `NaN` | Lupa tambahkan `transform: true` di `ValidationPipe` | Cek Langkah 3 lagi |
| Filter `?category=rem` tidak mengembalikan apa-apa padahal datanya ada | Anda mengisi `category` dengan NAMA ("Rem"), padahal filternya berdasarkan SLUG ("rem") | Pastikan value query param pakai slug, bukan nama |
| Error Prisma `Unknown field 'category'` | Lupa `npx prisma generate` setelah edit schema, atau relasi belum ditulis dengan benar | Cek Langkah 2, jalankan ulang `npx prisma generate` |
| Pencarian `search` tidak ketemu walau nama mirip | Lupa `mode: 'insensitive'`, atau salah ketik besar-kecil huruf dicari secara case-sensitive | Cek kembali Langkah 4 |
| `GET /products/:slug` selalu 404 walau slug benar | Produk berstatus `isActive: false` di database | Cek data produk, aktifkan dulu via `npx prisma studio` |

---

## LANGKAH 9: Dokumentasi Swagger & Ajukan PR

```typescript
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  @ApiOperation({ summary: 'Daftar produk dengan pagination & filter kategori' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'category', required: false })
  @Get()
  // ...

  @ApiOperation({ summary: 'Detail produk berdasarkan slug' })
  @Get(':slug')
  // ...
```

Lalu commit & buat PR seperti biasa:

```bash
git checkout -b feature/products-list-detail
git add .
git commit -m "feat: API daftar & detail produk dengan pagination (EP3-01)"
git push origin feature/products-list-detail
```

Minta **Fajar** review sebelum merge ke `develop`.

---

## Ringkasan Urutan

1. Generate module (Langkah 1)
2. Pastikan model Prisma benar (Langkah 2)
3. Buat DTO query param (Langkah 3) — **jangan lupa update `main.ts`**
4. Tulis `findAll` dengan pagination & filter (Langkah 4)
5. Tulis `findBySlug` (Langkah 5)
6. Buat endpoint controller (Langkah 6)
7. Test 5 skenario di Postman, jangan diskip (Langkah 7)
8. Cek tabel troubleshooting kalau ada error aneh (Langkah 8)
9. Swagger + PR (Langkah 9)

Setelah ini selesai dan di-merge, Wibi bisa mulai kerjakan EP3-02 (Navbar, Product Card & Layout) sambil manggil endpoint ini — pastikan Anda kasih tahu Wibi bentuk response `data` dan `meta` yang persis, sama seperti waktu EP2-02 kemarin.