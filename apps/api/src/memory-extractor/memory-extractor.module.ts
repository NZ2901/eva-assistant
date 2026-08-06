import { Module } from '@nestjs/common';

import { AiModule } from '../ai/ai.module';
import { MemoryExtractorService } from './memory-extractor.service';

@Module({
  imports: [
    AiModule,
  ],
  providers: [
    MemoryExtractorService,
  ],
  exports: [
    MemoryExtractorService,
  ],
})
export class MemoryExtractorModule {}
