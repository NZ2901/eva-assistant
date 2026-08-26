import { Module } from '@nestjs/common';

import { AiModule } from '../ai/ai.module';
import { BrainService } from '../brain/brain.service';
import { CountMessagesCommand } from '../brain/commands/count-messages.command';
import { FirstMessageCommand } from '../brain/commands/first-message.command';
import { LastMessageCommand } from '../brain/commands/last-message.command';
import { MemoryModule } from '../memory/memory.module';
import { PermanentMemoryModule } from '../permanent-memory/permanent-memory.module';
import { PromptModule } from '../prompt/prompt.module';

import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  imports: [
    AiModule,
    PromptModule,
    MemoryModule,
    PermanentMemoryModule,
  ],
  controllers: [
    ConversationController,
  ],
  providers: [
    ConversationService,
    BrainService,
    CountMessagesCommand,
    FirstMessageCommand,
    LastMessageCommand,
  ],
  exports: [
    ConversationService,
    BrainService,
  ],
})
export class ConversationModule {}
