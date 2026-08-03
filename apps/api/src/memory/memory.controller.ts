import { Controller, Get } from '@nestjs/common';
import { MemoryService } from './memory.service';

@Controller('memory')
export class MemoryController {
  constructor(
    private readonly memoryService: MemoryService,
  ) {}

  @Get()
  getMemory() {
    return {
      messages: this.memoryService.getMessages(),
    };
  }
}
