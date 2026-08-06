import { Injectable } from '@nestjs/common';

import {
  ChatMessage,
} from './interfaces/ai-provider.interface';

import { GroqProvider } from './providers/groq.provider';

@Injectable()
export class AIService {
  constructor(
    private readonly provider: GroqProvider,
  ) {}

  async chat(
    messages: ChatMessage[],
  ): Promise<string> {
    return this.provider.chat(messages);
  }

  stream(
    messages: ChatMessage[],
  ): AsyncGenerator<string> {
    return this.provider.stream(messages);
  }
}