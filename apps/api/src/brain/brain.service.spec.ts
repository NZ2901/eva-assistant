import { BrainService } from './brain.service';

describe('BrainService', () => {
  it('persists a streamed user and assistant message in one conversation', async () => {
    const memoryService = {
      ensureConversation: jest.fn(),
      saveMessage: jest.fn(),
    };
    const permanentMemoryService = {
      saveMemory: jest.fn(),
    };
    const conversationService = {
      stream: jest.fn(async function* () {
        yield 'Olá';
        yield '!';
      }),
    };
    const command = {
      matches: jest.fn().mockReturnValue(false),
      execute: jest.fn(),
    };
    const service = new BrainService(
      memoryService as never,
      permanentMemoryService as never,
      conversationService as never,
      command as never,
      command as never,
      command as never,
    );

    const chunks: string[] = [];

    for await (const chunk of service.stream({
      message: 'Olá EVA',
      conversationId: '4d8c7407-ae5d-432a-9a4f-765494922852',
      userMessageId: 'ea292694-baaf-4dd2-9bc6-6d7b0e2899e1',
      assistantMessageId: 'fe7c49aa-5cb4-4c2a-9144-7d440eb7e582',
      operation: 'new',
    })) {
      chunks.push(chunk);
    }

    expect(chunks.join('')).toBe('Olá!');
    expect(memoryService.saveMessage).toHaveBeenLastCalledWith({
      conversationId: '4d8c7407-ae5d-432a-9a4f-765494922852',
      clientMessageId: 'fe7c49aa-5cb4-4c2a-9144-7d440eb7e582',
      role: 'assistant',
      content: 'Olá!',
    });
  });
});
