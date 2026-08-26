import { Module } from '@nestjs/common';

import { ConversationModule } from './conversation/conversation.module';
import { MemoryModule } from './memory/memory.module';
import { MemoryExtractorModule } from './memory-extractor/memory-extractor.module';
import { SpeechModule } from './speech/speech.module';

@Module({
  imports: [
    ConversationModule,
    MemoryModule,
    MemoryExtractorModule,
    SpeechModule,
  ],
})
export class AppModule {}
