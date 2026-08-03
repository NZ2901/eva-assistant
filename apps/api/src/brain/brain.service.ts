import { Injectable } from '@nestjs/common';
import { MemoryService } from '../memory/memory.service';

@Injectable()
export class BrainService {
  constructor(
    private readonly memoryService: MemoryService,
  ) {}

  chat(message: string) {
    // Salva a mensagem na memória
    this.memoryService.saveMessage(message);

    // Consulta a memória
    const totalMessages = this.memoryService.getTotalMessages();
    const messages = this.memoryService.getMessages();

    // Quantas mensagens
    if (message.toLowerCase().includes('quantas mensagens')) {
      return {
        response: `Você enviou ${totalMessages} mensagens até agora.`,
      };
    }

    // Primeira mensagem
    if (message.toLowerCase().includes('primeira mensagem')) {
      return {
        response: `Sua primeira mensagem foi: "${messages[0]}"`,
      };
    }

    // Última mensagem (ignora a própria pergunta)
    if (message.toLowerCase().includes('última mensagem')) {
      const lastMessage = messages.at(-2);

      return {
        response: lastMessage
          ? `Sua última mensagem foi: "${lastMessage}"`
          : 'Você ainda não possui mensagens anteriores.',
      };
    }

    // Resposta padrão
    return {
      response: `Olá, João. Você disse: "${message}". Até agora nossa conversa possui ${totalMessages} mensagens.`,
    };
  }
}