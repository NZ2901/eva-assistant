import { useState } from 'react';

import type { MessageModel } from '../components/chat/types';
import type { OrbState } from '../components/orb/OrbState';
import { chatService } from '../services/chat.service';

export function useChat() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [orbState, setOrbState] =
    useState<OrbState>('idle');
  const [isTyping, setIsTyping] =
    useState(false);

  const [streamingMessageId, setStreamingMessageId] =
    useState<string | null>(null);

  async function sendMessage(content: string) {
    const value = content.trim();

    if (!value) return;

    const userMessage: MessageModel = {
      id: crypto.randomUUID(),
      role: 'user',
      content: value,
      createdAt: new Date(),
    };

    const assistantId = crypto.randomUUID();

    setStreamingMessageId(assistantId);

    setMessages(previous => [
      ...previous,
      userMessage,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      },
    ]);

    setOrbState('thinking');
    setIsTyping(true);

    try {
      let assistantContent = '';

      await chatService.streamMessage(
        {
          message: value,
        },
        chunk => {
          assistantContent += chunk;

          setMessages(previous =>
            previous.map(message =>
              message.id === assistantId
                ? {
                    ...message,
                    content: assistantContent,
                  }
                : message,
            ),
          );
        },
      );

      setOrbState('speaking');

      await new Promise(resolve =>
        setTimeout(resolve, 500),
      );
    } catch {
      setMessages(previous =>
        previous.map(message =>
          message.id === assistantId
            ? {
                ...message,
                content:
                  'Desculpe, ocorreu um erro ao processar sua solicitação.',
              }
            : message,
        ),
      );
    } finally {
      setStreamingMessageId(null);
      setIsTyping(false);
      setOrbState('idle');
    }
  }

  return {
    messages,
    orbState,
    isTyping,
    streamingMessageId,
    sendMessage,
  };
}