import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';

import { MEMORY_EXTRACTOR_PROMPT } from './prompts/memory-extractor.prompt';
import { MemoryExtractionResult } from './dto/memory.dto';

@Injectable()
export class MemoryExtractorService {
  constructor(
    private readonly aiService: AIService,
  ) {}

  async extract(
    message: string,
  ): Promise<MemoryExtractionResult | null> {
    const response = await this.aiService.chat([
      {
        role: 'system',
        content: MEMORY_EXTRACTOR_PROMPT,
      },
      {
        role: 'user',
        content: message,
      },
    ]);

    console.log(response);

    try {
      return JSON.parse(response) as MemoryExtractionResult;
    } catch {
      return null;
    }
  }
}
