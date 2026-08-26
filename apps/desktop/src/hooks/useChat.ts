import { useState } from 'react';

import type { MessageModel } from '../components/chat/types';
import type { OrbState } from '../components/orb/OrbState';
import { useSpeech } from './useSpeech';
import { useStream } from './useStream';
import type { ChatOperation } from '../api/chat.api';

export function useChat() {
  const [conversationId] = useState(() =>
    crypto.randomUUID(),
  );

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

  const {
    speak,
    stop: stopSpeaking,
  } = useSpeech();

  async function generateResponse(
    content: string,
    userMessageId: string,
    assistantId: string,
    operation: ChatOperation,
  ) {
    setStreamingMessageId(assistantId);
    setOrbState('thinking');

    try {
      let assistantContent = '';

      await stream(
        {
          message: content,
          conversationId,
          userMessageId,
          assistantMessageId: assistantId,
          operation,
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

      speak(assistantContent);

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

  async function sendMessage(content: string) {
    const value = content.trim();

    if (!value || isTyping) return;

    const userMessage: MessageModel = {
      id: crypto.randomUUID(),
      role: 'user',
      content: value,
      createdAt: new Date(),
    };

    const assistantId = crypto.randomUUID();

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

    await generateResponse(
      value,
      userMessage.id,
      assistantId,
      'new',
    );
  }

  async function regenerateMessage(
    assistantId: string,
  ) {
    if (isTyping) return;

    const assistantIndex =
      messages.findIndex(
        message =>
          message.id === assistantId,
      );

    if (assistantIndex === -1) return;

    const userMessage =
      messages[assistantIndex - 1];

    if (!userMessage) return;

    if (userMessage.role !== 'user') return;

    setMessages(previous =>
      previous.map(message =>
        message.id === assistantId
          ? {
              ...message,
              content: '',
            }
          : message,
      ),
    );

    await generateResponse(
      userMessage.content,
      userMessage.id,
      assistantId,
      'regenerate',
    );
  }

  async function editMessage(
    messageId: string,
    content: string,
  ) {
    if (isTyping) return;

    const value = content.trim();

    if (!value) return;

    const messageIndex =
      messages.findIndex(
        message =>
          message.id === messageId,
      );

    if (messageIndex === -1) return;

    const message =
      messages[messageIndex];

    if (message.role !== 'user') return;

    const assistantMessage =
      messages[messageIndex + 1];

    if (
      !assistantMessage ||
      assistantMessage.role !== 'assistant'
    ) {
      return;
    }

    const updatedUserMessage: MessageModel = {
      ...message,
      content: value,
    };

    setMessages(previous => [
      ...previous.slice(0, messageIndex),
      updatedUserMessage,
      {
        ...assistantMessage,
        content: '',
      },
      ...previous.slice(messageIndex + 2),
    ]);

    await generateResponse(
      value,
      message.id,
      assistantMessage.id,
      'edit',
    );
  }

  function stopGeneration() {
    stop();
    stopSpeaking();
  }

  return {
    messages,
    orbState,
    isTyping,
    streamingMessageId,
    sendMessage,
    regenerateMessage,
    editMessage,
    stopGeneration,
  };
}
