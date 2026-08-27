import { useEffect, useRef, useState } from 'react';

import type { MessageModel } from '../components/chat/types';
import type { OrbState } from '../components/orb/OrbState';
import { useSpeech } from './useSpeech';
import { useStream } from './useStream';
import type { ChatOperation } from '../api/chat.api';
import {
  createConversation,
  getConversation,
  listConversations,
} from '../api/chat.api';
import type { ConversationSummary } from '../api/chat.api';

export function useChat() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const lifecycleVersion = useRef(0);
  const createConversationPromise = useRef<Promise<Awaited<ReturnType<typeof createConversation>> | null>>(null);

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

  async function ensureConversation(expectedVersion = lifecycleVersion.current) {
    if (conversationId) return conversationId;
    if (!createConversationPromise.current) {
      createConversationPromise.current = createConversation()
        .catch((error) => {
          console.error('Erro ao criar conversa:', error);
          return null;
        })
        .finally(() => {
          createConversationPromise.current = null;
        });
    }
    const created = await createConversationPromise.current;
    if (!created) return null;
    if (expectedVersion !== lifecycleVersion.current) return created.id;
    setConversationId(created.id);
    setConversations((previous) => [
      { id: created.id, createdAt: created.createdAt, updatedAt: created.updatedAt, preview: null },
      ...previous.filter((item) => item.id !== created.id),
    ]);
    localStorage.setItem('eva.conversationId', created.id);
    return created.id;
  }

  useEffect(() => {
    const version = lifecycleVersion.current;
    let active = true;
    void listConversations().then(async (items) => {
      if (!active || version !== lifecycleVersion.current) return;
      setConversations(items);
      const savedId = localStorage.getItem('eva.conversationId');
      if (savedId && !items.some((item) => item.id === savedId)) {
        localStorage.removeItem('eva.conversationId');
      }
      const selected = items.find((item) => item.id === savedId) ?? items[0];
      if (selected) {
        let conversation;
        try {
          conversation = await getConversation(selected.id);
        } catch (error) {
          if (savedId === selected.id) localStorage.removeItem('eva.conversationId');
          if (!active || version !== lifecycleVersion.current) return;
          const created = await createConversation();
          if (!active || version !== lifecycleVersion.current) return;
          conversation = created;
        }
        if (!conversation || !active || version !== lifecycleVersion.current) return;
        setConversationId(conversation.id);
        setMessages(conversation.messages.map((message) => ({
          ...message,
          createdAt: new Date(message.createdAt),
        })));
        localStorage.setItem('eva.conversationId', conversation.id);
      } else {
        const created = await createConversation();
        if (active && version === lifecycleVersion.current) {
          setConversationId(created.id);
          setConversations([{
            id: created.id,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
            preview: null,
          }]);
          localStorage.setItem('eva.conversationId', created.id);
        }
      }
    }).catch((error) => console.error('Erro ao carregar conversas:', error));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (conversationId) localStorage.setItem('eva.conversationId', conversationId);
  }, [conversationId]);

  async function generateResponse(
    content: string,
    userMessageId: string,
    assistantId: string,
    operation: ChatOperation,
    activeConversationId: string,
    responseVersion: number,
  ) {
    setStreamingMessageId(assistantId);
    setOrbState('thinking');

    try {
      let assistantContent = '';

      await stream(
        {
          message: content,
          conversationId: activeConversationId,
          userMessageId,
          assistantMessageId: assistantId,
          operation,
        },
        chunk => {
          assistantContent += chunk;

          if (responseVersion !== lifecycleVersion.current) return;

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
      if (responseVersion === lifecycleVersion.current) {
        setStreamingMessageId(null);
        setOrbState('idle');
      }
      void listConversations()
        .then(setConversations)
        .catch((error) => console.error('Erro ao atualizar conversas:', error));
    }
  }

  async function sendMessage(content: string) {
    const value = content.trim();

    if (!value || isTyping) return;

    let activeConversationId = conversationId;
    let responseVersion = lifecycleVersion.current;
    if (!activeConversationId) {
      responseVersion = ++lifecycleVersion.current;
      activeConversationId = await ensureConversation(responseVersion);
      if (!activeConversationId) return;
    }

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
      activeConversationId,
      responseVersion,
    );
  }

  async function newConversation() {
    if (isTyping) return;
    const version = ++lifecycleVersion.current;
    stop();
    stopSpeaking();
    const created = await createConversation();
    if (version !== lifecycleVersion.current) return;
    setConversationId(created.id);
    setMessages([]);
    setConversations((previous) => [
      { id: created.id, createdAt: created.createdAt, updatedAt: created.updatedAt, preview: null },
      ...previous.filter((item) => item.id !== created.id),
    ]);
  }

  async function selectConversation(id: string) {
    if (isTyping || id === conversationId) return;
    const version = ++lifecycleVersion.current;
    setConversationId(id);
    setMessages([]);
    stop();
    stopSpeaking();
    let conversation;
    try {
      conversation = await getConversation(id);
    } catch (error) {
      localStorage.removeItem('eva.conversationId');
      const created = await createConversation();
      if (version !== lifecycleVersion.current) return;
      conversation = created;
    }
    if (version !== lifecycleVersion.current) return;
    setConversationId(conversation.id);
    setMessages(conversation.messages.map((message) => ({
      ...message,
      createdAt: new Date(message.createdAt),
    })));
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
      conversationId!,
      lifecycleVersion.current,
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
      conversationId!,
      lifecycleVersion.current,
    );
  }

  function stopGeneration() {
    stop();
    stopSpeaking();
  }

  return {
    messages,
    conversationId,
    conversations,
    orbState,
    isTyping,
    streamingMessageId,
    sendMessage,
    regenerateMessage,
    editMessage,
    stopGeneration,
    newConversation,
    selectConversation,
  };
}
