import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';

import { MEMORY_EXTRACTOR_PROMPT } from './prompts/memory-extractor.prompt';
import { MemoryExtractionResult } from './dto/memory.dto';

const MAX_MEMORIES_PER_MESSAGE = 10;
const MAX_MEMORY_KEY_LENGTH = 64;
const MAX_MEMORY_VALUE_LENGTH = 500;
const MEMORY_KEY_PATTERN = /^[a-z][a-z0-9_]*$/;

@Injectable()
export class MemoryExtractorService {
  constructor(private readonly aiService: AIService) {}

  async extract(message: string): Promise<MemoryExtractionResult | null> {
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

    try {
      return this.validate(JSON.parse(response));
    } catch {
      return null;
    }
  }

  private validate(result: unknown): MemoryExtractionResult | null {
    if (!result || typeof result !== 'object' || Array.isArray(result)) {
      return null;
    }

    const extraction = result as {
      memories?: unknown;
    };

    if (!Array.isArray(extraction.memories)) {
      return null;
    }

    const memories: MemoryExtractionResult['memories'] = [];
    const keys = new Set<string>();

    for (const memory of extraction.memories) {
      if (!memory || typeof memory !== 'object' || Array.isArray(memory)) {
        continue;
      }

      const candidate = memory as {
        key?: unknown;
        value?: unknown;
      };

      if (
        typeof candidate.key !== 'string' ||
        typeof candidate.value !== 'string'
      ) {
        continue;
      }

      const key = candidate.key.trim().toLowerCase();
      const value = candidate.value.trim().replace(/\s+/g, ' ');

      if (
        !key ||
        key.length > MAX_MEMORY_KEY_LENGTH ||
        !MEMORY_KEY_PATTERN.test(key) ||
        !value ||
        value.length > MAX_MEMORY_VALUE_LENGTH ||
        keys.has(key)
      ) {
        continue;
      }

      keys.add(key);
      memories.push({ key, value });

      if (memories.length === MAX_MEMORIES_PER_MESSAGE) {
        break;
      }
    }

    return { memories };
  }
}
