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

export interface ConversationSummary {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  preview: string | null;
}

export interface ConversationDetails extends ConversationSummary {
  messages: Array<{
    id: string;
    role: MessageRole;
    content: string;
    createdAt: Date;
  }>;
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

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
  }

  async listConversations(): Promise<ConversationSummary[]> {
    const conversations = await this.prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          where: { role: 'user', content: { not: '' } },
          orderBy: { createdAt: 'asc' },
          take: 1,
          select: { content: true },
        },
      },
    });

    return conversations.map((conversation) => ({
      id: conversation.id,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      preview: conversation.messages[0]?.content ?? null,
    }));
  }

  async getConversation(
    conversationId: string,
  ): Promise<ConversationDetails | null> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            clientMessageId: true,
            role: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!conversation) return null;

    return {
      id: conversation.id,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      preview:
        conversation.messages.find(
          (message) => message.role === 'user' && message.content !== '',
        )?.content ?? null,
      messages: conversation.messages.map((message) => ({
        id: message.clientMessageId,
        role: message.role as MessageRole,
        content: message.content,
        createdAt: message.createdAt,
      })),
    };
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
