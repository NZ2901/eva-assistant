import { Injectable } from '@nestjs/common';

@Injectable()
export class BrainService {
  chat(message: string) {
    return {
      response:`Olá, João. Você disse: "${message}". Ainda estou aprendendo, mas em breve conseguirei conversar naturalmente com você.`,
    };
  }
}