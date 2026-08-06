import { Injectable } from '@nestjs/common';
import { MemoryService } from '../../memory/memory.service';
import { Command } from './command.interface';

@Injectable()
export class CountMessagesCommand implements Command {
  constructor(private readonly memoryService: MemoryService) {}

  matches(message: string): boolean {
    return message.toLowerCase().includes('quantas mensagens');
  }

  async execute(): Promise<{ response: string }> {
    const totalMessages = await this.memoryService.getTotalMessages();

    return {
      response: `Você enviou ${totalMessages} mensagens até agora.`,
    };
  }
}