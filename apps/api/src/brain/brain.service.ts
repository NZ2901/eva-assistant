import { Injectable } from '@nestjs/common';

import { MemoryService } from '../memory/memory.service';
import { PermanentMemoryService } from '../permanent-memory/permanent-memory.service';
import { ConversationService } from '../conversation/conversation.service';

import { CountMessagesCommand } from './commands/count-messages.command';
import { FirstMessageCommand } from './commands/first-message.command';
import { LastMessageCommand } from './commands/last-message.command';

@Injectable()
export class BrainService {
  constructor(
    private readonly memoryService: MemoryService,
    private readonly permanentMemoryService: PermanentMemoryService,
    private readonly conversationService: ConversationService,

    private readonly countMessagesCommand: CountMessagesCommand,
    private readonly firstMessageCommand: FirstMessageCommand,
    private readonly lastMessageCommand: LastMessageCommand,
  ) {}

  async chat(message: string) {
    // Salva a mensagem do usuário
    await this.memoryService.saveMessage('user', message);

    // Salva informações importantes na memória permanente
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.startsWith('meu nome é ')) {
      const name = message.substring(11).trim();

      await this.permanentMemoryService.saveMemory(
        'name',
        name,
      );
    }

    // Lista de comandos
    const commands = [
      this.countMessagesCommand,
      this.firstMessageCommand,
      this.lastMessageCommand,
    ];

    // Procura um comando que consiga responder
    for (const command of commands) {
      if (command.matches(message)) {
        const result = await command.execute();

        await this.memoryService.saveMessage(
          'assistant',
          result.response,
        );

        return result;
      }
    }

    // Conversation Engine
    const response = await this.conversationService.chat(message);

    // Salva a resposta da IA
    await this.memoryService.saveMessage(
      'assistant',
      response,
    );

    return {
      response,
    };
  }
}