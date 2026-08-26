import { Test, TestingModule } from '@nestjs/testing';
import { MemoryExtractorService } from './memory-extractor.service';
import { AIService } from '../ai/ai.service';

describe('MemoryExtractorService', () => {
  let service: MemoryExtractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoryExtractorService,
        {
          provide: AIService,
          useValue: {
            chat: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MemoryExtractorService>(MemoryExtractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});