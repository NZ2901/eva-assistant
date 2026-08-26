import { PromptService } from './prompt.service';

describe('PromptService', () => {
  it('includes permanent memories as factual context', async () => {
    const personalityService = {
      build: jest.fn().mockReturnValue({
        systemPrompt: 'Você é EVA.',
      }),
    };
    const permanentMemoryService = {
      getAllMemories: jest.fn().mockResolvedValue([
        { key: 'name', value: 'João' },
      ]),
    };
    const service = new PromptService(
      personalityService as never,
      permanentMemoryService as never,
    );

    await expect(service.build()).resolves.toContain(
      '- name: João',
    );
  });
});
