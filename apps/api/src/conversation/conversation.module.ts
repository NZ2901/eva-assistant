import { Module } from '@nestjs/common';

import { AiModule } from '../ai/ai.module';
import { MemoryModule } from '../memory/memory.module';
import { PromptModule } from '../prompt/prompt.module';

import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  imports: [
    AiModule,
    PromptModule,
    MemoryModule,
  ],
  controllers: [
    ConversationController,
  ],
  providers: [
    ConversationService,
  ],
  exports: [
    ConversationService,
  ],
})
export class ConversationModule {}
