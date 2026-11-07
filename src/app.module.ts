import { Module } from '@nestjs/common';

import { TicketsService } from './tickets/tickets.service.js';
import { TicketsController } from './tickets/tickets.controller.js';
import { StoreModule } from './store/store.module.js';

@Module({
  imports: [StoreModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class AppModule {}
