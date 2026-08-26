import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Message } from './Message';
import type { MessageModel } from './types';

interface ChatMessagesProps {
  messages: MessageModel[];
  isTyping: boolean;
  streamingMessageId: string | null;
  onRegenerate: (
    assistantId: string,
  ) => void;
  onEdit: (
    messageId: string,
    content: string,
  ) => void;
}

export function ChatMessages({
  messages,
  isTyping,
  streamingMessageId,
  onRegenerate,
  onEdit,
}: ChatMessagesProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [autoScroll, setAutoScroll] =
    useState(true);

  function handleScroll() {
    const container =
      containerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setAutoScroll(
      distanceFromBottom < 120,
    );
  }

  useEffect(() => {
    if (!autoScroll) return;

    const container =
      containerRef.current;

    if (!container) return;

    container.scrollTop =
      container.scrollHeight;
  }, [messages, autoScroll]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="
        flex
        flex-1
        flex-col
        gap-6
        overflow-y-auto
        px-4
        py-8
        scroll-smooth
      "
    >
      {messages.map((message, index) => {
        const isStreaming =
          streamingMessageId === message.id;

        const isLastMessage =
          index === messages.length - 1;

        const canRegenerate =
          message.role === 'assistant' &&
          isLastMessage &&
          !isTyping;

        const canEdit =
          message.role === 'user' &&
          index === messages.length - 2 &&
          !isTyping;

        return (
          <Message
            key={message.id}
            message={message}
            isStreaming={isStreaming}
            canRegenerate={
              canRegenerate
            }
            onRegenerate={() =>
              onRegenerate(message.id)
            }
            canEdit={canEdit}
            onEdit={content =>
              onEdit(
                message.id,
                content,
              )
            }
          />
        );
      })}
    </div>
  );
}