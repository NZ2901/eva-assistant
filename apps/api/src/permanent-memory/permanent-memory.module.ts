import { Module } from '@nestjs/common';
import { PermanentMemoryService } from './permanent-memory.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [
    PermanentMemoryService,
    PrismaService,
  ],
  exports: [PermanentMemoryService],
})
export class PermanentMemoryModule {}
