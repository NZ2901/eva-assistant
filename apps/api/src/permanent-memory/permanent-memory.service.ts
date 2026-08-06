import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermanentMemoryService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMemory(key: string, value: string): Promise<void> {
    await this.prisma.memory.upsert({
      where: {
        key,
      },
      update: {
        value,
      },
      create: {
        key,
        value,
      },
    });
  }

  async getMemory(key: string): Promise<string | null> {
    const memory = await this.prisma.memory.findUnique({
      where: {
        key,
      },
    });

    return memory?.value ?? null;
  }

  async getAllMemories() {
    return this.prisma.memory.findMany({
      orderBy: {
        key: 'asc',
      },
    });
  }
}
