import { Injectable } from '@nestjs/common';

import type { ChatMessage } from '../ai/interfaces/ai-provider.interface';
import { PrismaService } from '../prisma/prisma.service';

export type MessageRole = 'user' | 'assistant';

export interface PersistedMessageInput {
  conversationId: string;
  clientMessageId: string;
  role: MessageRole;
  content: string;
}

@Injectable()
export class MemoryService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureConversation(
    conversationId: string,
  ): Promise<void> {
    await this.prisma.conversation.upsert({
      where: {
        id: conversationId,
      },
      update: {},
      create: {
        id: conversationId,
      },
    });
  }

  async saveMessage({
    conversationId,
    clientMessageId,
    role,
    content,
  }: PersistedMessageInput): Promise<void> {
    await this.ensureConversation(conversationId);

    await this.prisma.message.upsert({
      where: {
        conversationId_clientMessageId: {
          conversationId,
          clientMessageId,
        },
      },
      update: {
        content,
      },
      create: {
        conversationId,
        clientMessageId,
        role,
        content,
      },
    });
  }

  async getMessages(
    conversationId?: string,
  ): Promise<string[]> {
    const messages = await this.prisma.message.findMany({
      where: conversationId
        ? { conversationId }
        : undefined,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map(message => message.content);
  }

  async getConversationHistory(
    conversationId: string,
    excludedClientMessageIds: string[] = [],
  ): Promise<ChatMessage[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        content: {
          not: '',
        },
        ...(excludedClientMessageIds.length > 0
          ? {
              clientMessageId: {
                notIn: excludedClientMessageIds,
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map(message => ({
      role: message.role as MessageRole,
      content: message.content,
    }));
  }

  async getTotalMessages(
    conversationId: string,
  ): Promise<number> {
    return this.prisma.message.count({
      where: {
        conversationId,
        content: {
          not: '',
        },
      },
    });
  }

  async getFirstMessage(
    conversationId: string,
  ): Promise<string | null> {
    const message = await this.prisma.message.findFirst({
      where: {
        conversationId,
        content: {
          not: '',
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return message?.content ?? null;
  }

  async getLastMessage(
    conversationId: string,
  ): Promise<string | null> {
    const message = await this.prisma.message.findFirst({
      where: {
        conversationId,
        content: {
          not: '',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return message?.content ?? null;
  }
}
