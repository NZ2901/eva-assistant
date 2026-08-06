import { motion } from 'framer-motion';

import { MarkdownMessage } from './MarkdownMessage';
import type { MessageModel } from './types';

interface MessageProps {
  message: MessageModel;
  isStreaming: boolean;
}

export function Message({
  message,
  isStreaming,
}: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`
          max-w-[70%]
          rounded-3xl
          px-6
          py-4
          leading-7
          whitespace-pre-wrap

          ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'border border-blue-500/10 bg-[#141821] text-white'
          }
        `}
      >
        {isUser ? (
          message.content
        ) : (
          <MarkdownMessage
            content={message.content}
            isStreaming={isStreaming}
          />
        )}
      </div>
    </motion.div>
  );
}