import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { ConversationService } from '../conversation/conversation.service';
import type { ChatOperation } from '../conversation/dto/chat.dto';
import { MemoryService } from '../memory/memory.service';
import { PermanentMemoryService } from '../permanent-memory/permanent-memory.service';

import { CountMessagesCommand } from './commands/count-messages.command';
import type { Command } from './commands/command.interface';
import { FirstMessageCommand } from './commands/first-message.command';
import { LastMessageCommand } from './commands/last-message.command';

export interface ConversationRequest {
  message: string;
  conversationId?: string;
  userMessageId?: string;
  assistantMessageId?: string;
  operation?: ChatOperation;
}

interface NormalizedConversationRequest {
  message: string;
  conversationId: string;
  userMessageId: string;
  assistantMessageId: string;
  operation: ChatOperation;
}

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

  private normalizeRequest(
    request: ConversationRequest,
  ): NormalizedConversationRequest {
    return {
      message: request.message,
      conversationId:
        request.conversationId ?? randomUUID(),
      userMessageId:
        request.userMessageId ?? randomUUID(),
      assistantMessageId:
        request.assistantMessageId ?? randomUUID(),
      operation: request.operation ?? 'new',
    };
  }

  private get commands(): Command[] {
    return [
      this.countMessagesCommand,
      this.firstMessageCommand,
      this.lastMessageCommand,
    ];
  }

  private async rememberImportantInformation(
    message: string,
  ): Promise<void> {
    const lowerMessage = message.toLowerCase();

    if (!lowerMessage.startsWith('meu nome é ')) {
      return;
    }

    const name = message.substring(11).trim();

    if (!name) {
      return;
    }

    await this.permanentMemoryService.saveMemory(
      'name',
      name,
    );
  }

  private async prepare(
    request: ConversationRequest,
  ): Promise<NormalizedConversationRequest> {
    const normalized = this.normalizeRequest(request);

    await this.memoryService.ensureConversation(
      normalized.conversationId,
    );

    if (normalized.operation !== 'regenerate') {
      await this.memoryService.saveMessage({
        conversationId: normalized.conversationId,
        clientMessageId: normalized.userMessageId,
        role: 'user',
        content: normalized.message,
      });

      await this.rememberImportantInformation(
        normalized.message,
      );
    }

    await this.memoryService.saveMessage({
      conversationId: normalized.conversationId,
      clientMessageId: normalized.assistantMessageId,
      role: 'assistant',
      content: '',
    });

    return normalized;
  }

  private async runCommand(
    request: NormalizedConversationRequest,
  ): Promise<string | null> {
    for (const command of this.commands) {
      if (!command.matches(request.message)) {
        continue;
      }

      const result = await command.execute(
        request.conversationId,
      );

      await this.memoryService.saveMessage({
        conversationId: request.conversationId,
        clientMessageId: request.assistantMessageId,
        role: 'assistant',
        content: result.response,
      });

      return result.response;
    }

    return null;
  }

  async chat(
    request: ConversationRequest,
  ): Promise<string> {
    const normalized = await this.prepare(request);
    const commandResponse = await this.runCommand(normalized);

    if (commandResponse) {
      return commandResponse;
    }

    const response = await this.conversationService.chat(
      normalized.conversationId,
      [normalized.assistantMessageId],
    );

    await this.memoryService.saveMessage({
      conversationId: normalized.conversationId,
      clientMessageId: normalized.assistantMessageId,
      role: 'assistant',
      content: response,
    });

    return response;
  }

  async *stream(
    request: ConversationRequest,
  ): AsyncGenerator<string> {
    const normalized = await this.prepare(request);
    const commandResponse = await this.runCommand(normalized);

    if (commandResponse) {
      yield commandResponse;
      return;
    }

    let response = '';

    try {
      for await (const chunk of this.conversationService.stream(
        normalized.conversationId,
        [normalized.assistantMessageId],
      )) {
        response += chunk;
        yield chunk;
      }
    } finally {
      await this.memoryService.saveMessage({
        conversationId: normalized.conversationId,
        clientMessageId: normalized.assistantMessageId,
        role: 'assistant',
        content: response,
      });
    }
  }
}
