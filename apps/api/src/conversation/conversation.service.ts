import { Injectable } from '@nestjs/common';

import { AIService } from '../ai/ai.service';
import type { ChatMessage } from '../ai/interfaces/ai-provider.interface';
import { MemoryService } from '../memory/memory.service';
import { PromptService } from '../prompt/prompt.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly aiService: AIService,
    private readonly memoryService: MemoryService,
    private readonly promptService: PromptService,
  ) {}

  private async buildMessages(
    conversationId: string,
    excludedClientMessageIds: string[] = [],
  ): Promise<ChatMessage[]> {
    const history =
      await this.memoryService.getConversationHistory(
        conversationId,
        excludedClientMessageIds,
      );

    const prompt = await this.promptService.build();

    return [
      {
        role: 'system',
        content: prompt,
      },
      ...history,
    ];
  }

  async chat(
    conversationId: string,
    excludedClientMessageIds: string[] = [],
  ): Promise<string> {
    const messages =
      await this.buildMessages(
        conversationId,
        excludedClientMessageIds,
      );

    return this.aiService.chat(messages);
  }

  async *stream(
    conversationId: string,
    excludedClientMessageIds: string[] = [],
  ): AsyncGenerator<string> {
    const messages =
      await this.buildMessages(
        conversationId,
        excludedClientMessageIds,
      );

    yield* this.aiService.stream(messages);
  }
}
