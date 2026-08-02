import { Body, Controller, Post } from '@nestjs/common';
import { BrainService } from '../brain/brain.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly brainService: BrainService) {}

  @Post()
  chat(@Body() body: { message: string }) {
    return this.brainService.chat(body.message);
  }
}
