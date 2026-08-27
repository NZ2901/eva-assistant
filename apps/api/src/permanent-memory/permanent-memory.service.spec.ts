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

  it('upserts a permanent memory by key', async () => {
    const prisma = {
      memory: {
        upsert: jest.fn(),
      },
    };
    const service = new PermanentMemoryService(prisma as never);

    await service.saveMemory('city', 'São Paulo');

    expect(prisma.memory.upsert).toHaveBeenCalledWith({
      where: { key: 'city' },
      update: { value: 'São Paulo' },
      create: { key: 'city', value: 'São Paulo' },
    });
  });
});
