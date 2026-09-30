import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryProductsDto } from './dto/query-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ─── GET /products ────────────────────────────────────────────────────────

  async findAll(query: QueryProductsDto) {
    const {
      categoryId,
      vehicleId,
      brand,
      search,
      sortBy = 'created_at',
      order = 'desc',
      page = 1,
      limit = 12,
    } = query;

    const skip = (page - 1) * limit;

    // ─── Build WHERE clause ────────────────────────────────────────────────
    const where: {
      is_active: boolean;
      category_id?: string;
      brand?: { contains: string; mode: 'insensitive' };
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        sku?: { contains: string; mode: 'insensitive' };
      }>;
      product_vehicle_compatibilities?: {
        some: { vehicle_id: string };
      };
    } = {
      is_active: true,
    };

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (vehicleId) {
      where.product_vehicle_compatibilities = {
        some: { vehicle_id: vehicleId },
      };
    }

    // ─── Run count + data queries in parallel ──────────────────────────────
    const [total, products] = await Promise.all([
      this.prisma.products.count({ where }),
      this.prisma.products.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        select: {
          id: true,
          sku: true,
          name: true,
          slug: true,
          brand: true,
          price: true,
          stock: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          product_images: {
            orderBy: [{ is_primary: 'desc' }, { sort_order: 'asc' }],
            select: {
              id: true,
              image_url: true,
              is_primary: true,
              sort_order: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  // ─── GET /products/:slug ──────────────────────────────────────────────────

  async findBySlug(slug: string) {
    const product = await this.prisma.products.findUnique({
      where: { slug },
      select: {
        id: true,
        sku: true,
        name: true,
        slug: true,
        brand: true,
        description: true,
        price: true,
        stock: true,
        weight_gram: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        product_images: {
          orderBy: [{ is_primary: 'desc' }, { sort_order: 'asc' }],
          select: {
            id: true,
            image_url: true,
            is_primary: true,
            sort_order: true,
          },
        },
        product_vehicle_compatibilities: {
          select: {
            vehicles: {
              select: {
                id: true,
                brand: true,
                model: true,
                year_start: true,
                year_end: true,
              },
            },
          },
        },
      },
    });

    if (!product || !product.is_active) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Produk tidak ditemukan',
      });
    }

    // Flatten kompatibilitas kendaraan: { vehicles: {...} }[] → VehicleDto[]
    const { product_vehicle_compatibilities, ...rest } = product;
    return {
      data: {
        ...rest,
        compatible_vehicles: product_vehicle_compatibilities.map(
          (pvc) => pvc.vehicles,
        ),
      },
    };
  }
}
