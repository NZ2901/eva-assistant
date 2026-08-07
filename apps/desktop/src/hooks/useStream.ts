import { useRef } from 'react';

import { chatService } from '../services/chat.service';

export function useStream() {
  const abortControllerRef =
    useRef<AbortController | null>(null);

  async function stream(
    message: string,
    onChunk: (chunk: string) => void,
  ) {
    const controller =
      new AbortController();

    abortControllerRef.current =
      controller;

    try {
      await chatService.streamMessage(
        {
          message,
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