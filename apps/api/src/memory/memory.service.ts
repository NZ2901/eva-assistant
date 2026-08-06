import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessage } from '../ai/interfaces/ai-provider.interface';

@Injectable()
export class MemoryService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(role: string, message: string): Promise<void> {
    await this.prisma.message.create({
      data: {
        role,
        content: message,
      },
    });
  }

  async getMessages(): Promise<string[]> {
    const messages = await this.prisma.message.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map((message) => message.content);
  }

  async getConversationHistory(): Promise<ChatMessage[]> {
    const messages = await this.prisma.message.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map((message) => ({
      role: message.role as 'user' | 'assistant',
      content: message.content,
    }));
  }

  async getTotalMessages(): Promise<number> {
    return this.prisma.message.count();
  }

  async getFirstMessage(): Promise<string | null> {
    const message = await this.prisma.message.findFirst({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return message?.content ?? null;
  }

  async getLastMessage(): Promise<string | null> {
    const message = await this.prisma.message.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return message?.content ?? null;
  }
}