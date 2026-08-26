import { MemoryService } from './memory.service';

describe('MemoryService', () => {
  it('queries history only from the requested conversation', async () => {
    const prisma = {
      conversation: {
        upsert: jest.fn(),
      },
      message: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    const service = new MemoryService(prisma as never);

    await service.getConversationHistory(
      'conversation-1',
      ['assistant-1'],
    );

    expect(prisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          conversationId: 'conversation-1',
          clientMessageId: {
            notIn: ['assistant-1'],
          },
        }),
      }),
    );
  });

  it('updates messages only within their conversation', async () => {
    const prisma = {
      conversation: {
        upsert: jest.fn(),
      },
      message: {
        upsert: jest.fn(),
      },
    };
    const service = new MemoryService(prisma as never);

    await service.saveMessage({
      conversationId: 'conversation-1',
      clientMessageId: 'message-1',
      role: 'user',
      content: 'Olá',
    });

    expect(prisma.message.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          conversationId_clientMessageId: {
            conversationId: 'conversation-1',
            clientMessageId: 'message-1',
          },
        },
      }),
    );
  });
});
