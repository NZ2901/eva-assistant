import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { GroqProvider } from './providers/groq.provider';

@Module({
  providers: [
    AIService,
    GroqProvider,
  ],
  exports: [
    AIService,
  ],
})
export class AiModule {}