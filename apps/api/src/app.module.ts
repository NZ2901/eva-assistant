import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller';
import { BrainService } from './brain/brain.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [BrainService],
})
export class AppModule {}