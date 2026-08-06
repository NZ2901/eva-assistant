import { useState } from 'react';

import type { OrbState } from '../components/orb/OrbState';
import type { MessageModel } from '../components/chat/types';

export function useChat() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [orbState, setOrbState] =
    useState<OrbState>('idle');
  const [isTyping, setIsTyping] = useState(false);

  async function sendMessage(content: string) {
    const userMessage: MessageModel = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date(),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setOrbState('thinking');
    setIsTyping(true);

    // Mock temporário
    await new Promise((resolve) =>
      setTimeout(resolve, 1500),
    );

    const assistantMessage: MessageModel = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        'Olá! 👋 Esta é uma resposta simulada da EVA. Em breve ela será gerada pelo backend NestJS.',
      createdAt: new Date(),
    };

    setMessages((previous) => [
      ...previous,
      assistantMessage,
    ]);

    setIsTyping(false);

    setOrbState('speaking');

    await new Promise((resolve) =>
      setTimeout(resolve, 700),
    );

    setOrbState('idle');
  }

  return {
    messages,
    orbState,
    isTyping,
    sendMessage,
  };
}