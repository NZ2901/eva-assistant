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
}

export function ChatMessages({
  messages,
  isTyping,
  streamingMessageId,
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

    setAutoScroll(distanceFromBottom < 120);
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
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          isStreaming={
            streamingMessageId === message.id
          }
        />
      ))}
    </div>
  );
}