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
    const memoryExtractorService = {
      extract: jest.fn().mockResolvedValue({ memories: [] }),
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
      memoryExtractorService as never,
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

  it('extracts new-message memories in the background without delaying streaming', async () => {
    let resolveExtraction: (value: {
      memories: { key: string; value: string }[];
    }) => void;
    const memoryService = {
      ensureConversation: jest.fn(),
      saveMessage: jest.fn(),
    };
    const permanentMemoryService = {
      saveMemory: jest.fn(),
    };
    const memoryExtractorService = {
      extract: jest.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveExtraction = resolve;
        }),
      ),
    };
    const conversationService = {
      stream: jest.fn(async function* () {
        yield 'Resposta';
      }),
    };
    const command = {
      matches: jest.fn().mockReturnValue(false),
      execute: jest.fn(),
    };
    const service = new BrainService(
      memoryService as never,
      permanentMemoryService as never,
      memoryExtractorService as never,
      conversationService as never,
      command as never,
      command as never,
      command as never,
    );

    const chunks: string[] = [];

    for await (const chunk of service.stream({
      message: 'Moro em São Paulo',
      conversationId: '4d8c7407-ae5d-432a-9a4f-765494922852',
      userMessageId: 'ea292694-baaf-4dd2-9bc6-6d7b0e2899e1',
      assistantMessageId: 'fe7c49aa-5cb4-4c2a-9144-7d440eb7e582',
      operation: 'new',
    })) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['Resposta']);
    expect(memoryExtractorService.extract).toHaveBeenCalledWith(
      'Moro em São Paulo',
    );
    expect(permanentMemoryService.saveMemory).not.toHaveBeenCalled();

    resolveExtraction!({
      memories: [{ key: 'city', value: 'São Paulo' }],
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(permanentMemoryService.saveMemory).toHaveBeenCalledWith(
      'city',
      'São Paulo',
    );
  });

  it('extracts edited messages but not regenerated messages', async () => {
    const memoryService = {
      ensureConversation: jest.fn(),
      saveMessage: jest.fn(),
    };
    const permanentMemoryService = {
      saveMemory: jest.fn(),
    };
    const memoryExtractorService = {
      extract: jest.fn().mockResolvedValue({ memories: [] }),
    };
    const conversationService = {
      stream: jest.fn(async function* () {
        yield 'Resposta';
      }),
    };
    const command = {
      matches: jest.fn().mockReturnValue(false),
      execute: jest.fn(),
    };
    const service = new BrainService(
      memoryService as never,
      permanentMemoryService as never,
      memoryExtractorService as never,
      conversationService as never,
      command as never,
      command as never,
      command as never,
    );
    const request = {
      message: 'Minha cidade é Recife',
      conversationId: '4d8c7407-ae5d-432a-9a4f-765494922852',
      userMessageId: 'ea292694-baaf-4dd2-9bc6-6d7b0e2899e1',
      assistantMessageId: 'fe7c49aa-5cb4-4c2a-9144-7d440eb7e582',
    };

    for await (const _chunk of service.stream({
      ...request,
      operation: 'edit',
    })) {
      // Consume the stream.
    }

    for await (const _chunk of service.stream({
      ...request,
      operation: 'regenerate',
    })) {
      // Consume the stream.
    }

    expect(memoryExtractorService.extract).toHaveBeenCalledTimes(1);
    expect(memoryExtractorService.extract).toHaveBeenCalledWith(
      'Minha cidade é Recife',
    );
  });

  it('keeps the explicit name rule authoritative and isolates extractor failures', async () => {
    const memoryService = {
      ensureConversation: jest.fn(),
      saveMessage: jest.fn(),
    };
    const permanentMemoryService = {
      saveMemory: jest.fn().mockResolvedValue(undefined),
    };
    const memoryExtractorService = {
      extract: jest
        .fn()
        .mockResolvedValueOnce({
          memories: [
            { key: 'name', value: 'Outro nome' },
            { key: 'city', value: 'Recife' },
          ],
        })
        .mockRejectedValueOnce(new Error('Extractor indisponível')),
    };
    const conversationService = {
      stream: jest.fn(async function* () {
        yield 'Resposta';
      }),
    };
    const command = {
      matches: jest.fn().mockReturnValue(false),
      execute: jest.fn(),
    };
    const service = new BrainService(
      memoryService as never,
      permanentMemoryService as never,
      memoryExtractorService as never,
      conversationService as never,
      command as never,
      command as never,
      command as never,
    );
    const request = {
      conversationId: '4d8c7407-ae5d-432a-9a4f-765494922852',
      userMessageId: 'ea292694-baaf-4dd2-9bc6-6d7b0e2899e1',
      assistantMessageId: 'fe7c49aa-5cb4-4c2a-9144-7d440eb7e582',
      operation: 'new' as const,
    };

    for await (const _chunk of service.stream({
      ...request,
      message: 'Meu nome é João',
    })) {
      // Consume the stream.
    }
    await new Promise((resolve) => setImmediate(resolve));

    expect(permanentMemoryService.saveMemory).toHaveBeenCalledWith(
      'name',
      'João',
    );
    expect(permanentMemoryService.saveMemory).toHaveBeenCalledWith(
      'city',
      'Recife',
    );
    expect(permanentMemoryService.saveMemory).not.toHaveBeenCalledWith(
      'name',
      'Outro nome',
    );

    for await (const _chunk of service.stream({
      ...request,
      message: 'Tenho um hobby novo',
    })) {
      // The rejected extraction must not interrupt the stream.
    }
  });
});
