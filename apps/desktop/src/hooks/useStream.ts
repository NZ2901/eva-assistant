import { useRef } from 'react';

import type { SendMessageRequest } from '../services/chat.service';
import { chatService } from '../services/chat.service';

export function useStream() {
  const abortControllerRef =
    useRef<AbortController | null>(null);

  async function stream(
    request: SendMessageRequest,
    onChunk: (chunk: string) => void,
  ) {
    const controller =
      new AbortController();

    abortControllerRef.current =
      controller;

    try {
      await chatService.streamMessage(
        {
          ...request,
        },
        onChunk,
        controller.signal,
      );
    } finally {
      abortControllerRef.current =
        null;
    }
  }

  function stop() {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }

  return {
    stream,
    stop,
  };
}
