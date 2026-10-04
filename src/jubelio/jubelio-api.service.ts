import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class JubelioApiService {
  private readonly logger = new Logger(JubelioApiService.name);
  private baseUrl = process.env.JUBELIO_BASE_URL; // https://api2.jubelio.com
  private email = process.env.JUBELIO_EMAIL;
  private password = process.env.JUBELIO_PASSWORD;

  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null; // epoch ms, kapan token basi

  /**
   * FULLY CONFIRMED dari request & response asli:
   * - Endpoint: POST https://api2.jubelio.com/login (tanpa prefix /auth)
   * - Body request: { email, password }
   * - Field token di response: "token", langsung di root
   * - Masa berlaku token ~12 jam
   */
  private async login(): Promise<string> {
    const response = await axios.post(`${this.baseUrl}/login`, {
      email: this.email,
      password: this.password,
    });

    const token = response.data.token;
    if (!token) {
      throw new Error(
        'Login Jubelio berhasil tapi field "token" tidak ditemukan di response',
      );
    }

    this.accessToken = token;
    // Token berlaku ~12 jam. Pakai 11 jam supaya aman,
    // tidak perlu login ulang tiap 15 menit saat job sync berjalan.
    this.tokenExpiresAt = Date.now() + 11 * 60 * 60 * 1000;

    this.logger.log(
      'Berhasil login ke Jubelio, token baru didapat (berlaku ~11 jam)',
    );
    return token;
  }

  /** Pakai token yang masih berlaku, atau login ulang kalau sudah/belum ada. */
  private async getValidToken(): Promise<string> {
    const isExpired =
      !this.tokenExpiresAt || Date.now() >= this.tokenExpiresAt;
    if (!this.accessToken || isExpired) {
      return this.login();
    }
    return this.accessToken;
  }

  /**
   * CONFIRMED dari screenshot Postman:
   * - Endpoint: GET https://api2.jubelio.com/inventory/items/masters
   * - Response: { data: [...], totalCount: number }
   * - Tiap master product punya array "variants" yang berisi stok per SKU
   */
  async fetchAllProducts(): Promise<any[]> {
    const pageSize = 100;
    let page = 1;
    let allMasters: any[] = [];
    let totalCount = Infinity;

    while (allMasters.length < totalCount) {
      const token = await this.getValidToken();

      const response = await axios.get(
        `${this.baseUrl}/inventory/items/masters`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, pageSize },
        },
      );

      const pageData = response.data.data ?? [];
      totalCount = response.data.totalCount ?? pageData.length;
      allMasters = allMasters.concat(pageData);

      if (pageData.length === 0) break; // jaga-jaga supaya tidak infinite loop
      page++;
    }

    this.logger.log(
      `Berhasil fetch ${allMasters.length} master product dari Jubelio`,
    );
    return allMasters;
  }
}
