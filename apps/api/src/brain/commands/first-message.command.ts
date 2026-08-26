import { Injectable } from '@nestjs/common';
import { MemoryService } from '../../memory/memory.service';
import { Command } from './command.interface';

@Injectable()
export class FirstMessageCommand implements Command {
  constructor(private readonly memoryService: MemoryService) {}

  matches(message: string): boolean {
    return message.toLowerCase().includes('primeira mensagem');
  }

  async execute(
    conversationId: string,
  ): Promise<{ response: string }> {
    const firstMessage =
      await this.memoryService.getFirstMessage(
        conversationId,
      );

    return {
      response: firstMessage
        ? `Sua primeira mensagem foi: "${firstMessage}"`
        : 'Você ainda não possui mensagens.',
    };
  }
}
