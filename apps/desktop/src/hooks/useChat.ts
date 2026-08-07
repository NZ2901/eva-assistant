import { useState } from 'react';

import type { MessageModel } from '../components/chat/types';
import type { OrbState } from '../components/orb/OrbState';
import { useStream } from './useStream';

export function useChat() {
  const [messages, setMessages] =
    useState<MessageModel[]>([]);

  const [orbState, setOrbState] =
    useState<OrbState>('idle');

  const [streamingMessageId, setStreamingMessageId] =
    useState<string | null>(null);

  const isTyping =
    streamingMessageId !== null;

  const {
    stream,
    stop,
  } = useStream();

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

    try {
      let assistantContent = '';

      await stream(
        value,
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
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === 'AbortError'
      ) {
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
      setStreamingMessageId(null);
      setOrbState('idle');
    }
  }

  function stopGeneration() {
    stop();
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