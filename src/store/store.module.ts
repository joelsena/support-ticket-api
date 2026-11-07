import { Module } from '@nestjs/common';
import { InMemoryService } from './inmemory.service.js';

@Module({
  providers: [InMemoryService],
  exports: [InMemoryService],
})
export class StoreModule {}
