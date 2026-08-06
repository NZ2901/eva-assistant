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
    userMessage: string,
  ): Promise<ChatMessage[]> {
    const history =
      await this.memoryService.getConversationHistory();

    const prompt = this.promptService.build();

    return [
      {
        role: 'system',
        content: prompt,
      },
      ...history,
      {
        role: 'user',
        content: userMessage,
      },
    ];
  }

  async chat(
    userMessage: string,
  ): Promise<string> {
    const messages =
      await this.buildMessages(userMessage);

    return this.aiService.chat(messages);
  }

  async *stream(
    userMessage: string,
  ): AsyncGenerator<string> {
    const messages =
      await this.buildMessages(userMessage);

    yield* this.aiService.stream(messages);
  }
}