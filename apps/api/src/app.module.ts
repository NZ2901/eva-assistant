import { Module } from '@nestjs/common';

import { AiModule } from './ai/ai.module';
import { BrainService } from './brain/brain.service';
import { CountMessagesCommand } from './brain/commands/count-messages.command';
import { FirstMessageCommand } from './brain/commands/first-message.command';
import { LastMessageCommand } from './brain/commands/last-message.command';
import { ConversationModule } from './conversation/conversation.module';
import { MemoryController } from './memory/memory.controller';
import { MemoryModule } from './memory/memory.module';
import { MemoryService } from './memory/memory.service';
import { MemoryExtractorModule } from './memory-extractor/memory-extractor.module';
import { PermanentMemoryModule } from './permanent-memory/permanent-memory.module';
import { PersonalityModule } from './personality/personality.module';
import { PrismaService } from './prisma/prisma.service';
import { PromptModule } from './prompt/prompt.module';

@Module({
  imports: [
    AiModule,
    PermanentMemoryModule,
    PersonalityModule,
    PromptModule,
    ConversationModule,
    MemoryModule,
    MemoryExtractorModule,
  ],
  controllers: [
    MemoryController,
  ],
  providers: [
    BrainService,
    MemoryService,
    PrismaService,
    CountMessagesCommand,
    FirstMessageCommand,
    LastMessageCommand,
  ],
})
export class AppModule {}