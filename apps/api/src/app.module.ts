import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller';
import { BrainService } from './brain/brain.service';
import { MemoryService } from './memory/memory.service';
import { MemoryController } from './memory/memory.controller';

@Module({
  imports: [],
  controllers: [ChatController, MemoryController],
  providers: [BrainService, MemoryService],
})
export class AppModule {}