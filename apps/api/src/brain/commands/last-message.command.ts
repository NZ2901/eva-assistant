import { Injectable } from '@nestjs/common';
import { MemoryService } from '../../memory/memory.service';
import { Command } from './command.interface';

@Injectable()
export class LastMessageCommand implements Command {
  constructor(private readonly memoryService: MemoryService) {}

  matches(message: string): boolean {
    return message.toLowerCase().includes('última mensagem');
  }

  async execute(): Promise<{ response: string }> {
    const lastMessage = await this.memoryService.getLastMessage();

    return {
      response: lastMessage
        ? `Sua última mensagem foi: "${lastMessage}"`
        : 'Você ainda não possui mensagens.',
    };
  }
}