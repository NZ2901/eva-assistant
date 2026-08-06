import { useEffect, useRef } from 'react';

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
  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  return (
    <div
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
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          isStreaming={
            streamingMessageId === message.id
          }
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}