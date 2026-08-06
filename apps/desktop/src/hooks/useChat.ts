import { useRef, useState } from 'react';

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

  const abortControllerRef =
    useRef<AbortController | null>(null);

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

      const controller = new AbortController();

      abortControllerRef.current = controller;

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
        controller.signal,
      );

      setOrbState('speaking');

      await new Promise(resolve =>
        setTimeout(resolve, 500),
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

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
      abortControllerRef.current = null;
      setStreamingMessageId(null);
      setIsTyping(false);
      setOrbState('idle');
    }
  }

  function stopGeneration() {
    abortControllerRef.current?.abort();
  }

  return {
    messages,
    orbState,
    isTyping,
    streamingMessageId,
    sendMessage,
    stopGeneration,
  };
}