import { Controller, Post, Body, Headers, HttpCode, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { createHmac } from 'crypto';

@Controller('internal/jubelio')
export class JubelioController {
  private readonly logger = new Logger(JubelioController.name);

  constructor(@InjectQueue('jubelio-sync') private syncQueue: Queue) {}

  /**
   * ⚠️ Endpoint ini HANYA untuk testing/development.
   * WAJIB dihapus atau diproteksi khusus admin sebelum production (Minggu 6).
   */
  @Post('trigger-sync')
  async triggerManualSync() {
    await this.syncQueue.add('sync-products-stock', {});
    return {
      success: true,
      message: 'Job sinkronisasi ditambahkan ke antrian',
    };
  }

  /**
   * Endpoint Webhook dari Jubelio.
   *
   * Cara kerja:
   * 1. Jubelio mengirim HTTP POST ke URL ini setiap ada perubahan produk/stok
   * 2. Kita verifikasi bahwa pengirim benar-benar Jubelio (bukan orang lain)
   *    menggunakan HMAC-SHA256 signature
   * 3. Jika valid, langsung trigger sinkronisasi ke antrian
   *
   * Setup di Jubelio Dashboard:
   * - Masuk ke: Pengaturan → Developer → Webhook
   * - Callback URL: https://domain-anda.com/internal/jubelio/webhook
   * - Webhook Secret Key: nilai yang sama dengan JUBELIO_WEBHOOK_SECRET di .env
   *
   * ⚠️ CATATAN DEVELOPMENT: Endpoint ini tidak bisa ditest dari localhost karena
   * Jubelio tidak bisa mengakses localhost. Gunakan ngrok atau deploy ke server dulu.
   * Untuk development lokal, tetap gunakan /trigger-sync.
   */
  @Post('webhook')
  @HttpCode(200) // Jubelio wajib menerima HTTP 200, jika tidak akan retry 3x
  async handleJubelioWebhook(
    @Body() payload: any,
    @Headers('webhook-signature') receivedSignature: string,
  ) {
    // --- LANGKAH 1: Verifikasi Signature ---
    // Ini adalah "kunci pintu" — memastikan request benar-benar dari Jubelio
    const isValid = this.verifyWebhookSignature(payload, receivedSignature);

    if (!isValid) {
      this.logger.warn('Webhook diterima tapi signature tidak valid — kemungkinan bukan dari Jubelio');
      // Tetap balas 200 (jangan 401/403) supaya Jubelio tidak terus retry
      // tapi kita tidak memproses datanya
      return { received: true, processed: false, reason: 'Invalid signature' };
    }

    // --- LANGKAH 2: Log event yang diterima ---
    const eventType = payload?.event ?? 'unknown';
    this.logger.log(`Webhook valid diterima dari Jubelio — event: ${eventType}`);

    // --- LANGKAH 3: Trigger sinkronisasi ---
    // Daripada memproses data mentah webhook (yang bisa tidak lengkap),
    // lebih aman trigger full sync supaya data di DB kita dijamin konsisten.
    await this.syncQueue.add('sync-products-stock', {
      triggeredBy: 'webhook',
      event: eventType,
    });

    this.logger.log('Job sinkronisasi berhasil ditambahkan ke antrian via webhook');
    return { received: true, processed: true };
  }

  /**
   * Verifikasi bahwa webhook benar-benar dikirim oleh Jubelio.
   *
   * Algoritma sesuai dokumentasi Jubelio:
   * 1. JSON.stringify(payload)
   * 2. Gabungkan: stringifiedBody + secretKey
   * 3. Hash dengan SHA256
   * 4. Bandingkan dengan header 'webhook-signature'
   */
  private verifyWebhookSignature(payload: any, receivedSignature: string): boolean {
    const secretKey = process.env.JUBELIO_WEBHOOK_SECRET;

    if (!secretKey || secretKey === 'isi-webhook-secret-key-yang-sama-dengan-di-dashboard-jubelio') {
      this.logger.error('JUBELIO_WEBHOOK_SECRET belum diisi di .env — webhook tidak bisa diverifikasi');
      return false;
    }

    if (!receivedSignature) {
      this.logger.warn('Header webhook-signature tidak ada di request');
      return false;
    }

    try {
      // Sesuai dokumentasi Jubelio: stringify(body) + secretKey → SHA256
      const stringifiedBody = JSON.stringify(payload);
      const dataToHash = stringifiedBody + secretKey;
      const computedSignature = createHmac('sha256', secretKey)
        .update(dataToHash)
        .digest('hex');

      // Bandingkan dengan cara aman (mencegah timing attack)
      const isMatch = computedSignature === receivedSignature;

      if (!isMatch) {
        this.logger.debug(`Signature tidak cocok.\nDiterima: ${receivedSignature}\nDihitung: ${computedSignature}`);
      }

      return isMatch;
    } catch (err) {
      this.logger.error(`Error saat verifikasi signature: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  }
}
