import { Test, TestingModule } from '@nestjs/testing';
import { PermanentMemoryService } from './permanent-memory.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PermanentMemoryService', () => {
  let service: PermanentMemoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermanentMemoryService,
        {
          provide: PrismaService,
          useValue: {
            memory: {
              upsert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PermanentMemoryService>(PermanentMemoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});