import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryService {
  private messages: string[] = [];

  saveMessage(message: string): void {
    this.messages.push(message);
  }

  getMessages(): string[] {
    return this.messages;
  }

  getTotalMessages(): number {
    return this.messages.length;
  }
}