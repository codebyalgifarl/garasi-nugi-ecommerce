import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class JubelioSyncScheduler {
  private readonly logger = new Logger(JubelioSyncScheduler.name);

  constructor(@InjectQueue('jubelio-sync') private syncQueue: Queue) { }

  @Cron('0 */5 * * * *') // setiap 5 menit
  async scheduleSync() {
    this.logger.log('Menambahkan job sinkronisasi ke antrian...');
    await this.syncQueue.add('sync-products-stock', {});
  }
}
