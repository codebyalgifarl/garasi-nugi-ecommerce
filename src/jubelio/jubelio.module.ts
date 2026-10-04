import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JubelioApiService } from './jubelio-api.service';
import { JubelioSyncScheduler } from './jubelio-sync.scheduler';
import { JubelioSyncProcessor } from './jubelio-sync.processor';
import { JubelioController } from './jubelio.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'jubelio-sync',
    }),
  ],
  controllers: [JubelioController],
  providers: [JubelioApiService, JubelioSyncScheduler, JubelioSyncProcessor],
})
export class JubelioModule {}
