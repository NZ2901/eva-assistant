import { Module } from '@nestjs/common';

import { ActionsModule } from '../actions/actions.module';
import { AiModule } from '../ai/ai.module';
import { BrainService } from '../brain/brain.service';
import { CountMessagesCommand } from '../brain/commands/count-messages.command';
import { FirstMessageCommand } from '../brain/commands/first-message.command';
import { LastMessageCommand } from '../brain/commands/last-message.command';
import { MemoryModule } from '../memory/memory.module';
import { MemoryExtractorModule } from '../memory-extractor/memory-extractor.module';
import { PermanentMemoryModule } from '../permanent-memory/permanent-memory.module';
import { PromptModule } from '../prompt/prompt.module';

import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  imports: [
    ActionsModule,
    AiModule,
    PromptModule,
    MemoryModule,
    MemoryExtractorModule,
    PermanentMemoryModule,
  ],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    BrainService,
    CountMessagesCommand,
    FirstMessageCommand,
    LastMessageCommand,
  ],
  exports: [ConversationService, BrainService],
})
export class ConversationModule {}
