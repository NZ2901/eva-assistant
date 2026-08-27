import { MemoryExtractorService } from './memory-extractor.service';
import { AIService } from '../ai/ai.service';
import { MEMORY_EXTRACTOR_PROMPT } from './prompts/memory-extractor.prompt';

describe('MemoryExtractorService', () => {
  it('sends the message to the extractor prompt and returns valid memories', async () => {
    const aiService = {
      chat: jest.fn().mockResolvedValue(
        JSON.stringify({
          memories: [{ key: ' City ', value: ' São Paulo\n' }],
        }),
      ),
    };
    const service = new MemoryExtractorService(aiService as never);

    await expect(service.extract('Moro em São Paulo.')).resolves.toEqual({
      memories: [{ key: 'city', value: 'São Paulo' }],
    });
    expect(aiService.chat).toHaveBeenCalledWith([
      { role: 'system', content: MEMORY_EXTRACTOR_PROMPT },
      { role: 'user', content: 'Moro em São Paulo.' },
    ]);
  });

  it('returns null for malformed JSON or an invalid response shape', async () => {
    const aiService = {
      chat: jest
        .fn()
        .mockResolvedValueOnce('not json')
        .mockResolvedValueOnce(JSON.stringify({ memories: 'invalid' })),
    };
    const service = new MemoryExtractorService(aiService as never);

    await expect(service.extract('Olá')).resolves.toBeNull();
    await expect(service.extract('Olá')).resolves.toBeNull();
  });

  it('drops invalid, duplicate and oversized memory candidates', async () => {
    const aiService = {
      chat: jest.fn().mockResolvedValue(
        JSON.stringify({
          memories: [
            { key: 'valid_key', value: 'valor válido' },
            { key: 'valid_key', value: 'duplicado' },
            { key: 'invalid key', value: 'valor' },
            { key: 'too_long', value: 'a'.repeat(501) },
            { key: 'valid_second', value: 'segundo valor' },
          ],
        }),
      ),
    };
    const service = new MemoryExtractorService(aiService as never);

    await expect(service.extract('Olá')).resolves.toEqual({
      memories: [
        { key: 'valid_key', value: 'valor válido' },
        { key: 'valid_second', value: 'segundo valor' },
      ],
    });
  });
});
