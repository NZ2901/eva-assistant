import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

import {
  AIProvider,
  ChatMessage,
} from '../interfaces/ai-provider.interface';

@Injectable()
export class GroqProvider implements AIProvider {
  private readonly groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  async chat(
    messages: ChatMessage[],
  ): Promise<string> {
    const completion =
      await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
      });

    return (
      completion.choices[0]?.message?.content ??
      'Não consegui gerar uma resposta.'
    );
  }

  async *stream(
    messages: ChatMessage[],
  ): AsyncGenerator<string> {
    const stream =
      await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        stream: true,
      });

    for await (const chunk of stream) {
      const content =
        chunk.choices[0]?.delta?.content;

      if (content) {
        yield content;
      }
    }
  }
}