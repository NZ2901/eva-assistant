import { ConversationService } from './conversation.service';

describe('ConversationService', () => {
  it('builds the model context from one persisted conversation', async () => {
    const messages = [
      { role: 'user' as const, content: 'Olá' },
    ];
    const memoryService = {
      getConversationHistory: jest.fn().mockResolvedValue(messages),
    };
    const promptService = {
      build: jest.fn().mockResolvedValue('Prompt EVA'),
    };
    const aiService = {
      chat: jest.fn().mockResolvedValue('Resposta'),
    };
    const service = new ConversationService(
      aiService as never,
      memoryService as never,
      promptService as never,
    );

    await expect(
      service.chat('conversation-1', ['assistant-1']),
    ).resolves.toBe('Resposta');

    expect(memoryService.getConversationHistory).toHaveBeenCalledWith(
      'conversation-1',
      ['assistant-1'],
    );
    expect(aiService.chat).toHaveBeenCalledWith([
      { role: 'system', content: 'Prompt EVA' },
      ...messages,
    ]);
  });
});
