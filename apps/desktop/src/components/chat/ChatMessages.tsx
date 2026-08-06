import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { MessageModel } from './types';

interface ChatMessagesProps {
  messages: MessageModel[];
  isTyping: boolean;
}

export function ChatMessages({
  messages,
  isTyping,
}: ChatMessagesProps) {
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
      "
    >
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
        />
      ))}

      {isTyping && <TypingIndicator />}
    </div>
  );
}