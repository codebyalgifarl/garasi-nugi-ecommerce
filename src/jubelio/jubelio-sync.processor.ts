import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JubelioApiService } from './jubelio-api.service';

@Injectable()
@Processor('jubelio-sync')
export class JubelioSyncProcessor extends WorkerHost {
  private readonly logger = new Logger(JubelioSyncProcessor.name);

  constructor(
    private prisma: PrismaService,
    private jubelioApi: JubelioApiService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Mulai sinkronisasi produk (job #${job.id})`);

    try {
      const masterProducts = await this.jubelioApi.fetchAllProducts();
      let syncedCount = 0;
      let skippedCount = 0;

      for (const master of masterProducts) {
        // PENTING: 1 "master product" Jubelio bisa punya BANYAK varian
        // (ukuran/warna berbeda, dst). Tiap varian disimpan sebagai 1 baris
        // di tabel products, karena tiap varian punya SKU, harga, stok sendiri.
        const variants = master.variants ?? [];

        for (const variant of variants) {
          if (!variant.item_id || !variant.item_name) {
            // Lewati data tidak lengkap — catat sebagai skip, bukan error total
            skippedCount++;
            continue;
          }

          // Fallback berjenjang untuk stok: available_qty bisa null di Jubelio.
          // TODO: konfirmasi ke tim/Jubelio field mana yang paling akurat
          // sebagai "stok siap jual saat ini".
          const stock = variant.available_qty ?? variant.end_qty ?? 0;
          const price = Number(variant.sell_price ?? master.sell_price ?? 0);

          // Debug: uncomment baris ini untuk lihat struktur data asli Jubelio
          // this.logger.debug(JSON.stringify(variant));

          await this.prisma.products.upsert({
            where: { jubelio_product_id: String(variant.item_id) },
            update: {
              name: variant.item_name,
              sku: variant.item_code,
              price,
              stock,
            },
            create: {
              jubelio_product_id: String(variant.item_id),
              sku: variant.item_code,
              name: variant.item_name,
              slug: this.generateSlug(variant.item_name, variant.item_code),
              price,
              stock,
              // Keputusan sementara untuk MVP: semua produk hasil sync
              // masuk 1 kategori default. Admin bisa kategorikan ulang manual
              // lewat dashboard nanti.
              category_id: await this.resolveDefaultCategoryId(),
            },
          });
          syncedCount++;
        }
      }

      await this.prisma.jubelio_sync_logs.create({
        data: {
          sync_type: 'product',
          status: 'success',
          message: `Berhasil sinkron ${syncedCount} varian produk dari ${masterProducts.length} master product (${skippedCount} dilewati karena data tidak lengkap)`,
        },
      });

      this.logger.log(`Sinkronisasi selesai: ${syncedCount} varian diproses`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      await this.prisma.jubelio_sync_logs.create({
        data: {
          sync_type: 'product',
          status: 'failed',
          message: errorMessage,
        },
      });
      this.logger.error(`Sinkronisasi GAGAL: ${errorMessage}`);
      // Throw ulang supaya BullMQ tahu job ini gagal dan bisa di-retry otomatis
      throw err;
    }
  }

  private generateSlug(name: string, code: string): string {
    // Disertakan item_code supaya tidak tabrakan kalau ada 2 varian
    // dengan nama sama persis (kasus umum untuk produk bervarian).
    const base = `${name}-${code}`;
    return base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async resolveDefaultCategoryId(): Promise<string> {
    const fallback = await this.prisma.categories.findFirst();
    if (!fallback) {
      throw new Error(
        'Belum ada kategori sama sekali di database lokal — buat 1 kategori default dulu lewat prisma studio',
      );
    }
    return fallback.id;
  }
}
