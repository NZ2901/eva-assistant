import { Body, Controller, Post } from '@nestjs/common';
import { BrainService } from '../brain/brain.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly brainService: BrainService) {}

  @Post()
  chat(@Body() chatDto: ChatDto) {
    return this.brainService.chat(chatDto.message);
  }
}
