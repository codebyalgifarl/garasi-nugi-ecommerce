import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-products.dto';
import {
  ProductListResponseDto,
  ProductDetailResponseDto,
  ProductNotFoundResponseDto,
  ProductBadRequestResponseDto,
} from './dto/products-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // ─── GET /products ────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'Daftar produk aktif',
    description:
      'Mengambil daftar produk yang aktif (`is_active = true`) dengan dukungan ' +
      'filter berdasarkan kategori, brand, dan kompatibilitas kendaraan. ' +
      'Hasil dapat diurutkan dan dibagi menjadi halaman (pagination). ' +
      'Endpoint ini **tidak memerlukan autentikasi**.',
  })
  @ApiOkResponse({
    description: 'Daftar produk berhasil diambil.',
    type: ProductListResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Parameter query tidak valid — misalnya UUID salah format atau nilai page < 1.',
    type: ProductBadRequestResponseDto,
  })
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  // ─── GET /products/:slug ──────────────────────────────────────────────────

  @Get(':slug')
  @ApiOperation({
    summary: 'Detail produk berdasarkan slug',
    description:
      'Mengambil detail lengkap sebuah produk menggunakan slug yang unik dan SEO-friendly. ' +
      'Response mencakup deskripsi, semua gambar, dan daftar kendaraan yang kompatibel. ' +
      'Endpoint ini **tidak memerlukan autentikasi**.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Slug unik produk (contoh: kampas-rem-bosch-premium)',
    example: 'kampas-rem-bosch-premium',
  })
  @ApiOkResponse({
    description: 'Detail produk berhasil diambil.',
    type: ProductDetailResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Produk dengan slug tersebut tidak ditemukan atau tidak aktif.',
    type: ProductNotFoundResponseDto,
  })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
